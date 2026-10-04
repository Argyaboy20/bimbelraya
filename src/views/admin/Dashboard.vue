<!-- Dashboard.vue -->
<template>
  <div class="dashboard-page">
    <!-- ===== NAVBAR UNIVERSAL ADMIN ===== -->
    <Navbar />

    <div class="dashboard-content">
      <!-- ===== CARD STATISTIK (data dummy dikirim lewat props) ===== -->
      <CardStatistik
        :tentor-aktif="stats.tentorAktif"
        :walimurid-aktif="stats.walimuridAktif"
        :frekuensi-presensi="stats.frekuensiPresensi"
      />

      <!-- ===== SECTION: BUAT KODE TENTOR ===== -->
      <section class="dashboard-section">
        <h2 class="section-title">Buat Kode Tentor</h2>
        <p class="section-desc">
          Generate kode unik 4 digit untuk tentor baru. Kode ini digunakan tentor saat mendaftar di
          halaman daftar dan akan menjadi ID mereka di database.
        </p>

        <!-- Area generate -->
        <div class="kode-box">
          <!-- State awal: tombol generate -->
          <div v-if="kodeState === 'idle'" class="kode-idle">
            <button class="btn-generate" @click="generateKode">✦ Generate Kode</button>
          </div>

          <!-- State loading: proses generate -->
          <div v-if="kodeState === 'loading'" class="kode-loading">
            <div class="spinner"></div>
            <p class="loading-text">Membuat kode tentor...</p>
          </div>

          <!-- State result: tampilkan kode + tombol tolak/setuju -->
          <div v-if="kodeState === 'result'" class="kode-result">
            <p class="kode-label">Kode Tentor yang Digenerate:</p>
            <div class="kode-display">{{ generatedKode }}</div>
            <div class="kode-actions">
              <button class="btn-kode tolak" @click="tolakKode">✕ TOLAK</button>
              <button class="btn-kode setuju" @click="setujuKode">✓ SETUJU</button>
            </div>
          </div>
        </div>

        <!-- Riwayat Generate -->
        <button class="btn-riwayat" @click="showRiwayat = true">📋 Riwayat Generate</button>
      </section>

      <!-- ===== MODAL RIWAYAT ===== -->
      <div v-if="showRiwayat" class="modal-overlay" @click.self="showRiwayat = false">
        <div class="modal-box">
          <div class="modal-header">
            <h3 class="modal-title">Riwayat Generate Kode Tentor</h3>
            <button class="modal-close" @click="showRiwayat = false">✕</button>
          </div>
          <div class="modal-body">
            <p v-if="tentorStore.kodeHistory.length === 0" class="riwayat-empty">
              Belum ada kode tentor yang di-generate
            </p>
            <div v-else class="riwayat-list">
              <div v-for="(item, i) in tentorStore.kodeHistory" :key="i" class="riwayat-item">
                <span class="riwayat-kode">{{ item.kode }}</span>
                <span class="riwayat-tanggal">{{ item.tanggal }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

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

      <!-- ===== SECTION: LOWONGAN TENTOR ===== -->
      <section class="dashboard-section">
        <h2 class="section-title">Lowongan Tentor</h2>
        <p class="section-desc">
          Kelola lowongan mengajar yang tampil di halaman publik untuk para tentor.
        </p>
        <router-link to="/admin/lowongan" class="section-card card-blue">
          <span class="card-icon">📢</span>
          <span class="card-text">KELOLA LOWONGAN</span>
          <span class="card-arrow">→</span>
        </router-link>
      </section>

      <!-- ===== SECTION: KELUAR AKUN ===== -->
      <section class="logout-section">
        <button type="button" class="btn-logout" @click="showLogoutConfirm = true">
          <span class="card-icon">🚪</span>
          <span class="card-text">KELUAR AKUN</span>
        </button>
      </section>
    </div>

    <!-- ===== MODAL KONFIRMASI LOGOUT ===== -->
    <div v-if="showLogoutConfirm" class="modal-overlay" @click.self="showLogoutConfirm = false">
      <div class="modal-box modal-confirm">
        <div class="modal-body confirm-body">
          <p class="confirm-text">Mau beneran logout nih?</p>
          <div class="confirm-actions">
            <button type="button" class="btn-confirm btn-no" @click="showLogoutConfirm = false">
              Tidak
            </button>
            <button type="button" class="btn-confirm btn-yes" @click="handleLogout">Ya</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// give component a multi-word name to satisfy linter
defineOptions({ name: 'AdminDashboard' })
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Navbar from '@/components/Navbar.vue'
import CardStatistik from '@/components/CardStatistik.vue'
import { useTentorStore } from '@/stores/tentor'
import { usePresensiStore } from '@/stores/presensi'
import { useWalimuridStore } from '@/stores/walimurid'

const router = useRouter()
const authStore = useAuthStore()
const tentorStore = useTentorStore()
const presensiStore = usePresensiStore()
const walimuridStore = useWalimuridStore()

tentorStore.checkExpiredContracts() // admin membuka dashboard ikut menyapu kontrak yang lewat

// ===== LOGOUT (dengan modal konfirmasi) =====
const showLogoutConfirm = ref(false)

const handleLogout = () => {
  authStore.logout()
  showLogoutConfirm.value = false
  router.push('/loginadmin')
}

// "YYYY-MM-DD" dari tanggal lokal (toISOString() mundur sehari di WIB)
const toDateKey = (date) => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

// Nanti dari backend: GET /api/admin/statistik
const stats = computed(() => {
  const hariIni = toDateKey(new Date())
  return {
    tentorAktif: tentorStore.rows.filter((r) => !r.habisKontrak || r.habisKontrak >= hariIni).length,
    walimuridAktif: walimuridStore.jumlahAktif,
    frekuensiPresensi: presensiStore.records.filter((p) => p.tanggalKey === hariIni).length,
  }
})

// ===== KODE TENTOR GENERATOR =====
// 2 digit belakang = tahun berjalan otomatis (misal 2026 → "26")
const tahunSingkat = new Date().getFullYear().toString().slice(-2)

const kodeState = ref('idle') // 'idle' | 'loading' | 'result'
const generatedKode = ref('')
const showRiwayat = ref(false)

// Generate: 2 digit random (10-99) + 2 digit tahun, misal "1726"
const generateKode = () => {
  kodeState.value = 'loading'
  setTimeout(() => {
    // Hanya ada 90 kemungkinan per tahun (10–99). Pilih acak dari yang belum ada di riwayat.
    const tersedia = []
    for (let n = 10; n <= 99; n++) {
      const kode = String(n) + tahunSingkat
      if (!tentorStore.kodeSudahAda(kode)) tersedia.push(kode)
    }
    if (tersedia.length === 0) {
      alert('Semua kode tahun ini sedang terpakai.')
      kodeState.value = 'idle'
      return
    }
    generatedKode.value = tersedia[Math.floor(Math.random() * tersedia.length)]
    kodeState.value = 'result'
  }, 1200)
}

const tolakKode = () => {
  // Tolak: buang kode, kembali ke idle. TIDAK masuk ke database maupun riwayat
  generatedKode.value = ''
  kodeState.value = 'idle'
}

const setujuKode = () => {
  // Setuju: simpan ke riwayat + masuk ke database (nanti disambung API)
  // ============================================
  // Nanti diganti API call:
  // await fetch('/api/admin/kode-tentor', {
  //   method: 'POST',
  //   body: JSON.stringify({ kode: generatedKode.value })
  // })

  tentorStore.addKodeHistory(generatedKode.value)
  generatedKode.value = ''
  kodeState.value = 'idle'
}
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
  background-color: #fafafa;
  background-image:
    radial-gradient(circle at 10% 15%, rgba(46, 135, 246, 0.1) 0%, transparent 45%),
    radial-gradient(circle at 90% 10%, rgba(243, 92, 43, 0.1) 0%, transparent 40%),
    radial-gradient(circle at 50% 90%, rgba(46, 135, 246, 0.08) 0%, transparent 50%);
}

