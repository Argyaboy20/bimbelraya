<!-- DashboardTentor.vue -->
<template>
  <div class="dashboard-tentor-page">
    <!-- =====================================================
         NAVBAR KHUSUS TENTOR
         (mirip Navbar.vue admin, tapi sudut kiri berisi
         icon profil bulat + greeting text tentor)
         ===================================================== -->
    <nav class="tentor-navbar">
      <!-- ===== SUDUT KIRI: Icon Profil Bulat + Sapaan ===== -->
      <div class="navbar-left">
        <router-link
          :to="`/tentor/biodata/${kodeTentor}`"
          class="profile-icon"
          aria-label="Lihat Biodata Tentor"
        >
          <span class="profile-initial">{{ inisialTentor }}</span>
        </router-link>

        <p class="greeting-text">{{ greetingText }}</p>
      </div>

      <!-- ===== TENGAH: Logo (selalu center, sama seperti Navbar.vue) ===== -->
      <div class="logo-area">
        <img src="/assets/logobimbel.png" alt="Logo Bimbel Raya" class="navbar-logo" />
      </div>

      <!-- ===== KANAN: slot kosong, jaga keseimbangan grid ===== -->
      <div class="right-area"></div>
    </nav>

    <!-- =====================================================
         ISI DASHBOARD TENTOR
         3 section: Presensi, Perpanjang Kontrak, Lowongan Tentor
         ===================================================== -->
    <div class="dashboard-content">
      <!-- ===== SECTION 1: PRESENSI ===== -->
      <section class="tentor-section">
        <div class="tentor-card card-presensi">
          <div class="card-icon-circle">🕒</div>
          <div class="card-body">
            <h2 class="card-title">Presensi</h2>
            <p class="card-desc">
              Catat kehadiran mengajarmu hari ini agar laporan presensi tetap akurat dan tepat
              waktu.
            </p>
            <router-link :to="`/tentor/presensi/${kodeTentor}`" class="card-btn btn-presensi">
              Isi Presensi <span class="btn-arrow">→</span>
            </router-link>
          </div>
        </div>
      </section>

      <!-- ===== SECTION 2: PERPANJANG KONTRAK ===== -->
      <section class="tentor-section">
        <div class="tentor-card card-kontrak">
          <div class="card-icon-circle">📄</div>
          <div class="card-body">
            <h2 class="card-title">Perpanjang Kontrak</h2>
            <p class="card-desc">
              Kontrak mengajarmu akan segera berakhir? Ajukan perpanjangan kontrak di sini.
            </p>
            <router-link :to="`/tentor/kontrak/${kodeTentor}`" class="card-btn btn-kontrak">
              Perpanjang Kontrak <span class="btn-arrow">→</span>
            </router-link>
          </div>
        </div>
      </section>

      <!-- ===== SECTION 3: LOWONGAN TENTOR ===== -->
      <section class="tentor-section">
        <div class="tentor-card card-lowongan">
          <div class="card-icon-circle">📢</div>
          <div class="card-body">
            <h2 class="card-title">Lowongan Tentor</h2>
            <p class="card-desc">
              Lihat lowongan mengajar baru yang tersedia dan daftarkan dirimu untuk kelas tambahan.
            </p>
            <router-link to="/lowongan" class="card-btn btn-lowongan">
              Lihat Lowongan <span class="btn-arrow">→</span>
            </router-link>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
defineOptions({ name: 'DashboardTentor' })
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
// kodeTentor diambil dari URL /tentor/dashboardtentor/:id (dummy sekarang: "1001")
// dipakai untuk: (1) fetch data tentor dari backend nanti,
// (2) disisipkan ke link biodata/presensi/kontrak di bawah supaya tiap tentor
//     tetap di halaman miliknya sendiri (bukan halaman tentor lain)
const kodeTentor = route.params.id

// ============================================
// DUMMY DATA NAMA TENTOR — nanti diganti hasil fetch API, contoh:
//
// const namaTentor = ref('')
// onMounted(async () => {
//   const res = await fetch(`/api/tentor/${kodeTentor}`)
//   const data = await res.json()
//   namaTentor.value = data.namaLengkap
// })
// ============================================
const namaTentor = ref('Ahmad Fauzi')

