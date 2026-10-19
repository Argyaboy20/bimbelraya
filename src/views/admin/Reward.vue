<!-- Reward.vue (admin) -->
<template>
  <div class="reward-page">
    <Navbar />

    <div class="page-content">
      <div class="page-header">
        <h1 class="page-title">Reward Tentor</h1>
        <p class="page-sub">Penilaian Performa Tentor Bimbel Raya</p>

        <!-- Navigasi bulan: data tiap bulan tersimpan terpisah -->
        <div class="date-nav">
          <button class="btn-nav" @click="geser(-1)">‹ Sebelumnya</button>
          <span class="date-label">{{ namaBulan(bulan) }}</span>
          <button class="btn-nav" @click="geser(1)">Berikutnya ›</button>
        </div>
      </div>

      <p v-if="galat" class="pesan-galat">{{ galat }}</p>
      <p v-else class="info-bulan">{{ daftarTentor.length }} tentor · {{ statusTeks }}</p>
        <div class="isi-reward">
            <!-- ===== TABEL UTAMA ===== -->
            <div v-if="rewardStore.draf[bulan]" class="tabel-wrap">
                <table class="tabel-reward">
                    <thead>
                        <tr>
                        <th class="kol-nama">NAMA TENTOR</th>
                        <th v-for="k in KRITERIA" :key="k.key">{{ k.label }}</th>
                        <th class="kol-total">TOTAL NILAI</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="t in daftarTentor" :key="t.kodeTentor">
                        <td class="kol-nama">{{ t.nama }}</td>
                        <td v-for="k in KRITERIA" :key="k.key">
                            <input
                            v-model="rewardStore.draf[bulan][t.kodeTentor][k.key]"
                            type="number"
                            inputmode="numeric"
                            min="1"
                            max="10"
                            step="1"
                            class="input-nilai"
                            :class="{ salah: tidakValid(rewardStore.draf[bulan][t.kodeTentor][k.key]) }"
                            />
                        </td>
                        <td class="kol-total">
                            <span class="angka-total" :class="kelasPeringkat(t.kodeTentor)">
                            {{ totalBaris(rewardStore.draf[bulan][t.kodeTentor]) }}
                            </span>
                        </td>
                        </tr>
                    </tbody>
                </table>
            </div>
             <!-- ===== GRAFIK ===== -->
            <aside v-if="rewardStore.draf[bulan]" class="grafik-box">
            <h2 class="grafik-judul">Grafik Total Nilai</h2>
            <p v-if="dataGrafik.length === 0" class="grafik-kosong">
                Grafik muncul setelah nilai satu tentor terisi lengkap.
            </p>
            <div v-for="d in dataGrafik" :key="d.kode" class="grafik-baris">
                <div class="grafik-nama">{{ d.nama }}</div>
                <div class="grafik-isi">
                <div class="grafik-jalur">
                    <div
                    class="grafik-batang"
                    :class="kelasPeringkat(d.kode) || 'tanpa-juara'"
                    :style="{ width: (d.total / NILAI_MAKS) * 100 + '%' }"
                    ></div>
                </div>
                <span class="grafik-angka">{{ d.total }}</span>
                </div>
            </div>
            </aside>
        </div>

        <p v-if="pesanSukses" class="pesan-sukses">{{ pesanSukses }}</p>
        <p v-if="galatUmumkan" class="pesan-galat">{{ galatUmumkan }}</p>
        <button v-if="siapUmumkan" class="btn-umumkan" @click="umumkan">UMUMKAN</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import Navbar from '@/components/Navbar.vue'
import { useTentorStore } from '@/stores/tentor'
import {
  useRewardStore,
  KRITERIA,
  nilaiValid,
  totalBaris,
  bulanSekarang,
  geserBulan,
  namaBulan,
} from '@/stores/reward'
import { ApiError } from '@/api/http'

const tentorStore = useTentorStore()
const rewardStore = useRewardStore()

const bulan = ref(bulanSekarang())
const galat = ref('')