.dashboard-content {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding-bottom: 2.5rem;
}

/* ===== SECTION ===== */
.dashboard-section {
  padding: 1.5rem 0.85rem 0;
}
.logout-section {
  padding: 4rem 0.85rem 0;
}
.section-title {
  font-size: 1rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.3rem;
}
.section-desc {
  font-size: 0.78rem;
  color: #6b7280;
  margin-bottom: 0.85rem;
  line-height: 1.5;
}

/* ===== TOMBOL/CARD NAVIGASI ===== */
.section-card {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  width: 100%;
  padding: 0.9rem 1rem;
  border-radius: 14px;
  text-decoration: none;
  font-weight: 700;
  font-size: 0.82rem;
  letter-spacing: 0.02em;
  color: #fff;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}
.section-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 26px rgba(0, 0, 0, 0.15);
}
.card-icon {
  font-size: 1.2rem;
}
.card-text {
  flex: 1;
}
.card-arrow {
  font-size: 1rem;
  transition: transform 0.2s ease;
}
.section-card:hover .card-arrow {
  transform: translateX(4px);
}

.card-blue {
  background: linear-gradient(135deg, #2e87f6 0%, #1d6fd4 100%);
}
.card-orange {
  background: linear-gradient(135deg, #f35c2b 0%, #d6481c 100%);
}
.card-cream {
  background: linear-gradient(135deg, #f9eccc 0%, #f3dfa8 100%);
  color: #5a4a1f;
}

/* ===== TOMBOL LOGOUT (sengaja dibuat kecil, beda dari section-card lain) ===== */
.btn-logout {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  width: fit-content;
  margin: 0 auto;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  border: 1.5px solid #f35c2b;
  background: #fff;
  color: #f35c2b;
  font-weight: 700;
  font-size: 0.72rem;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition:
    background 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
}
.btn-logout .card-icon {
  font-size: 0.85rem;
}
.btn-logout:hover {
  background: #ff0000;
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 10px 22px rgba(243, 92, 43, 0.28);
}
.btn-logout:active {
  transform: translateY(0);
}

/* ===== SECTION KODE TENTOR ===== */
.kode-box {
  background: #fff;
  border-radius: 14px;
  padding: 1.25rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  margin-bottom: 0.85rem;
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Idle */
.btn-generate {
  padding: 0.75rem 2rem;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #2e87f6 0%, #1d6fd4 100%);
  color: #fff;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(46, 135, 246, 0.3);
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}
.btn-generate:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 26px rgba(46, 135, 246, 0.4);
}

/* Loading */
.kode-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}
.spinner {
  width: 36px;
  height: 36px;
  border: 3.5px solid #e5e7eb;
  border-top-color: #2e87f6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.loading-text {
  font-size: 0.82rem;
  color: #6b7280;
  margin: 0;
}

/* Result */
.kode-result {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
}
.kode-label {
  font-size: 0.78rem;
  color: #6b7280;
  margin: 0;
}
.kode-display {
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: 0.4em;
  color: #1f2937;
  background: #f0f7ff;
  border: 2px dashed #2e87f6;
  border-radius: 12px;
  padding: 0.6rem 2rem;
}
.kode-actions {
  display: flex;
  gap: 0.75rem;
  width: 100%;
  max-width: 280px;
}
.btn-kode {
  flex: 1;
  padding: 0.65rem;
  border-radius: 10px;
  border: none;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  transition:
    opacity 0.2s,
    transform 0.2s;
}
.btn-kode:hover {
  opacity: 0.87;
  transform: translateY(-1px);
}
.btn-kode.tolak {
  background: #fee2e2;
  color: #b91c1c;
}
.btn-kode.setuju {
  background: linear-gradient(135deg, #2e87f6, #1d6fd4);
  color: #fff;
}

/* Riwayat button */
.btn-riwayat {
  background: none;
  border: 1.5px solid #d1d5db;
  border-radius: 10px;
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  transition:
    border-color 0.2s,
    color 0.2s;
  margin-top: 0.25rem;
}
.btn-riwayat:hover {
  border-color: #2e87f6;
  color: #2e87f6;
}

/* ===== MODAL ===== */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}
.modal-box {
  background: #fff;
  border-radius: 18px;
  width: 90%;
  max-width: 420px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #e5e7eb;
}
.modal-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}
.modal-close {
  background: none;
  border: none;
  font-size: 1rem;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem;
  transition: color 0.2s;
}
.modal-close:hover {
  color: #1f2937;
}
.modal-body {
  padding: 1rem 1.25rem;
  overflow-y: auto;
}
.riwayat-empty {
  text-align: center;
  font-size: 0.82rem;
  color: #9ca3af;
  padding: 1.5rem 0;
}
.riwayat-list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}
.riwayat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.65rem 0.9rem;
  background: #f9fafb;
  border-radius: 10px;
  border-left: 3px solid #2e87f6;
}
.riwayat-kode {
  font-size: 1rem;
  font-weight: 700;
  color: #1f2937;
  letter-spacing: 0.15em;
}
.riwayat-tanggal {
  font-size: 0.72rem;
  color: #6b7280;
}