// Inisial untuk icon profil bulat (ambil huruf depan tiap kata, maks 2 huruf)
const inisialTentor = computed(() => {
  return namaTentor.value
    .split(' ')
    .map((kata) => kata[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
})

// ===== WAKTU SAAT INI (update tiap menit, agar sapaan akurat) =====
const now = ref(new Date())
let clockTimer = null

const getTimePeriod = () => {
  const hour = now.value.getHours()
  if (hour >= 4 && hour < 11) return 'pagi'
  if (hour >= 11 && hour < 15) return 'siang'
  if (hour >= 15 && hour < 18) return 'sore'
  return 'malam'
}

// ===== SAPAAN (sudut kiri navbar) =====
// Hanya satu teks statis (tanpa gantian seperti di Navbar.vue admin)
const greetingText = computed(() => {
  const period = getTimePeriod()
  const labels = {
    pagi: `Haii! Selamat Pagi, Kak ${namaTentor.value}`,
    siang: `Haii! Selamat Siang, Kak ${namaTentor.value}`,
    sore: `Haii! Selamat Sore, Kak ${namaTentor.value}`,
    malam: `Haii! Selamat Malam, Kak ${namaTentor.value}`,
  }
  return labels[period]
})

onMounted(() => {
  // Update jam tiap menit, supaya sapaan otomatis berubah saat lewat batas waktu
  clockTimer = setInterval(() => {
    now.value = new Date()
  }, 60 * 1000)
})

onUnmounted(() => {
  clearInterval(clockTimer)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

* {
  font-family: 'DM Sans', sans-serif;
  box-sizing: border-box;
}

/* =====================================================
   BACKGROUND HALAMAN — dibuat "bercorak", bukan polos putih.
   Blob warna brand + corak titik-titik & lingkaran blur
   ditaruh di SISI KANAN saja (memudar ke kiri) supaya tidak
   mengganggu keterbacaan konten. Semua elemen dekoratif ada
   di ::before / ::after dengan z-index rendah + pointer-events:
   none, jadi murni dekorasi di belakang konten.
   ===================================================== */
.dashboard-tentor-page {
  position: relative;
  overflow: hidden; /* jaga agar blob dekoratif tidak memicu scroll horizontal */
  width: 100%;
  min-height: 100vh;
  background-color: #fdfaf3;
  background-image:
    radial-gradient(circle at 12% 18%, rgba(46, 135, 246, 0.18) 0%, transparent 42%),
    radial-gradient(circle at 88% 12%, rgba(243, 92, 43, 0.16) 0%, transparent 40%),
    radial-gradient(circle at 50% 92%, rgba(249, 236, 204, 0.55) 0%, transparent 58%);
}

/* ===== Corak titik-titik, hanya di sisi kanan, memudar ke kiri ===== */
.dashboard-tentor-page::before {
  content: '';
  position: absolute;
  inset: 0 0 0 auto;
  width: 24%;
  max-width: 160px;
  pointer-events: none;
  z-index: 0;
  background-image:
    radial-gradient(rgba(46, 135, 246, 0.18) 1.5px, transparent 1.5px),
    radial-gradient(rgba(243, 92, 43, 0.15) 1.5px, transparent 1.5px);
  background-size:
    26px 26px,
    26px 26px;
  background-position:
    0 0,
    13px 13px;
  -webkit-mask-image: linear-gradient(to left, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%);
  mask-image: linear-gradient(to left, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%);
}

/* ===== Blob lingkaran blur, nempel di tepi kanan ===== */
.dashboard-tentor-page::after {
  content: '';
  position: absolute;
  top: 10%;
  right: -70px;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(249, 236, 204, 0.9) 0%,
    rgba(243, 92, 43, 0.22) 60%,
    transparent 75%
  );
  filter: blur(6px);
  pointer-events: none;
  z-index: 0;
}

/* Pastikan navbar & konten selalu tampil DI ATAS lapisan dekoratif */
.tentor-navbar,
.dashboard-content {
  position: relative;
  z-index: 1;
}

/* =====================================================
   NAVBAR TENTOR — warna & struktur mengikuti Navbar.vue,
   tapi sudut kiri berisi icon profil bulat + greeting
   ===================================================== */
.tentor-navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: 0.75rem 1rem;
  background: linear-gradient(
    135deg,
    rgba(46, 135, 246, 0.92) 0%,
    rgba(57, 148, 255, 0.88) 50%,
    rgba(46, 135, 246, 0.92) 100%
  );
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  box-shadow:
    0 4px 24px rgba(46, 135, 246, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
  border-bottom: 1px solid rgba(255, 255, 255, 0.18);
}

/* ===== SUDUT KIRI: icon profil + teks sapaan ===== */
.navbar-left {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  min-width: 0; /* agar teks panjang tidak mendorong layout di mobile */
}

.profile-icon {
  flex-shrink: 0;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.18),
    inset 0 0 0 2px rgba(46, 135, 246, 0.25);
  text-decoration: none;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}
.profile-icon:hover {
  transform: scale(1.08) translateY(-1px);
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.22),
    inset 0 0 0 2px rgba(46, 135, 246, 0.4);
}
.profile-icon:active {
  transform: scale(0.96);
}
.profile-initial {
  font-size: 0.68rem;
  font-weight: 700;
  color: #2e87f6;
  letter-spacing: 0.02em;
}

.greeting-text {
  color: #fff;
  font-size: 0.72rem;
  font-weight: 600;
  white-space: normal;
  overflow: visible;
  word-break: break-word;
  line-height: 1.3;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin: 0;
}

/* ===== LOGO (mobile: nempel pojok kanan, sama seperti Navbar.vue) ===== */
.logo-area {
  order: 3;
  justify-self: end;
}
.navbar-logo {
  height: 30px;
  width: auto;
  filter: brightness(0) invert(1);
}

/* ===== KANAN (placeholder, jaga grid seimbang) ===== */
.right-area {
  order: 2;
}

/* =====================================================
   ISI DASHBOARD
   ===================================================== */
.dashboard-content {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding-bottom: 2.5rem;
}

.tentor-section {
  padding: 1.25rem 0.85rem 0;
}

/* ===== CARD — desain vertikal, beda dari section-card Dashboard.vue
   yang berupa link horizontal berwarna penuh ===== */
.tentor-card {
  display: flex;
  align-items: flex-start;
  gap: 0.9rem;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border-radius: 20px;
  padding: 1.1rem;
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.08);
  border-left: 5px solid transparent;
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
}
.tentor-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.12);
}

