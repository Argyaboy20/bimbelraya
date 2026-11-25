<!-- TentorChatBubble.vue: asisten AI di dashboard tentor (terpisah dari asisten landing page) -->
<template>
  <div class="ai-tentor">
    <!-- Tombol melayang: awan chat (tumbuh ke atas) lalu mengecil jadi ikon -->
    <div
      v-show="!terbuka"
      class="ai-float"
      :class="`is-${fase}`"
      role="button"
      tabindex="0"
      aria-label="Buka asisten AI Bimbel Raya"
      @click="buka"
      @keyup.enter="buka"
    >
      <span class="ai-teks">Hai! Aku asisten AI Bimbel Raya siap membantumu!</span>
      <span class="ai-ikon"><Bot :size="24" /></span>
    </div>

    <!-- Jendela chat -->
    <Transition name="ai-panel">
      <section v-if="terbuka" class="ai-panel" role="dialog" aria-label="Asisten AI Bimbel Raya">
        <div class="ai-header">
          <span class="ai-judul"><Bot :size="18" /> Asisten AI Tentor</span>
          <button class="ai-tutup" type="button" aria-label="Tutup" @click="tutup">
            <X :size="18" />
          </button>
        </div>

        <div ref="badan" class="ai-badan">
          <div v-for="(pesan, i) in pesanList" :key="i" class="ai-pesan" :class="pesan.dari">
            <div class="ai-gelembung">{{ pesan.teks }}</div>
          </div>
          <div v-if="memuat" class="ai-pesan bot">
            <div class="ai-gelembung memuat" aria-label="Asisten sedang mengetik">
              <span class="titik"></span><span class="titik"></span><span class="titik"></span>
            </div>
          </div>
        </div>

        <p class="ai-catatan">
          Dijawab oleh asisten AI. Jangan menulis data pribadi; untuk hal penting hubungi admin.
          <span v-if="sisa !== null"> Sisa pertanyaan hari ini: {{ sisa }}.</span>
        </p>

        <div class="ai-input-area">
          <input
            v-model="isian"
            maxlength="300"
            class="ai-input"
            :placeholder="sisa === 0 ? 'Jatah hari ini habis' : 'Ketik pesan...'"
            :disabled="sisa === 0"
            @keyup.enter="kirimPesan"
          />
          <button
            class="ai-kirim"
            type="button"
            aria-label="Kirim"
            :disabled="sisa === 0"
            @click="kirimPesan"
          >
            <Send :size="18" />
          </button>
        </div>
      </section>
    </Transition>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted, onUnmounted } from 'vue'
import { Bot, Send, X } from 'lucide-vue-next'
import { api, ApiError } from '@/api/http'

const RIWAYAT_MAKS = 10

// fase tombol: sembunyi -> awan -> ikon
const fase = ref('sembunyi')
const terbuka = ref(false)
const isian = ref('')
const memuat = ref(false)
const sisa = ref(null)
const badan = ref(null)
const pesanList = ref([])

let timerAwan = null
let timerIkon = null
let timerSapaan = null

onMounted(() => {
  timerAwan = setTimeout(() => (fase.value = 'awan'), 1200)
  timerIkon = setTimeout(() => {
    if (!terbuka.value) fase.value = 'ikon'
  }, 7500)
})

onUnmounted(() => {
  clearTimeout(timerAwan)
  clearTimeout(timerIkon)
  clearTimeout(timerSapaan)
})

const gulirKeBawah = () => {
  nextTick(() => {
    if (badan.value) badan.value.scrollTop = badan.value.scrollHeight
  })
}

const ambilSisa = async () => {
  try {
    const data = await api('/api/tentor/chat/sisa', { loading: false })
    sisa.value = data.sisa
  } catch {
    // jatah tidak tampil kalau gagal; tidak mengganggu chat
  }
}

const buka = () => {
  clearTimeout(timerAwan)
  clearTimeout(timerIkon)
  fase.value = 'ikon'
  terbuka.value = true
  ambilSisa()
  if (pesanList.value.length === 0) {
    clearTimeout(timerSapaan)
    timerSapaan = setTimeout(() => {
      if (pesanList.value.length === 0) {
        pesanList.value.push({
          dari: 'bot',
          teks: 'Hai, Kak! Aku asisten AI Bimbel Raya. Ada yang bisa kubantu soal SOP, presensi, atau kontrak?',
          sapaan: true,
        })
        gulirKeBawah()
      }
    }, 700)
  }
}

