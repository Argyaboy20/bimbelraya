<!-- RewardTentor.vue (tentor) -->
<template>
  <div class="reward-tentor-page">
    <div class="page-content">
      <router-link :to="`/tentor/dashboardtentor/${kodeTentor}`" class="link-kembali">
        <ChevronLeft size="1.15em" class="ikon-inline" /> Kembali
      </router-link>

      <h1 class="page-title">Reward Bulanan Tentor</h1>
      <p class="page-sub">Best Tentor of the Month · {{ labelBulan }}</p>

      <p v-if="galat" class="pesan-galat">{{ galat }}</p>

      <template v-else-if="reward">
        <div v-if="!reward.sudahDiumumkan" class="kosong-card">
          <span class="kosong-ikon"><Hourglass size="1em" /></span>
          <h2 class="kosong-judul">Belum diumumkan</h2>
          <p class="kosong-teks">Reward bulan ini belum diumumkan. Pantau terus ya!</p>
        </div>

        <!-- Daftar tentor urut dari nilai tertinggi; baris milik kamu di-highlight hijau -->
        <div v-else class="hasil-reward">
          <ol class="daftar-tentor">
            <li
              v-for="(t, i) in reward.daftar"
              :key="i"
              class="baris-tentor"
              :class="{ saya: t.saya }"
            >
              <span class="no-urut">{{ t.peringkat }}</span>
              <span class="nama-tentor">{{ t.namaTentor }}</span>
            </li>
          </ol>

          <!-- Kotak ucapan sesuai peringkat (juara 1, 2, 3, dan 4 seterusnya) -->
          <div v-if="reward.sudahDiumumkan && saya" class="ucapan" :class="kelasUcapan">
            <span class="ucapan-ikon"><component :is="ikonUcapan" size="1em" /></span>
            <p class="ucapan-1">{{ ucapan[0] }}</p>
            <p class="ucapan-2" :class="{ besar: peringkatSaya >= 1 && peringkatSaya <= 3 }">
              {{ ucapan[1] }}
            </p>
            <p class="ucapan-3">{{ ucapan[2] }}</p>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
defineOptions({ name: 'RewardTentor' })
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { api, ApiError } from '@/api/http'
import { namaBulan, bulanSekarang } from '@/stores/reward'
import { ChevronLeft, Hourglass, Trophy, Medal, Sparkles } from 'lucide-vue-next'


const route = useRoute()
const kodeTentor = computed(() => route.params.id)

const reward = ref(null) // { bulan, sudahDiumumkan, daftar: [{ namaTentor, peringkat, saya }], ... }
const galat = ref('')

const labelBulan = computed(() => namaBulan(reward.value?.bulan ?? bulanSekarang()))
// ===== KOTAK UCAPAN (isi sama dengan notif di dashboard tentor) =====
const saya = computed(() => reward.value?.saya ?? null)
const peringkatSaya = computed(() => saya.value?.peringkat ?? 0)
const namaSaya = computed(() => saya.value?.namaTentor ?? '')

const kelasUcapan = computed(() => {
  const p = peringkatSaya.value
  return p >= 1 && p <= 3 ? `juara-${p}` : 'biasa'
})
const ikonUcapan = computed(() => {
  const p = peringkatSaya.value
  if (p === 1) return Trophy
  if (p === 2 || p === 3) return Medal
  return Sparkles
})
const ucapan = computed(() => {
  const p = peringkatSaya.value
  if (p === 1) {
    return [
      `Selamat ${namaSaya.value} sebagai`,
      'Juara 1',
      `di Reward Best Tentor of the Month untuk ${labelBulan.value}. Silakan chat admin untuk klaim hadiahnya`,
    ]
  }
  if (p === 2 || p === 3) {
    return [
      `Selamat ${namaSaya.value} sebagai`,
      `Juara ${p}`,
      `di Reward Best Tentor of the Month untuk ${labelBulan.value}. Tingkatkan lagi bulan depannya ya!`,
    ]
  }
  return [
    'Mohon maaf, kamu belum terpilih di Reward Best Tentor of the Month di bulan ini.',
    'Jangan bersedih, masih ada bulan lainnya',
    `Tetap semangat kak ${namaSaya.value}`,
  ]
})