.card-icon-circle {
  flex-shrink: 0;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.15rem;
}

.card-body {
  flex: 1;
  min-width: 0;
}
.card-title {
  font-size: 0.98rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.25rem;
}
.card-desc {
  font-size: 0.76rem;
  color: #6b7280;
  line-height: 1.5;
  margin: 0 0 0.75rem;
}

.card-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.55rem 1rem;
  border-radius: 999px;
  text-decoration: none;
  font-weight: 700;
  font-size: 0.74rem;
  letter-spacing: 0.01em;
  color: #fff;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}
.card-btn:hover {
  transform: translateX(3px);
}
.btn-arrow {
  transition: transform 0.2s ease;
}
.card-btn:hover .btn-arrow {
  transform: translateX(3px);
}

/* ===== Warna tiap card (kombinasi 3 warna brand) ===== */
.card-presensi {
  border-left-color: #2e87f6;
}
.card-presensi .card-icon-circle {
  background: linear-gradient(135deg, #2e87f6 0%, #1d6fd4 100%);
}
.btn-presensi {
  background: linear-gradient(135deg, #2e87f6 0%, #1d6fd4 100%);
  box-shadow: 0 6px 16px rgba(46, 135, 246, 0.3);
}

.card-kontrak {
  border-left-color: #f35c2b;
}
.card-kontrak .card-icon-circle {
  background: linear-gradient(135deg, #f35c2b 0%, #d6481c 100%);
}
.btn-kontrak {
  background: linear-gradient(135deg, #f35c2b 0%, #d6481c 100%);
  box-shadow: 0 6px 16px rgba(243, 92, 43, 0.3);
}

.card-lowongan {
  border-left-color: #f3dfa8;
}
.card-lowongan .card-icon-circle {
  background: linear-gradient(135deg, #f9eccc 0%, #f3dfa8 100%);
}
.btn-lowongan {
  background: linear-gradient(135deg, #f9eccc 0%, #f3dfa8 100%);
  color: #5a4a1f;
  box-shadow: 0 6px 16px rgba(243, 223, 168, 0.45);
}

/* =====================================================
   BREAKPOINTS (sama seperti Navbar.vue & Dashboard.vue)
   @media 641px  : tablet
   @media 768px  : desktop
   @media 1024px : large desktop
   ===================================================== */

/* ===== TABLET (≥ 641px) ===== */
@media (min-width: 641px) {
  .dashboard-tentor-page::before {
    width: 28%;
    max-width: 240px;
  }
  .dashboard-tentor-page::after {
    width: 200px;
    height: 200px;
    right: -80px;
  }

  .tentor-navbar {
    padding: 0.65rem 1.5rem;
  }
  .profile-icon {
    width: 34px;
    height: 34px;
  }
  .profile-initial {
    font-size: 0.74rem;
  }
  .greeting-text {
    font-size: 0.8rem;
  }
  .navbar-logo {
    height: 34px;
  }
  .logo-area {
    order: 2;
    justify-self: center;
  }
  .right-area {
    order: 3;
  }

  .dashboard-content {
    padding-bottom: 2.75rem;
  }
  .tentor-section {
    padding: 1.5rem 1.1rem 0;
  }
  .tentor-card {
    padding: 1.35rem;
    gap: 1.1rem;
    border-radius: 22px;
  }
  .card-icon-circle {
    width: 48px;
    height: 48px;
    font-size: 1.3rem;
  }
  .card-title {
    font-size: 1.05rem;
  }
  .card-desc {
    font-size: 0.8rem;
    margin-bottom: 0.9rem;
  }
  .card-btn {
    font-size: 0.78rem;
    padding: 0.6rem 1.15rem;
  }
}

/* ===== DESKTOP (≥ 768px) ===== */
@media (min-width: 768px) {
  .dashboard-tentor-page::before {
    width: 30%;
    max-width: 300px;
  }
  .dashboard-tentor-page::after {
    width: 230px;
    height: 230px;
    right: -85px;
  }

  .tentor-navbar {
    padding: 0.7rem 2rem;
  }
  .greeting-text {
    font-size: 0.88rem;
  }
  .navbar-logo {
    height: 36px;
  }

  .dashboard-content {
    padding-bottom: 3rem;
  }
  .tentor-section {
    padding: 1.75rem 1.5rem 0;
  }
  .tentor-card {
    padding: 1.5rem 1.75rem;
  }
  .card-icon-circle {
    width: 52px;
    height: 52px;
    font-size: 1.4rem;
  }
  .card-title {
    font-size: 1.1rem;
  }
  .card-desc {
    font-size: 0.83rem;
  }
  .card-btn {
    font-size: 0.82rem;
    padding: 0.65rem 1.3rem;
  }
}

/* ===== LARGE DESKTOP (≥ 1024px) ===== */
@media (min-width: 1024px) {
  .dashboard-tentor-page::before {
    width: 32%;
    max-width: 340px;
  }
  .dashboard-tentor-page::after {
    width: 260px;
    height: 260px;
    right: -90px;
  }

  .tentor-navbar {
    padding: 0.75rem 3rem;
  }
  .profile-icon {
    width: 38px;
    height: 38px;
  }
  .profile-initial {
    font-size: 0.8rem;
  }
  .greeting-text {
    font-size: 0.95rem;
  }
  .navbar-logo {
    height: 38px;
  }

  .dashboard-content {
    padding-bottom: 3.5rem;
    max-width: 900px;
  }
  .tentor-section {
    padding: 2rem 0 0;
  }
  .tentor-card {
    padding: 1.75rem 2rem;
    gap: 1.3rem;
  }
  .card-icon-circle {
    width: 56px;
    height: 56px;
    font-size: 1.5rem;
  }
  .card-title {
    font-size: 1.2rem;
  }
  .card-desc {
    font-size: 0.86rem;
  }
  .card-btn {
    font-size: 0.85rem;
    padding: 0.7rem 1.4rem;
  }
}
</style>