/* ===== MODAL KONFIRMASI LOGOUT ===== */
.modal-confirm {
  max-width: 340px;
}
.confirm-body {
  padding: 1.75rem 1.5rem;
  text-align: center;
}
.confirm-text {
  font-size: 0.92rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 1.25rem;
}
.confirm-actions {
  display: flex;
  gap: 0.75rem;
}
.btn-confirm {
  flex: 1;
  padding: 0.7rem;
  border-radius: 12px;
  border: none;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}
.btn-confirm:hover {
  transform: translateY(-2px);
}
.btn-no {
  background: #f3f4f6;
  color: #374151;
}
.btn-no:hover {
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.1);
}
.btn-yes {
  background: linear-gradient(135deg, #f35c2b 0%, #d6481c 100%);
  color: #fff;
}
.btn-yes:hover {
  box-shadow: 0 8px 18px rgba(243, 92, 43, 0.35);
}

/* =====================================================
   BREAKPOINTS (sama seperti LandingPage.vue, LoginPage.vue,
   SignInPage.vue, LoginAdmin.vue)
   @media 641px  : tablet
   @media 768px  : desktop
   @media 1024px : large desktop
   ===================================================== */

/* ===== TABLET (≥ 641px) ===== */
@media (min-width: 641px) {
  .dashboard-content {
    padding-bottom: 2.75rem;
  }

  .dashboard-section {
    padding: 1.75rem 1.1rem 0;
  }
  .section-title {
    font-size: 1.1rem;
  }
  .section-desc {
    font-size: 0.82rem;
    margin-bottom: 0.9rem;
  }

  .section-card {
    gap: 0.8rem;
    padding: 1.1rem 1.25rem;
    font-size: 0.88rem;
  }
  .btn-logout {
    gap: 0.45rem;
    padding: 0.55rem 1.1rem;
    font-size: 0.76rem;
  }
  .btn-logout .card-icon {
    font-size: 0.9rem;
  }
  .card-icon {
    font-size: 1.25rem;
  }
  .card-arrow {
    font-size: 1.05rem;
  }

  .kode-box {
    padding: 1.75rem;
    min-height: 120px;
  }
  .btn-generate {
    padding: 0.85rem 2.5rem;
    font-size: 1rem;
  }
  .kode-display {
    font-size: 3rem;
    padding: 0.75rem 2.5rem;
  }
  .kode-actions {
    max-width: 320px;
  }
  .btn-kode {
    padding: 0.75rem;
    font-size: 0.88rem;
  }
  .btn-riwayat {
    font-size: 0.85rem;
    padding: 0.6rem 1.25rem;
  }
  .modal-box {
    max-width: 460px;
  }
  .modal-title {
    font-size: 1rem;
  }
  .riwayat-kode {
    font-size: 1.05rem;
  }
  .riwayat-tanggal {
    font-size: 0.76rem;
  }
}

/* ===== DESKTOP (≥ 768px) ===== */
@media (min-width: 768px) {
  .dashboard-content {
    padding-bottom: 3rem;
  }

  .dashboard-section {
    padding: 2.25rem 1.5rem 0;
  }
  .section-title {
    font-size: 1.2rem;
  }
  .section-desc {
    font-size: 0.85rem;
    margin-bottom: 1rem;
  }

  .section-card {
    gap: 0.85rem;
    padding: 1.25rem 1.5rem;
    font-size: 0.92rem;
  }
  .btn-logout {
    gap: 0.5rem;
    padding: 0.6rem 1.2rem;
    font-size: 0.8rem;
    border-radius: 11px;
  }
  .btn-logout .card-icon {
    font-size: 0.95rem;
  }
  .card-icon {
    font-size: 1.3rem;
  }
  .card-arrow {
    font-size: 1.1rem;
  }

  .kode-box {
    padding: 2rem;
    min-height: 140px;
  }
  .btn-generate {
    padding: 0.9rem 3rem;
    font-size: 1.05rem;
    border-radius: 14px;
  }
  .kode-label {
    font-size: 0.85rem;
  }
  .kode-display {
    font-size: 3.2rem;
    padding: 0.85rem 3rem;
    border-radius: 14px;
  }
  .kode-actions {
    max-width: 360px;
    gap: 1rem;
  }
  .btn-kode {
    padding: 0.8rem;
    font-size: 0.9rem;
    border-radius: 12px;
  }
  .btn-riwayat {
    font-size: 0.88rem;
    padding: 0.65rem 1.4rem;
    border-radius: 12px;
  }
  .modal-box {
    max-width: 500px;
  }
  .modal-header {
    padding: 1.25rem 1.5rem;
  }
  .modal-title {
    font-size: 1.05rem;
  }
  .modal-body {
    padding: 1.25rem 1.5rem;
  }
  .riwayat-item {
    padding: 0.75rem 1rem;
  }
  .riwayat-kode {
    font-size: 1.1rem;
  }
  .riwayat-tanggal {
    font-size: 0.78rem;
  }
  .spinner {
    width: 40px;
    height: 40px;
  }
  .loading-text {
    font-size: 0.88rem;
  }
}

/* ===== LARGE DESKTOP (≥ 1024px) ===== */
@media (min-width: 1024px) {
  .dashboard-content {
    padding-bottom: 3.5rem;
  }

  .dashboard-section {
    padding: 2.5rem 2.5rem 0;
  }
  .section-title {
    font-size: 1.3rem;
    margin-bottom: 0.4rem;
  }
  .section-desc {
    font-size: 0.9rem;
    margin-bottom: 1.1rem;
  }

  .section-card {
    gap: 0.9rem;
    padding: 1.35rem 1.75rem;
    font-size: 0.95rem;
  }
  .btn-logout {
    gap: 0.8rem;
    padding: 1.35rem 1.75rem;
    font-size: 0.95rem;
  }
  .card-icon {
    font-size: 1.4rem;
  }
  .card-arrow {
    font-size: 1.15rem;
  }

  .kode-box {
    padding: 2.25rem 2.5rem;
    min-height: 160px;
  }
  .btn-generate {
    padding: 1rem 3.5rem;
    font-size: 1.1rem;
  }
  .kode-display {
    font-size: 3.5rem;
    padding: 1rem 3.5rem;
    letter-spacing: 0.5em;
  }
  .kode-actions {
    max-width: 400px;
  }
  .btn-kode {
    padding: 0.85rem;
    font-size: 0.95rem;
  }
  .btn-riwayat {
    font-size: 0.9rem;
    padding: 0.7rem 1.5rem;
  }
  .modal-box {
    max-width: 520px;
  }
  .riwayat-kode {
    font-size: 1.15rem;
  }
  .riwayat-tanggal {
    font-size: 0.8rem;
  }
}
</style>
