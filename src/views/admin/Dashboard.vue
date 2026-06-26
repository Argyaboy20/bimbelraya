<!-- Dashboard.vue -->
<template>
  <div class="dashboard-page">

    <!-- ===== NAVBAR UNIVERSAL ADMIN ===== -->
    <Navbar />

    <div class="dashboard-content">

      <!-- ===== CARD STATISTIK (data dummy dikirim lewat props) ===== -->
      <CardStatistik
        :tentor-aktif="dummyStats.tentorAktif"
        :walimurid-aktif="dummyStats.walimuridAktif"
        :frekuensi-presensi="dummyStats.frekuensiPresensi"
      />

      <!-- ===== SECTION: TENTOR YANG AKTIF ===== -->
      <section class="dashboard-section">
        <h2 class="section-title">Tentor yang Aktif</h2>
        <p class="section-desc">
          Pantau jumlah tentor yang sedang aktif mengajar beserta status kontraknya.
        </p>
        <router-link to="/admin/tentor" class="section-card card-blue">
          <span class="card-icon">👨‍🏫</span>
          <span class="card-text">DATA TENTOR</span>
          <span class="card-arrow">→</span>
        </router-link>
      </section>

      <!-- ===== SECTION: WALIMURID YANG AKTIF ===== -->
      <section class="dashboard-section">
        <h2 class="section-title">Walimurid yang Aktif</h2>
        <p class="section-desc">
          Lihat data wali murid yang terdaftar dan aktif menggunakan layanan bimbel.
        </p>
        <router-link to="/admin/walimurid" class="section-card card-orange">
          <span class="card-icon">👨‍👩‍👧</span>
          <span class="card-text">DATA WALIMURID</span>
          <span class="card-arrow">→</span>
        </router-link>
      </section>

      <!-- ===== SECTION: PRESENSI TENTOR ===== -->
      <section class="dashboard-section">
        <h2 class="section-title">Presensi Tentor</h2>
        <p class="section-desc">
          Pantau laporan kehadiran tentor secara langsung dari seluruh sesi mengajar.
        </p>
        <router-link to="/admin/presensi" class="section-card card-cream">
          <span class="card-icon">📋</span>
          <span class="card-text">LAPORAN PRESENSI</span>
          <span class="card-arrow">→</span>
        </router-link>
      </section>

    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import Navbar from '@/components/Navbar.vue'
import CardStatistik from '@/components/CardStatistik.vue'

// ============================================
// DUMMY DATA — nanti diganti hasil fetch API backend, contoh:
//
// const dummyStats = reactive({ tentorAktif: 0, walimuridAktif: 0, frekuensiPresensi: 0 })
// onMounted(async () => {
//   const res = await fetch('/api/admin/statistik')
//   const data = await res.json()
//   Object.assign(dummyStats, data)
// })
//
// CardStatistik.vue TIDAK perlu diubah sama sekali saat backend tersambung,
// karena ia cuma menerima data lewat props.
// ============================================
const dummyStats = reactive({
  tentorAktif: 24,
  walimuridAktif: 38,
  frekuensiPresensi: 19
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

* {
  font-family: 'DM Sans', sans-serif;
  box-sizing: border-box;
}

.dashboard-page {
  width: 100%;
  min-height: 100vh;
  /* Background kombinasi warna brand, bukan gradien penuh — campuran solid + sedikit blend */
  background-color: #F9ECCC;
  background-image:
    radial-gradient(circle at 10% 15%, rgba(46, 135, 246, 0.10) 0%, transparent 45%),
    radial-gradient(circle at 90% 10%, rgba(243, 92, 43, 0.10) 0%, transparent 40%),
    radial-gradient(circle at 50% 90%, rgba(46, 135, 246, 0.08) 0%, transparent 50%);
}

.dashboard-content {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding-bottom: 3rem;
}

/* ===== SECTION ===== */
.dashboard-section {
  padding: 1.75rem 0.85rem 0;
}
.section-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.3rem;
}
.section-desc {
  font-size: 0.8rem;
  color: #6b7280;
  margin-bottom: 0.9rem;
  line-height: 1.5;
}

/* ===== TOMBOL/CARD NAVIGASI ===== */
.section-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 1rem 1.1rem;
  border-radius: 14px;
  text-decoration: none;
  font-weight: 700;
  font-size: 0.85rem;
  letter-spacing: 0.02em;
  color: #fff;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.section-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 26px rgba(0, 0, 0, 0.15);
}
.card-icon {
  font-size: 1.3rem;
}
.card-text {
  flex: 1;
}
.card-arrow {
  font-size: 1.1rem;
  transition: transform 0.2s ease;
}
.section-card:hover .card-arrow {
  transform: translateX(4px);
}

.card-blue {
  background: linear-gradient(135deg, #2E87F6 0%, #1d6fd4 100%);
}
.card-orange {
  background: linear-gradient(135deg, #F35C2B 0%, #d6481c 100%);
}
.card-cream {
  background: linear-gradient(135deg, #F9ECCC 0%, #f3dfa8 100%);
  color: #5a4a1f;
}

/* ===== RESPONSIVE ===== */
@media (min-width: 768px) {
  .dashboard-section {
    padding: 2.25rem 1.5rem 0;
  }
  .section-title {
    font-size: 1.2rem;
  }
  .section-desc {
    font-size: 0.85rem;
  }
  .section-card {
    padding: 1.25rem 1.5rem;
    font-size: 0.92rem;
  }
}

@media (min-width: 1024px) {
  .dashboard-section {
    padding: 2.5rem 2.5rem 0;
  }
}
</style>