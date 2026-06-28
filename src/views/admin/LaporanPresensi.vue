<!-- LaporanPresensi.vue -->
<template>
  <div class="laporan-page">
    <Navbar />

    <div class="page-content">
      <div class="page-header">
        <div>
          <h1 class="page-title">Laporan Presensi Tentor</h1>
          <p class="page-date">{{ formattedToday }}</p>
        </div>
        <!-- Navigasi ganti hari -->
        <div class="date-nav">
          <button class="btn-nav" @click="prevDay">‹ Sebelumnya</button>
          <span class="date-label">{{ formattedSelectedDate }}</span>
          <button class="btn-nav" @click="nextDay" :disabled="isToday">Berikutnya ›</button>
        </div>
      </div>

      <!-- ===== RINGKASAN HARI INI ===== -->
      <div class="summary-row">
        <div class="summary-card card-blue">
          <div class="summary-number">{{ sudahPresensi }}</div>
          <div class="summary-label">Sudah Presensi</div>
        </div>
        <div class="summary-card card-orange">
          <div class="summary-number">{{ belumPresensi }}</div>
          <div class="summary-label">Belum Presensi</div>
        </div>
        <div class="summary-card card-cream">
          <div class="summary-number">{{ totalTentor }}</div>
          <div class="summary-label">Total Tentor Aktif</div>
        </div>
      </div>

      <!-- ===== LIST PRESENSI ===== -->
      <div class="presensi-section">
        <h2 class="section-title">Detail Presensi</h2>

        <!-- Belum ada presensi sama sekali hari ini -->
        <div v-if="presensiHariIni.length === 0" class="empty-state">
          <div class="empty-icon">📋</div>
          <p class="empty-text">Belum ada tentor yang presensi hari ini</p>
          <p class="empty-sub">Data akan muncul otomatis saat tentor melakukan presensi</p>
        </div>

        <!-- Ada data presensi -->
        <div v-else class="presensi-list">
          <div
            v-for="(item, index) in presensiHariIni"
            :key="index"
            class="presensi-card"
          >
            <!-- Info tentor -->
            <div class="presensi-left">
              <div class="tentor-avatar">{{ item.namaTentor.charAt(0).toUpperCase() }}</div>
              <div class="tentor-info">
                <p class="tentor-nama">{{ item.namaTentor }}</p>
                <p class="tentor-kode">Kode: {{ item.kodeTentor }}</p>
              </div>
            </div>

            <!-- Detail presensi -->
            <div class="presensi-right">
              <p class="presensi-waktu">
                ✅ Sudah melakukan absensi pada pukul
                <strong>{{ item.jamPresensi }} WIB</strong>
              </p>
              <p class="presensi-walimurid">
                👨‍👩‍👧 Bersama walimurid: <strong>{{ item.namaWalimurid }}</strong>
              </p>
              <!-- Foto bukti presensi (selfie) — nanti dari URL yang disimpan di database -->
              <div class="foto-wrapper" v-if="item.fotoUrl">
                <img :src="item.fotoUrl" alt="Bukti presensi" class="foto-presensi" />
              </div>
              <div v-else class="foto-placeholder">
                📷 Foto bukti presensi belum tersedia
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Navbar from '@/components/Navbar.vue'

// ============================================
// TANGGAL — navigasi per hari
// ============================================
const selectedDate = ref(new Date())
selectedDate.value.setHours(0, 0, 0, 0)

const today = new Date()
today.setHours(0, 0, 0, 0)

const isToday = computed(() => selectedDate.value.getTime() === today.getTime())