// Daftar nama diambil dari Data Tentor, urut abjad
const daftarTentor = computed(() =>
  [...tentorStore.rows].sort((a, b) => a.nama.localeCompare(b.nama, 'id')),
)
const daftarKode = computed(() => daftarTentor.value.map((t) => t.kodeTentor))

const statusTeks = computed(() =>
  rewardStore.status[bulan.value]?.sudahDiumumkan ? 'Sudah diumumkan' : 'Belum diumumkan',
)

// Peringkat live (hanya baris yang 8 nilainya terisi); seri berbagi peringkat
const peringkat = computed(() => rewardStore.peringkatBulan(bulan.value, daftarKode.value))

const kelasPeringkat = (kode) => {
  const p = peringkat.value[kode]
  return p === 1 ? 'juara-1' : p === 2 ? 'juara-2' : p === 3 ? 'juara-3' : ''
}

const tidakValid = (v) => v !== '' && v !== null && !nilaiValid(v)

// Data grafik: hanya tentor yang 8 nilainya lengkap, urut nilai tertinggi
const NILAI_MAKS = KRITERIA.length * 10
const dataGrafik = computed(() =>
  daftarTentor.value
    .filter((t) => peringkat.value[t.kodeTentor])
    .map((t) => ({
      kode: t.kodeTentor,
      nama: t.nama,
      total: totalBaris(rewardStore.draf[bulan.value][t.kodeTentor]),
    }))
    .sort((a, b) => b.total - a.total),
)

// Tombol UMUMKAN: muncul kalau semua tentor sudah terisi lengkap dan valid
const siapUmumkan = computed(() => rewardStore.semuaTerisi(bulan.value, daftarKode.value))
const pesanSukses = ref('')
const galatUmumkan = ref('')

async function umumkan() {
  pesanSukses.value = ''
  galatUmumkan.value = ''
  try {
    await rewardStore.umumkan(bulan.value, daftarKode.value)
    pesanSukses.value = `Reward ${namaBulan(bulan.value)} berhasil diumumkan.`
  } catch (e) {
    galatUmumkan.value = e instanceof ApiError ? e.message : 'Gagal mengumumkan reward'
  }
}

const geser = (n) => {
  bulan.value = geserBulan(bulan.value, n)
}

async function muat() {
  galat.value = ''
  try {
    if (tentorStore.rows.length === 0) await tentorStore.fetchRows()
    await rewardStore.muatBulan(bulan.value, daftarKode.value)
  } catch (e) {
    galat.value = e instanceof ApiError ? e.message : 'Gagal memuat data reward'
    pesanSukses.value = ''
    galatUmumkan.value = ''
  }
}

onMounted(muat)
watch(bulan, muat)
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

.reward-page {
  width: 100%;
  min-height: 100vh;
  background-color: #fafafa;
  background-image:
    radial-gradient(circle at 10% 15%, rgba(46, 135, 246, 0.1) 0%, transparent 45%),
    radial-gradient(circle at 90% 10%, rgba(243, 92, 43, 0.1) 0%, transparent 40%);
}

.page-content {
  width: 100%;
  max-width: 1300px;
  margin: 0 auto;
  padding: 1.25rem 0.85rem 2.5rem;
}

.page-header {
  margin-bottom: 1rem;
}
.page-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}
.page-sub {
  font-size: 0.78rem;
  color: #6b7280;
  margin: 0.2rem 0 0.8rem;
}

.date-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}
.btn-nav {
  padding: 0.5rem 0.8rem;
  border: none;
  border-radius: 10px;
  background: #2e87f6;
  color: #fff;
  font-weight: 700;
  font-size: 0.78rem;
  cursor: pointer;
}
.date-label {
  flex: 1;
  text-align: center;
  font-weight: 700;
  font-size: 0.95rem;
  color: #1f2937;
}

.info-bulan {
  font-size: 0.8rem;
  color: #6b7280;
}
.pesan-galat {
  font-size: 0.8rem;
  color: #b91c1c;
}

/* ===== TABEL UTAMA ===== */
.tabel-wrap {
  margin-top: 1rem;
  overflow-x: auto;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}