const tutup = () => {
  terbuka.value = false
  clearTimeout(timerSapaan)
}

const kirimPesan = async () => {
  const teks = isian.value.trim().slice(0, 300)
  if (!teks || memuat.value || sisa.value === 0) return
  clearTimeout(timerSapaan)

  // Sapaan awal dan pesan galat tidak ikut dikirim sebagai riwayat
  const riwayat = pesanList.value
    .filter((m) => !m.sapaan && !m.galat)
    .slice(-RIWAYAT_MAKS)
    .map((m) => ({ dari: m.dari, teks: m.teks.slice(0, 600) }))

  pesanList.value.push({ dari: 'user', teks })
  isian.value = ''
  memuat.value = true
  gulirKeBawah()

  try {
    const data = await api('/api/tentor/chat', {
      method: 'POST',
      body: { pesan: teks, riwayat },
      loading: false,
    })
    pesanList.value.push({ dari: 'bot', teks: data.jawaban })
    if (typeof data.sisa === 'number') sisa.value = data.sisa
  } catch (err) {
    if (err instanceof ApiError && err.status === 429) sisa.value = 0
    else ambilSisa() // jatah dikembalikan server saat AI gagal, jadi angka perlu dimuat ulang
    const pesan =
      err instanceof ApiError && err.message
        ? err.message
        : 'Maaf, asisten sedang tidak bisa menjawab. Coba lagi sebentar lagi ya, Kak.'
    pesanList.value.push({ dari: 'bot', teks: pesan, galat: true })
  } finally {
    memuat.value = false
    gulirKeBawah()
  }
}
</script>

<style scoped>
/* ===== TOMBOL MELAYANG: awan tumbuh ke atas, lalu menutup jadi ikon ===== */
.ai-float {
  position: fixed;
  right: 16px;
  bottom: calc(24px + env(safe-area-inset-bottom));
  z-index: 80;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0d8a9a;
  color: #fff;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(13, 138, 154, 0.4);
  transition:
    width 0.6s cubic-bezier(0.4, 0, 0.2, 1),
    height 0.6s cubic-bezier(0.4, 0, 0.2, 1),
    border-radius 0.6s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.5s ease,
    transform 0.6s cubic-bezier(0.34, 1.3, 0.64, 1);
}
.ai-float.is-sembunyi {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  opacity: 0;
  transform: translateY(28px);
  pointer-events: none;
}
.ai-float.is-awan {
  width: min(240px, calc(100vw - 32px));
  height: 72px;
  border-radius: 20px;
  padding: 0 16px;
  opacity: 1;
  transform: translateY(0);
}
.ai-float.is-ikon {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  opacity: 1;
  transform: translateY(0);
}
.ai-float.is-ikon:hover {
  transform: scale(1.07);
}

/* Ekor awan chat */
.ai-float::after {
  content: '';
  position: absolute;
  right: 18px;
  bottom: -8px;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 9px solid #0d8a9a;
  opacity: 0;
  transition: opacity 0.3s ease;
}
.ai-float.is-awan::after {
  opacity: 1;
  transition-delay: 0.4s;
}

.ai-teks {
  font-size: 13px;
  font-weight: 600;
  line-height: 1.35;
  opacity: 0;
  transition: opacity 0.3s ease;
}
.ai-float.is-awan .ai-teks {
  opacity: 1;
  transition-delay: 0.35s;
}
.ai-float.is-ikon .ai-teks,
.ai-float.is-sembunyi .ai-teks {
  position: absolute;
  max-width: 0;
  overflow: hidden;
}

.ai-ikon {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: scale(0.3) rotate(-30deg);
  transition:
    opacity 0.4s,
    transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.ai-float.is-ikon .ai-ikon {
  opacity: 1;
  transform: scale(1) rotate(0deg);
  transition-delay: 0.45s;
}

/* ===== JENDELA CHAT ===== */
.ai-panel {
  position: fixed;
  right: 16px;
  bottom: calc(24px + env(safe-area-inset-bottom));
  z-index: 81;
  width: calc(100vw - 32px);
  max-width: 380px;
  height: min(70vh, 520px);
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 12px 48px rgba(13, 138, 154, 0.3);
  overflow: hidden;
  transform-origin: bottom right;
  overscroll-behavior: contain;
}
.ai-panel-enter-active,
.ai-panel-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}
.ai-panel-enter-from,
.ai-panel-leave-to {
  opacity: 0;
  transform: translateY(24px) scale(0.9);
}

