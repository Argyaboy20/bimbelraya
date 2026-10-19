<!-- RewardTentor.vue (tentor) -->
<template>
  <div class="reward-tentor-page">
    <div class="page-content">
      <router-link :to="`/tentor/dashboardtentor/${kodeTentor}`" class="link-kembali">
        ‹ Kembali
      </router-link>

      <h1 class="page-title">Reward Bulanan Tentor</h1>
      <p class="page-sub">Best Tentor of the Month · {{ labelBulan }}</p>

      <p v-if="galat" class="pesan-galat">{{ galat }}</p>

      <template v-else-if="reward">
        <p v-if="!reward.sudahDiumumkan" class="info-kosong">
          Reward bulan ini belum diumumkan. Pantau terus ya!
        </p>

        <!-- Daftar tentor urut dari nilai tertinggi; baris milik kamu di-highlight hijau -->
        <ol v-else class="daftar-tentor">
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

const route = useRoute()
const kodeTentor = computed(() => route.params.id)

const reward = ref(null) // { bulan, sudahDiumumkan, daftar: [{ namaTentor, peringkat, saya }], ... }
const galat = ref('')

const labelBulan = computed(() => namaBulan(reward.value?.bulan ?? bulanSekarang()))

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

.info-kosong {
  font-size: 0.82rem;
  color: #6b7280;
}
.pesan-galat {
  font-size: 0.8rem;
  color: #b91c1c;
}

/* ===== DAFTAR TENTOR ===== */
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
  .daftar-tentor {
    max-width: 560px;
  }
}

/* ===== LARGE DESKTOP (>= 1024px) ===== */
@media (min-width: 1024px) {
  .page-content {
    padding: 2rem 2rem 3rem;
  }
}
</style>