onMounted(async () => {
  try {
    reward.value = await api('/api/tentor/reward')
  } catch (e) {
    // 401 = sesi habis: sudah otomatis dialihkan ke login
    if (e instanceof ApiError && e.status === 401) return
    galat.value = e instanceof ApiError ? e.message : 'Gagal memuat data reward'
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

/* =============================================================
   BASE STYLES (MOBILE FIRST)
   Default di bawah ini = tampilan MOBILE (<= 640px).
   Breakpoint override secara berurutan:
   1) @media (min-width: 641px)  -> Tablet
   2) @media (min-width: 768px)  -> Desktop
   3) @media (min-width: 1024px) -> Large Desktop
   ============================================================= */
* {
  font-family: 'DM Sans', sans-serif;
  box-sizing: border-box;
}

.reward-tentor-page {
  width: 100%;
  min-height: 100vh;
  background-color: #fafafa;
  background-image:
    radial-gradient(circle at 10% 15%, rgba(46, 135, 246, 0.1) 0%, transparent 45%),
    radial-gradient(circle at 90% 10%, rgba(243, 92, 43, 0.1) 0%, transparent 40%);
}

.page-content {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 1.25rem 0.85rem 2.5rem;
}

.link-kembali {
  display: inline-block;
  margin-bottom: 0.8rem;
  font-size: 0.8rem;
  font-weight: 700;
  color: #2e87f6;
  text-decoration: none;
}

.ikon-inline {
  display: inline-block;
  vertical-align: -0.18em;
  margin-right: 0.1rem;
}

.page-title {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 700;
  color: #1f2937;
}
.page-sub {
  margin: 0.2rem 0 1rem;
  font-size: 0.78rem;
  color: #6b7280;
}

/* ===== KARTU "BELUM DIUMUMKAN" ===== */
.kosong-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  width: 100%;
  padding: 1.8rem 1.2rem;
  border: 2px dashed rgba(46, 135, 246, 0.45);
  border-radius: 18px;
  text-align: center;
  background-color: #fff;
  background-image: radial-gradient(rgba(46, 135, 246, 0.1) 1.2px, transparent 1.5px);
  background-size: 16px 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
}
.kosong-ikon {
  width: 56px;
  height: 56px;
  margin-bottom: 0.4rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  color: #fff;
  background: linear-gradient(135deg, #2e87f6 0%, #1d6fd4 100%);
  box-shadow: 0 6px 16px rgba(46, 135, 246, 0.35);
  animation: balik-jam 3s ease-in-out infinite;
}
@keyframes balik-jam {
  0%,
  60% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(180deg);
  }
}
.kosong-judul {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: #1f2937;
}
.kosong-teks {
  margin: 0;
  font-size: 0.82rem;
  line-height: 1.5;
  color: #6b7280;
}

/* ===== KOTAK UCAPAN ===== */
.ucapan {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  width: 100%;
  margin-top: 1rem;
  padding: 1.3rem 1.1rem;
  border-radius: 18px;
  text-align: center;
  color: #fff;
}
.ucapan-ikon {
  width: 48px;
  height: 48px;
  margin-bottom: 0.2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  background: rgba(255, 255, 255, 0.25);
}
.ucapan-1,
.ucapan-2,
.ucapan-3 {
  margin: 0;
}
.ucapan-1 {
  font-size: 0.88rem;
  font-weight: 600;
  line-height: 1.45;
}
.ucapan-2 {
  font-size: 0.88rem;
  font-weight: 600;
}
.ucapan-2.besar {
  font-size: 1.7rem;
  font-weight: 800;
  line-height: 1.2;
}
.ucapan-3 {
  font-size: 0.82rem;
  line-height: 1.5;
  opacity: 0.95;
}
.ucapan.juara-1 {
  background: linear-gradient(135deg, #22a559 0%, #178044 100%);
  box-shadow: 0 10px 24px rgba(34, 165, 89, 0.35);
}
.ucapan.juara-2 {
  background: linear-gradient(135deg, #2e87f6 0%, #1d6fd4 100%);
  box-shadow: 0 10px 24px rgba(46, 135, 246, 0.35);
}
.ucapan.juara-3 {
  color: #5a4a1f;
  background: linear-gradient(135deg, #f9eccc 0%, #f3dfa8 100%);
  box-shadow: 0 10px 24px rgba(243, 223, 168, 0.55);
}
.ucapan.juara-3 .ucapan-ikon {
  background: rgba(255, 255, 255, 0.55);
}
.ucapan.biasa {
  color: #374151;
  background: #fff;
  border: 1px solid #e5e7eb;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
}
.ucapan.biasa .ucapan-ikon {
  color: #2e87f6;
  background: #eaf3ff;
}

@media (prefers-reduced-motion: reduce) {
  .kosong-ikon {
    animation: none;
  }
}
.pesan-galat {
  font-size: 0.8rem;
  color: #b91c1c;
}

/* ===== DAFTAR TENTOR ===== */
.hasil-reward {
  display: flex;
  flex-direction: column;
}
.daftar-tentor {
  list-style: none;
  margin: 0;
  padding: 0;
  width: 100%;
  border-radius: 14px;
  background: #fff;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}
.baris-tentor {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.75rem 0.9rem;
  border-bottom: 1px solid #e5e7eb;
  border-left: 5px solid transparent;
}
.baris-tentor:last-child {
  border-bottom: none;
}
.baris-tentor.saya {
  background: #dcfce7;
  border-left-color: #22a559;
}
.no-urut {
  flex-shrink: 0;
  min-width: 28px;
  text-align: center;
  font-size: 0.85rem;
  font-weight: 700;
  color: #6b7280;
}
.nama-tentor {
  flex: 1;
  min-width: 0;
  font-size: 0.88rem;
  font-weight: 600;
  color: #1f2937;
}
.baris-tentor.saya .no-urut,
.baris-tentor.saya .nama-tentor {
  color: #14532d;
  font-weight: 700;
}

/* ===== TABLET (>= 641px) ===== */
@media (min-width: 641px) {
  .page-content {
    padding: 1.5rem 1.5rem 3rem;
  }
}

/* ===== DESKTOP (>= 768px): daftar di sisi kiri ===== */
@media (min-width: 768px) {
  .kosong-card {
    max-width: 560px;
  }
  .hasil-reward {
    flex-direction: row;
    align-items: flex-start;
    gap: 1.25rem;
  }
  .daftar-tentor {
    flex: 0 1 560px;
    max-width: 560px;
  }
  .ucapan {
    flex: 1 1 0;
    min-width: 0;
    max-width: 380px;
    margin-top: 0;
    position: sticky;
    top: 1rem;
  }
  .ucapan-2.besar {
    font-size: 2rem;
  }
}

/* ===== LARGE DESKTOP (>= 1024px) ===== */
@media (min-width: 1024px) {
  .page-content {
    padding: 2rem 2rem 3rem;
  }
  .hasil-reward {
    gap: 1.5rem;
  }
  .ucapan {
    max-width: 420px;
  }
}
</style>