.ai-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #0d8a9a;
  color: #fff;
  padding: 0.85rem 1.1rem;
  font-weight: 700;
}
.ai-judul {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.95rem;
}
.ai-tutup {
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: #fff;
  cursor: pointer;
}

.ai-badan {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  background: #f3fafb;
}
.ai-pesan {
  display: flex;
}
.ai-pesan.bot {
  justify-content: flex-start;
}
.ai-pesan.user {
  justify-content: flex-end;
}
.ai-gelembung {
  max-width: 85%;
  padding: 0.6rem 0.85rem;
  border-radius: 16px;
  font-size: 0.85rem;
  line-height: 1.45;
  white-space: pre-wrap;
  word-break: break-word;
}
.ai-pesan.bot .ai-gelembung {
  background: #fff;
  color: #1f2d3d;
  border: 1px solid #d6ecef;
  border-bottom-left-radius: 4px;
}
.ai-pesan.user .ai-gelembung {
  background: #0d8a9a;
  color: #fff;
  border-bottom-right-radius: 4px;
}
/* Pesan masuk: muncul dari bawah, membesar sedikit melewati ukuran asli lalu mantul
   mengendap (seperti di WhatsApp). Pesan bot tumbuh dari sudut kiri bawah, pesan user dari kanan bawah. */
.ai-gelembung {
  animation: aiPesanMasuk 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.ai-pesan.bot .ai-gelembung {
  transform-origin: bottom left;
}
.ai-pesan.user .ai-gelembung {
  transform-origin: bottom right;
}
@keyframes aiPesanMasuk {
  0% {
    opacity: 0;
    transform: translateY(14px) scale(0.6);
  }
  55% {
    opacity: 1;
    transform: translateY(-3px) scale(1.06);
  }
  78% {
    transform: translateY(1px) scale(0.98);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
.ai-gelembung.memuat {
  display: flex;
  gap: 4px;
  padding: 0.8rem 0.95rem;
}
.titik {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #0d8a9a;
  animation: aiTitik 1.2s infinite ease-in-out;
}
.titik:nth-child(2) {
  animation-delay: 0.15s;
}
.titik:nth-child(3) {
  animation-delay: 0.3s;
}
@keyframes aiTitik {
  0%,
  80%,
  100% {
    opacity: 0.3;
    transform: translateY(0);
  }
  40% {
    opacity: 1;
    transform: translateY(-3px);
  }
}

.ai-catatan {
  margin: 0;
  padding: 0.45rem 1rem;
  font-size: 0.68rem;
  color: #5b6b7a;
  background: #f3fafb;
  border-top: 1px solid #e3f1f3;
}

.ai-input-area {
  display: flex;
  gap: 0.5rem;
  padding: 0.7rem;
  border-top: 1px solid #e3f1f3;
  background: #fff;
}
.ai-input {
  flex: 1;
  min-width: 0;
  padding: 0.6rem 0.9rem;
  border: 1.5px solid #cfe6ea;
  border-radius: 9999px;
  font-size: 16px; /* 16px mencegah iPhone memperbesar layar saat mengetik */
  outline: none;
}
.ai-input:focus {
  border-color: #0d8a9a;
}
.ai-input:disabled {
  background: #eef3f4;
}
.ai-kirim {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  flex-shrink: 0;
  border: none;
  border-radius: 50%;
  background: #0d8a9a;
  color: #fff;
  cursor: pointer;
}
.ai-kirim:disabled {
  background: #9fb8bd;
  cursor: not-allowed;
}

@media (prefers-reduced-motion: reduce) {
  .ai-float,
  .ai-panel-enter-active,
  .ai-panel-leave-active {
    transition-duration: 0.01s;
  }
  .ai-gelembung {
    animation: none;
  }
}

/* ===== TABLET ===== */
@media (min-width: 641px) {
  .ai-float,
  .ai-panel {
    right: 20px;
  }
  .ai-float.is-awan {
    width: 260px;
  }
  .ai-teks {
    font-size: 14px;
  }
}

/* ===== DESKTOP ===== */
@media (min-width: 768px) {
  .ai-float,
  .ai-panel {
    bottom: calc(28px + env(safe-area-inset-bottom));
  }
  .ai-float.is-sembunyi,
  .ai-float.is-ikon {
    width: 56px;
    height: 56px;
  }
}

/* ===== LARGE DESKTOP ===== */
@media (min-width: 1024px) {
  .ai-float,
  .ai-panel {
    right: 28px;
  }
  .ai-panel {
    max-width: 400px;
  }
}
</style>