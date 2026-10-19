<!-- RewardNotifModal.vue -->
<template>
  <Transition name="notif">
    <div v-if="tampil" class="notif-box" role="dialog" aria-live="polite">
      <p class="baris-1">{{ pesan[0] }}</p>
      <p class="baris-2" :class="{ juara: peringkat >= 1 && peringkat <= 3 }">{{ pesan[1] }}</p>
      <p class="baris-3">{{ pesan[2] }}</p>
      <button type="button" class="btn-ok" @click="tutup">OK</button>
    </div>
  </Transition>
</template>

<script setup>
defineOptions({ name: 'RewardNotifModal' })
import { ref, computed, onMounted } from 'vue'
import { api } from '@/api/http'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const reward = ref(null)
const tampil = ref(false)

// Tanda "sudah ditutup" disimpan per tentor dan per pengumuman (di browser ini saja)
const kunci = () => `rewardNotif:${authStore.kodeTentor}:${reward.value?.diumumkanPada}`

const sudahDitutup = () => {
  try {
    return localStorage.getItem(kunci()) === '1'
  } catch {
    return false
  }
}

onMounted(async () => {
  try {
    const data = await api('/api/tentor/reward', { loading: false })
    if (!data.sudahDiumumkan || !data.saya || data.sisaDetikNotif <= 0) return
    reward.value = data
    if (sudahDitutup()) return
    tampil.value = true
  } catch {
    // notif tidak wajib: gagal memuat = tidak ditampilkan
  }
})

function tutup() {
  tampil.value = false
  try {
    localStorage.setItem(kunci(), '1')
  } catch {
    // penyimpanan browser tidak tersedia: notif cukup tertutup untuk sesi ini
  }
}

const peringkat = computed(() => reward.value?.saya?.peringkat ?? 0)
const nama = computed(() => reward.value?.saya?.namaTentor ?? '')
const bulanTeks = computed(() =>
  reward.value
    ? new Date(reward.value.bulan + '-01T00:00:00Z').toLocaleDateString('id-ID', {
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
      })
    : '',
)

// Tiga baris isi notif sesuai peringkat
const pesan = computed(() => {
  const p = peringkat.value
  if (p === 1) {
    return [
      `Selamat ${nama.value} sebagai`,
      'Juara 1',
      `di Reward Best Tentor of the Month untuk ${bulanTeks.value}. Silakan chat admin untuk klaim hadiahnya`,
    ]
  }
  if (p === 2 || p === 3) {
    return [
      `Selamat ${nama.value} sebagai`,
      `Juara ${p}`,
      `di Reward Best Tentor of the Month untuk ${bulanTeks.value}. Tingkatkan lagi bulan depannya ya!`,
    ]
  }
  return [
    'Mohon maaf, kamu belum terpilih di Reward Best Tentor of the Month di bulan ini.',
    'Jangan bersedih, masih ada bulan lainnya',
    `Tetap semangat kak ${nama.value}`,
  ]
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

/* =============================================================
   BASE STYLES (MOBILE FIRST)
   Default di bawah ini = tampilan MOBILE (<= 640px).
   Breakpoint override secara berurutan:
   1) @media (min-width: 641px)  -> Tablet
   2) @media (min-width: 768px)  -> Desktop
   3) @media (min-width: 1024px) -> Large Desktop
   ============================================================= */
.notif-box {
  position: fixed;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9000;
  width: min(92%, 420px);
  padding: 1.25rem 1.1rem 1rem;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.25);
  text-align: center;
  font-family: 'DM Sans', sans-serif;
  box-sizing: border-box;
}
.baris-1 {
  margin: 0 0 0.3rem;
  font-size: 0.88rem;
  font-weight: 600;
  color: #1f2937;
  line-height: 1.45;
}
.baris-2 {
  margin: 0 0 0.3rem;
  font-size: 0.88rem;
  font-weight: 600;
  color: #1f2937;
}
.baris-2.juara {
  font-size: 1.6rem;
  font-weight: 800;
  color: #22a559;
}
.baris-3 {
  margin: 0 0 1rem;
  font-size: 0.82rem;
  color: #4b5563;
  line-height: 1.5;
}
.btn-ok {
  padding: 0.6rem 2.2rem;
  border: none;
  border-radius: 999px;
  background: linear-gradient(135deg, #2e87f6 0%, #1d6fd4 100%);
  color: #fff;
  font-family: inherit;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  box-shadow: 0 6px 16px rgba(46, 135, 246, 0.3);
}

/* ===== Animasi: turun dari atas dengan halus ===== */
.notif-enter-active {
  transition:
    transform 0.45s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.35s ease;
}
.notif-leave-active {
  transition:
    transform 0.3s ease,
    opacity 0.25s ease;
}
.notif-enter-from,
.notif-leave-to {
  opacity: 0;
  transform: translate(-50%, -120%);
}

/* ===== TABLET (>= 641px) ===== */
@media (min-width: 641px) {
  .notif-box {
    top: 1.5rem;
    padding: 1.5rem 1.4rem 1.2rem;
  }
  .baris-1,
  .baris-2 {
    font-size: 0.95rem;
  }
  .baris-3 {
    font-size: 0.86rem;
  }
}
</style>