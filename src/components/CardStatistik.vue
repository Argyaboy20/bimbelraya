<!-- CardStatistik.vue -->
<template>
  <div class="card-statistik-wrap">
    <div class="card-statistik">

      <!-- Tentor Aktif -->
      <div class="stat-item bg-blue">
        <div class="stat-icon">👨‍🏫</div>
        <div class="stat-value">{{ tentorAktif }}</div>
        <div class="stat-label">Tentor Aktif</div>
      </div>

      <!-- Walimurid Aktif -->
      <div class="stat-item bg-orange">
        <div class="stat-icon">👨‍👩‍👧</div>
        <div class="stat-value">{{ walimuridAktif }}</div>
        <div class="stat-label">Walimurid Aktif</div>
      </div>

      <!-- Frekuensi Presensi Per Hari -->
      <div class="stat-item bg-cream">
        <div class="stat-icon">📋</div>
        <div class="stat-value">{{ frekuensiPresensi }}</div>
        <div class="stat-label">Frekuensi Presensi / Hari</div>
      </div>

    </div>
  </div>
</template>

<script setup>
// ============================================
// Data diterima dari Dashboard.vue lewat props.
// Saat ini Dashboard.vue masih kirim dummy data,
// nanti tinggal diganti hasil fetch API — komponen
// ini sendiri tidak perlu diubah sama sekali.
// ============================================
defineProps({
  tentorAktif: {
    type: [Number, String],
    default: 0
  },
  walimuridAktif: {
    type: [Number, String],
    default: 0
  },
  frekuensiPresensi: {
    type: [Number, String],
    default: 0
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

* {
  font-family: 'DM Sans', sans-serif;
  box-sizing: border-box;
}

/* =====================================================
   MOBILE (default, < 641px)
   ===================================================== */

/* ===== WRAPPER: kasih sedikit gap kiri-kanan, hampir full width ===== */
.card-statistik-wrap {
  width: 100%;
  padding: 0 0.75rem;
  margin-top: 1.1rem;
}

/* ===== CARD UTAMA ===== */
.card-statistik {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 2 item per baris di semua ukuran */
  gap: 0.7rem;
  border-radius: 18px;
  padding: 0.85rem;
  background: linear-gradient(135deg, #F9ECCC 0%, #ffffff 35%, #F9ECCC 100%);
  box-shadow: 0 12px 32px rgba(46, 135, 246, 0.12), 0 2px 8px rgba(0,0,0,0.04);
}

/* ===== ITEM STATISTIK ===== */
.stat-item {
  border-radius: 14px;
  padding: 1rem 0.8rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.3rem;
  color: #fff;
  position: relative;
  overflow: hidden;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.stat-item:hover {
  transform: translateY(-3px);
}

.stat-icon {
  font-size: 1.3rem;
  margin-bottom: 0.15rem;
}
.stat-value {
  font-size: 1.4rem;
  font-weight: 700;
  line-height: 1;
}
.stat-label {
  font-size: 0.68rem;
  font-weight: 500;
  opacity: 0.92;
  line-height: 1.3;
}

/* ===== VARIAN WARNA — kombinasi brand ===== */
.bg-blue {
  background: linear-gradient(145deg, #2E87F6 0%, #1d6fd4 100%);
  box-shadow: 0 8px 20px rgba(46, 135, 246, 0.3);
}
.bg-orange {
  background: linear-gradient(145deg, #F35C2B 0%, #d6481c 100%);
  box-shadow: 0 8px 20px rgba(243, 92, 43, 0.3);
}
/* Item ke-3 (cream) butuh teks gelap karena background terang */
.bg-cream {
  background: linear-gradient(145deg, #F9ECCC 0%, #f3dfa8 100%);
  box-shadow: 0 8px 20px rgba(243, 197, 92, 0.25);
  color: #5a4a1f;
  /* Item ke-3 melebar penuh 2 kolom karena jumlahnya ganjil (3 item, 2 per baris) */
  grid-column: 1 / -1;
}

/* =====================================================
   BREAKPOINTS (sama seperti LandingPage.vue, LoginPage.vue,
   SignInPage.vue, LoginAdmin.vue, Dashboard.vue, Navbar.vue)
   @media 641px  : tablet
   @media 768px  : desktop
   @media 1024px : large desktop
   Catatan: tetap 2 item per baris di semua ukuran (item ke-3
   melebar full width), yang berubah hanya proporsi/ukuran.
   ===================================================== */

/* ===== TABLET (≥ 641px) ===== */
@media (min-width: 641px) {
  .card-statistik-wrap {
    padding: 0 1.1rem;
    margin-top: 1.2rem;
  }
  .card-statistik {
    border-radius: 19px;
    padding: 1.15rem;
    gap: 1rem;
  }
  .stat-item {
    border-radius: 15px;
    padding: 1.25rem 1rem;
  }
  .stat-icon {
    font-size: 1.55rem;
  }
  .stat-value {
    font-size: 1.75rem;
  }
  .stat-label {
    font-size: 0.78rem;
  }
}

/* ===== DESKTOP (≥ 768px) ===== */
@media (min-width: 768px) {
  .card-statistik-wrap {
    padding: 0 1.5rem;
  }
  .card-statistik {
    padding: 1.5rem;
    gap: 1.25rem;
  }
  .stat-item {
    padding: 1.5rem 1.25rem;
  }
  .stat-icon {
    font-size: 1.7rem;
  }
  .stat-value {
    font-size: 2rem;
  }
  .stat-label {
    font-size: 0.85rem;
  }
}

/* ===== LARGE DESKTOP (≥ 1024px) ===== */
@media (min-width: 1024px) {
  .card-statistik-wrap {
    padding: 0 2.5rem;
  }
  .card-statistik {
    /* Tetap 2 per baris sesuai instruksi, card-3 tetap full width
       agar konsisten dengan mobile/tablet meski ruang sudah lega */
    padding: 1.75rem 2rem;
  }
  .stat-item {
    padding: 1.65rem 1.4rem;
  }
  .stat-icon {
    font-size: 1.8rem;
  }
  .stat-value {
    font-size: 2.2rem;
  }
  .stat-label {
    font-size: 0.88rem;
  }
}
</style>