const formatDate = (date) => {
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const toDateKey = (date) => {
  return date.toISOString().split('T')[0] // "YYYY-MM-DD" sebagai key
}

const formattedToday = computed(() => `Hari ini: ${formatDate(today)}`)
const formattedSelectedDate = computed(() => formatDate(selectedDate.value))

const prevDay = () => {
  const d = new Date(selectedDate.value)
  d.setDate(d.getDate() - 1)
  selectedDate.value = d
}
const nextDay = () => {
  if (isToday.value) return
  const d = new Date(selectedDate.value)
  d.setDate(d.getDate() + 1)
  selectedDate.value = d
}

// ============================================
// DUMMY DATA — simulasi data presensi dari database
// Strukturnya sudah disiapkan agar nanti tinggal ganti
// dengan hasil fetch ke backend:
//
// const allPresensi = ref([])
// onMounted(async () => {
//   const res = await fetch('/api/admin/presensi')
//   allPresensi.value = await res.json()
// })
//
// Setiap item presensi dari backend nanti harus punya field:
// { namaTentor, kodeTentor, namaWalimurid, jamPresensi, tanggal, fotoUrl }
// ============================================
const allPresensi = ref([
  {
    namaTentor: 'Andi Pratama',
    kodeTentor: 'TR1001',
    namaWalimurid: 'Budi Santoso',
    jamPresensi: '09:14',
    tanggal: toDateKey(today),    // hari ini
    fotoUrl: ''
  },
  {
    namaTentor: 'Sari Dewi',
    kodeTentor: 'TR1002',
    namaWalimurid: 'Citra Lestari',
    jamPresensi: '10:32',
    tanggal: toDateKey(today),
    fotoUrl: ''
  },
  {
    namaTentor: 'Rizky Halim',
    kodeTentor: 'TR1003',
    namaWalimurid: 'Doni Irawan',
    jamPresensi: '13:05',
    tanggal: toDateKey(today),
    fotoUrl: ''
  },
  {
    // Contoh data kemarin — untuk test navigasi hari
    namaTentor: 'Maya Anggraini',
    kodeTentor: 'TR1004',
    namaWalimurid: 'Eko Purnomo',
    jamPresensi: '15:20',
    tanggal: (() => {
      const kemarin = new Date(today)
      kemarin.setDate(kemarin.getDate() - 1)
      return toDateKey(kemarin)
    })(),
    fotoUrl: ''
  }
])

// Dummy total tentor aktif (nanti dari API /api/admin/statistik)
const totalTentor = ref(12)

// ============================================
// FILTER DATA SESUAI HARI YANG DIPILIH
// ============================================
const presensiHariIni = computed(() => {
  const key = toDateKey(selectedDate.value)
  return allPresensi.value.filter((p) => p.tanggal === key)
})

const sudahPresensi = computed(() => presensiHariIni.value.length)
const belumPresensi = computed(() => Math.max(0, totalTentor.value - sudahPresensi.value))
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

* {
  font-family: 'DM Sans', sans-serif;
  box-sizing: border-box;
}

.laporan-page {
  width: 100%;
  min-height: 100vh;
  background: #f7f8fa;
}

/* =====================================================
   DEFAULT = MOBILE (≤ 639px)
   ===================================================== */

.page-content {
  padding: 1.25rem 0.875rem 2.5rem;
  max-width: 900px;
  margin: 0 auto;
}

/* ===== HEADER ===== */
.page-header {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  margin-bottom: 1.25rem;
}
.page-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.15rem;
}
.page-date {
  font-size: 0.75rem;
  color: #6b7280;
}

/* ===== NAVIGASI HARI ===== */
.date-nav {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}
.btn-nav {
  padding: 0.4rem 0.75rem;
  border-radius: 8px;
  border: 1.5px solid #2E87F6;
  background: #fff;
  color: #2E87F6;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  white-space: nowrap;
}
.btn-nav:hover:not(:disabled) {
  background: #2E87F6;
  color: #fff;
}
.btn-nav:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.date-label {
  font-size: 0.8rem;
  font-weight: 700;
  color: #1f2937;
  flex: 1;
  text-align: center;
}

