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

/* ===== WRAPPER: kasih sedikit gap kiri-kanan, hampir full width ===== */
.card-statistik-wrap {
  width: 100%;
  padding: 0 0.85rem;
  margin-top: 1.25rem;
}

/* ===== CARD UTAMA ===== */
.card-statistik {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 2 item per baris di semua ukuran */
  gap: 0.85rem;
  border-radius: 20px;
  padding: 1rem;
  background: linear-gradient(135deg, #F9ECCC 0%, #ffffff 35%, #F9ECCC 100%);
  box-shadow: 0 12px 32px rgba(46, 135, 246, 0.12), 0 2px 8px rgba(0,0,0,0.04);
}

/* ===== ITEM STATISTIK ===== */
.stat-item {
  border-radius: 16px;
  padding: 1.1rem 0.9rem;
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
  font-size: 1.4rem;
  margin-bottom: 0.15rem;
}
.stat-value {
  font-size: 1.6rem;
  font-weight: 700;
  line-height: 1;
}
.stat-label {
  font-size: 0.72rem;
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

/* ===== RESPONSIVE: tablet & desktop — proporsi lebih lega ===== */
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

@media (min-width: 1024px) {
  .card-statistik-wrap {
    padding: 0 2.5rem;
  }
  .card-statistik {
    /* Desktop: tetap 2 per baris sesuai instruksi, tapi card-3 tidak perlu full width
       lagi karena ruang sudah lega — namun tetap dipertahankan agar konsisten dengan
       mobile/tablet sesuai pola "2 item per baris, sisa turun ke bawah" */
    padding: 1.75rem 2rem;
  }
  .stat-value {
    font-size: 2.2rem;
  }
}
</style>