.tabel-reward {
  width: 100%;
  min-width: 960px;
  border-collapse: collapse;
}
.tabel-reward th,
.tabel-reward td {
  padding: 0.55rem 0.4rem;
  border: 1px solid #e5e7eb;
  text-align: center;
  font-size: 0.78rem;
}
.tabel-reward th {
  background: #fff;
  color: #1f2937;
  font-weight: 700;
  font-size: 0.7rem;
  line-height: 1.3;
  text-transform: uppercase;
}
.kol-nama {
  position: sticky;
  left: 0;
  z-index: 1;
  min-width: 150px;
  background: #fff;
  text-align: left !important;
  font-weight: 600;
  color: #1f2937;
}
.tabel-reward th.kol-total {
  background: #22a559;
  color: #fff;
}
.kol-total {
  min-width: 90px;
}
.input-nilai {
  width: 54px;
  padding: 0.35rem 0.2rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  text-align: center;
  font-size: 0.85rem;
}
.input-nilai.salah {
  border-color: #dc2626;
  background: #fef2f2;
}
.angka-total {
  display: inline-block;
  min-width: 46px;
  padding: 0.25rem 0.7rem;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.85rem;
}
.juara-1 {
  background: #22c55e;
  color: #fff;
}
.juara-2 {
  background: #2e87f6;
  color: #fff;
}
.juara-3 {
  background: #facc15;
  color: #1f2937;
}
/* ===== LAYOUT TABEL + GRAFIK ===== */
.isi-reward {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1rem;
}
.isi-reward .tabel-wrap {
  margin-top: 0;
}

/* ===== GRAFIK ===== */
.grafik-box {
  padding: 1rem;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}
.grafik-judul {
  margin: 0 0 0.8rem;
  font-size: 0.9rem;
  font-weight: 700;
  color: #1f2937;
}
.grafik-kosong {
  margin: 0;
  font-size: 0.78rem;
  color: #6b7280;
}
.grafik-baris {
  margin-bottom: 0.7rem;
}
.grafik-nama {
  margin-bottom: 0.2rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #1f2937;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.grafik-isi {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.grafik-jalur {
  flex: 1;
  height: 14px;
  border-radius: 7px;
  background: #f3f4f6;
  overflow: hidden;
}
.grafik-batang {
  height: 100%;
  border-radius: 7px;
  transition: width 0.35s ease;
}
.tanpa-juara {
  background: #9ca3af;
}
.grafik-angka {
  min-width: 28px;
  text-align: right;
  font-size: 0.78rem;
  font-weight: 700;
  color: #1f2937;
}

/* ===== TOMBOL UMUMKAN ===== */
.btn-umumkan {
  display: block;
  width: 100%;
  margin-top: 1.25rem;
  padding: 0.85rem 1rem;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #f35c2b 0%, #d6481c 100%);
  color: #fff;
  font-weight: 700;
  font-size: 0.9rem;
  letter-spacing: 0.04em;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(243, 92, 43, 0.3);
}
.pesan-sukses {
  margin: 1rem 0 0;
  font-size: 0.8rem;
  font-weight: 600;
  color: #15803d;
}

/* ===== TABLET (>= 641px): grafik tetap di bawah tabel, jarak lebih lega ===== */
@media (min-width: 641px) {
  .isi-reward {
    gap: 1.75rem;
  }

  .btn-umumkan {
    width: auto;
    min-width: 240px;
    margin-left: auto;
  }
}

/* ===== DESKTOP (>= 768px): grafik pindah ke kanan tabel ===== */
@media (min-width: 768px) {
  .isi-reward {
    flex-direction: row;
    align-items: flex-start;
    gap: 1.5rem;
  }
  .isi-reward .tabel-wrap {
    flex: 1;
    min-width: 0;
  }
  .grafik-box {
    width: 280px;
    flex-shrink: 0;
    position: sticky;
    top: 1rem;
  }
}

/* ===== LARGE DESKTOP (>= 1024px): jarak dan grafik lebih lebar ===== */
@media (min-width: 1024px) {
  .isi-reward {
    gap: 2rem;
  }
  .grafik-box {
    width: 340px;
  }
}
</style>