/* ===== RINGKASAN CARD ===== */
.summary-row {
  display: grid;
  /* Mobile: 1 baris 3 kolom tapi masing-masing bisa menyusut */
  grid-template-columns: repeat(3, 1fr);
  gap: 0.6rem;
  margin-bottom: 1.5rem;
}
.summary-card {
  border-radius: 12px;
  padding: 0.75rem 0.5rem;
  text-align: center;
  color: #fff;
}
.summary-number {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 0.25rem;
}
.summary-label {
  font-size: 0.62rem;
  font-weight: 500;
  opacity: 0.9;
  line-height: 1.3;
}
.card-blue {
  background: linear-gradient(135deg, #2E87F6 0%, #1d6fd4 100%);
  box-shadow: 0 4px 12px rgba(46, 135, 246, 0.25);
}
.card-orange {
  background: linear-gradient(135deg, #F35C2B 0%, #d6481c 100%);
  box-shadow: 0 4px 12px rgba(243, 92, 43, 0.25);
}
.card-cream {
  background: linear-gradient(135deg, #F9ECCC 0%, #f3dfa8 100%);
  color: #5a4a1f;
  box-shadow: 0 4px 12px rgba(243, 197, 92, 0.2);
}

/* ===== SECTION DETAIL ===== */
.section-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.875rem;
}

/* ===== EMPTY STATE ===== */
.empty-state {
  text-align: center;
  padding: 2.5rem 1rem;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);
}
.empty-icon {
  font-size: 2.5rem;
  margin-bottom: 0.6rem;
}
.empty-text {
  font-size: 0.9rem;
  font-weight: 700;
  color: #374151;
  margin-bottom: 0.25rem;
}
.empty-sub {
  font-size: 0.75rem;
  color: #9ca3af;
}

/* ===== PRESENSI LIST ===== */
.presensi-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* Mobile: card vertikal (atas-bawah) */
.presensi-card {
  background: #fff;
  border-radius: 14px;
  padding: 1rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  border-left: 4px solid #2E87F6;
}

/* Kiri: avatar + nama tentor */
.presensi-left {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}
.tentor-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2E87F6, #1d6fd4);
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.tentor-nama {
  font-size: 0.88rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}
.tentor-kode {
  font-size: 0.7rem;
  color: #6b7280;
  margin: 0;
}

/* Kanan: detail waktu & foto */
.presensi-right {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.presensi-waktu {
  font-size: 0.8rem;
  color: #374151;
  margin: 0;
  line-height: 1.4;
}
.presensi-walimurid {
  font-size: 0.78rem;
  color: #6b7280;
  margin: 0;
}

/* Foto bukti presensi */
.foto-wrapper {
  margin-top: 0.4rem;
}
.foto-presensi {
  width: 100%;
  max-width: 200px;
  height: 130px;
  object-fit: cover;
  border-radius: 10px;
  border: 2px solid #e5e7eb;
}
.foto-placeholder {
  font-size: 0.74rem;
  color: #9ca3af;
  margin-top: 0.35rem;
}

/* =====================================================
   TABLET (≥ 768px)
   ===================================================== */
@media (min-width: 768px) {

  .page-content {
    padding: 1.5rem 1.5rem 3rem;
  }

  /* Header: horizontal */
  .page-header {
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
  .page-title {
    font-size: 1.2rem;
  }
  .page-date {
    font-size: 0.78rem;
  }

  /* Navigasi hari */
  .btn-nav {
    padding: 0.45rem 1rem;
    font-size: 0.82rem;
  }
  .date-label {
    font-size: 0.88rem;
    flex: unset;
  }

  /* Summary cards */
  .summary-row {
    gap: 0.85rem;
    margin-bottom: 1.75rem;
  }
  .summary-card {
    padding: 1rem;
    border-radius: 14px;
  }
  .summary-number {
    font-size: 1.8rem;
  }
  .summary-label {
    font-size: 0.68rem;
  }

  /* Section title */
  .section-title {
    font-size: 1rem;
  }

  /* Presensi card: horizontal di tablet */
  .presensi-card {
    flex-direction: row;
    align-items: flex-start;
    padding: 1.1rem 1.25rem;
    gap: 1rem;
  }
  .presensi-left {
    min-width: 180px;
    flex-shrink: 0;
  }
  .tentor-avatar {
    width: 42px;
    height: 42px;
    font-size: 1.05rem;
  }
  .tentor-nama {
    font-size: 0.92rem;
  }
  .tentor-kode {
    font-size: 0.72rem;
  }
  .presensi-waktu {
    font-size: 0.83rem;
  }
  .presensi-walimurid {
    font-size: 0.8rem;
  }
  .foto-presensi {
    max-width: 220px;
    height: 150px;
  }
}

/* =====================================================
   DESKTOP (≥ 1024px)
   ===================================================== */
@media (min-width: 1024px) {

  .page-content {
    padding: 2rem 2rem 4rem;
  }

  .page-title {
    font-size: 1.4rem;
  }
  .page-date {
    font-size: 0.82rem;
  }

  /* Summary */
  .summary-row {
    gap: 1.1rem;
    margin-bottom: 2rem;
  }
  .summary-card {
    padding: 1.25rem 1rem;
    border-radius: 16px;
  }
  .summary-number {
    font-size: 2.2rem;
    margin-bottom: 0.3rem;
  }
  .summary-label {
    font-size: 0.72rem;
  }

  /* Section title */
  .section-title {
    font-size: 1.05rem;
    margin-bottom: 1rem;
  }

  /* Presensi card */
  .presensi-card {
    padding: 1.25rem 1.5rem;
    border-radius: 16px;
    gap: 1.25rem;
  }
  .presensi-left {
    min-width: 200px;
  }
  .tentor-avatar {
    width: 44px;
    height: 44px;
    font-size: 1.1rem;
  }
  .tentor-nama {
    font-size: 0.95rem;
  }
  .tentor-kode {
    font-size: 0.75rem;
  }
  .presensi-waktu {
    font-size: 0.85rem;
  }
  .presensi-walimurid {
    font-size: 0.82rem;
  }
  .foto-presensi {
    max-width: 240px;
    height: 160px;
  }

  /* Empty state */
  .empty-state {
    padding: 3rem 1rem;
  }
  .empty-icon {
    font-size: 3rem;
  }
  .empty-text {
    font-size: 1rem;
  }
  .empty-sub {
    font-size: 0.8rem;
  }
}
</style>