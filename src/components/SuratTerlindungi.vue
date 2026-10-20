<!-- SuratTerlindungi.vue -->
<template>
  <div
    class="surat-terlindungi"
    @copy.prevent
    @cut.prevent
    @contextmenu.prevent
    @dragstart.prevent
    @selectstart.prevent
  >
    <div class="surat-bungkus" :class="{ tertutup }">
      <slot />
    </div>

    <!-- Watermark: tetap diam di atas surat walau isinya digulir -->
    <div class="surat-watermark" :style="{ backgroundImage: gambarWatermark }" aria-hidden="true"></div>

    <div v-if="tertutup" class="surat-tutup" role="status">
      Isi surat disembunyikan. Kembali ke halaman ini untuk membaca.
    </div>
  </div>
</template>

<script setup>
defineOptions({ name: 'SuratTerlindungi' })
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  nama: { type: String, default: '' },
  kode: { type: String, default: '' },
})

// ===== Tutup isi surat saat fokus hilang / ada tanda screenshot atau cetak =====
const tertutup = ref(false)
let timerBuka = null

const tutup = () => {
  clearTimeout(timerBuka)
  tertutup.value = true
}
const buka = (tunda = 150) => {
  clearTimeout(timerBuka)
  timerBuka = setTimeout(() => {
    if (document.visibilityState === 'visible' && document.hasFocus()) tertutup.value = false
  }, tunda)
}

const saatBlur = () => tutup()
const saatFokus = () => buka(150)
const saatVisibilitas = () => (document.visibilityState === 'hidden' ? tutup() : buka(150))
const saatCetak = () => tutup()
const saatSelesaiCetak = () => buka(300)

// Tombol Win/Cmd + Shift (alat potong layar, Cmd+Shift+3/4/5) → tutup sebentar
const saatTombolTekan = (e) => {
  if (e.metaKey && e.shiftKey) {
    tutup()
    buka(2000)
  }
}
// Print Screen: tutup, dan timpa gambar di clipboard dengan teks kosong
const saatTombolLepas = (e) => {
  if (e.key === 'PrintScreen') {
    tutup()
    navigator.clipboard?.writeText('').catch(() => {})
    buka(1500)
  }
}

onMounted(() => {
  window.addEventListener('blur', saatBlur)
  window.addEventListener('focus', saatFokus)
  document.addEventListener('visibilitychange', saatVisibilitas)
  window.addEventListener('beforeprint', saatCetak)
  window.addEventListener('afterprint', saatSelesaiCetak)
  window.addEventListener('keydown', saatTombolTekan)
  window.addEventListener('keyup', saatTombolLepas)
})

onBeforeUnmount(() => {
  clearTimeout(timerBuka)
  window.removeEventListener('blur', saatBlur)
  window.removeEventListener('focus', saatFokus)
  document.removeEventListener('visibilitychange', saatVisibilitas)
  window.removeEventListener('beforeprint', saatCetak)
  window.removeEventListener('afterprint', saatSelesaiCetak)
  window.removeEventListener('keydown', saatTombolTekan)
  window.removeEventListener('keyup', saatTombolLepas)
})

// ===== Watermark: nama · kode · jam, dimiringkan dan diulang =====
const waktuBuka = new Date().toLocaleString('id-ID', {
  timeZone: 'Asia/Jakarta',
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const gambarWatermark = computed(() => {
  const baris1 = esc(`${props.nama} · ${props.kode}`)
  const baris2 = esc(waktuBuka)
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="460" height="180">` +
    `<g transform="rotate(-20 230 90)" font-family="sans-serif" font-size="13" font-weight="700" fill="#1f2937" fill-opacity="0.14">` +
    `<text x="40" y="80">${baris1}</text><text x="40" y="100">${baris2}</text></g></svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
})
</script>

<style>
/* Tidak scoped: harus mengenai semua isi slot, termasuk teks dari v-html */
.surat-terlindungi,
.surat-terlindungi * {
  -webkit-user-select: none;
  user-select: none;
  -webkit-touch-callout: none;
}
@media print {
  .surat-terlindungi {
    display: none !important;
  }
}
</style>

<style scoped>
.surat-terlindungi {
  position: relative;
}
.surat-bungkus {
  transition: filter 0.15s ease;
}
.surat-bungkus.tertutup {
  filter: blur(14px);
  pointer-events: none;
}
.surat-watermark {
  position: absolute;
  inset: 0;
  border-radius: 12px;
  background-repeat: repeat;
  pointer-events: none;
}
.surat-tutup {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.6);
  text-align: center;
  font-size: 0.85rem;
  font-weight: 700;
  color: #1f2937;
}
</style>