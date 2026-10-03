<!-- Lowongan.vue -->
<template>
  <div class="lowongan-page">
    <div class="lowongan-container">
      <button type="button" class="back-link" @click="kembali">‹ Kembali</button>

      <!-- ===== HEADER: logo + judul ===== -->
      <header class="lowongan-header">
        <img src="/assets/logobimbel.png" alt="Logo Bimbel Raya" class="header-logo" />
        <h1 class="header-title">
          LOWONGAN TENTOR
          <br class="title-break" />
          BIMBEL RAYA
        </h1>
      </header>

      <div class="lowongan-layout">
        <!-- ===== TABEL LOWONGAN (hanya tampilan, tidak bisa diubah) ===== -->
        <div class="table-wrapper">
          <table class="loker-table">
            <thead>
              <tr>
                <th class="col-no">No</th>
                <th v-for="kolom in KOLOM_LOWONGAN" :key="kolom.key">{{ kolom.label }}</th>
                <th>Guru (P/L)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="lowonganStore.items.length === 0">
                <td :colspan="KOLOM_LOWONGAN.length + 3" class="empty-row">
                  Belum ada lowongan tersedia saat ini
                </td>
              </tr>

              <tr v-for="(item, index) in lowonganStore.items" :key="item.id">
                <td class="col-no">{{ index + 1 }}</td>
                <td v-for="kolom in KOLOM_LOWONGAN" :key="kolom.key">{{ item[kolom.key] }}</td>
                <td class="col-center">{{ item.guru }}</td>
                <td class="col-center">
                  <span
                    class="badge"
                    :class="item.status === 'Tersedia' ? 'badge-tersedia' : 'badge-diambil'"
                  >
                    {{ item.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- ===== KOTAK NOTE MERAH ===== -->
        <aside class="note-box">
          <p class="note-title">NOTE:</p>
          <ol class="note-list">
            <li>
              DILARANG MENYEBARKAN LOKER DEMI KEUNTUNGAN PRIBADI DENGAN MENGAMBIL ALIH LOKER TANPA
              SEPENGETAHUAN BIMBEL RAYA
            </li>
            <li>SEMUA LOKER HARUS MELALUI PERANTARA BIMBEL RAYA</li>
            <li>
              JIKA KETAHUAN MENGAMBIL ALIH LOKER TANPA SEPENGETAHUAN PIHAK BIMBEL, MAKA AKAN
              DIKELUARKAN DAN BLACKLIST DARI PEREKRUTAN TENTOR
            </li>
          </ol>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup>
defineOptions({ name: 'LowonganTentor' })
import { useRouter } from 'vue-router'
import { useLowonganStore, KOLOM_LOWONGAN } from '@/stores/lowongan'

const router = useRouter()
const lowonganStore = useLowonganStore()

// Halaman ini bisa dibuka dari dashboard tentor ATAU langsung lewat link publik,
// jadi kalau tidak ada riwayat halaman sebelumnya, arahkan ke beranda.
const kembali = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

* {
  font-family: 'DM Sans', sans-serif;
  box-sizing: border-box;
}

.lowongan-page {
  width: 100%;
  min-height: 100vh;
  background-color: #fdfaf3;
  background-image:
    radial-gradient(circle at 12% 18%, rgba(46, 135, 246, 0.14) 0%, transparent 42%),
    radial-gradient(circle at 88% 12%, rgba(243, 92, 43, 0.12) 0%, transparent 40%),
    radial-gradient(circle at 50% 92%, rgba(249, 236, 204, 0.5) 0%, transparent 58%);
}

.lowongan-container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem 0.85rem 3rem;
}

.back-link {
  background: none;
  border: none;
  padding: 0;
  margin-bottom: 0.75rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: #2e87f6;
  cursor: pointer;
}
.back-link:hover {
  text-decoration: underline;
}

/* ===== HEADER ===== */
.lowongan-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #fff;
  border: 1px solid #d9dee5;
  border-radius: 14px;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
}
.header-logo {
  height: 44px;
  width: auto;
  flex-shrink: 0;
}
.header-title {
  font-size: clamp(0.78rem, 3.6vw, 0.95rem);
  font-weight: 700;
  letter-spacing: 0.02em;
  color: #1d4fd8;
  margin: 0;
  line-height: 1.3;
  white-space: nowrap;
}

/* ===== LAYOUT: tabel + kotak note ===== */
.lowongan-layout {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* ===== TABEL ===== */
.table-wrapper {
  width: 100%;
  min-width: 0;
  overflow-x: auto;
  background: #fff;
  border: 1px solid #d9dee5;
  border-radius: 14px;
}

.loker-table {
  width: 100%;
  min-width: 1150px;
  border-collapse: collapse;
}
.loker-table th {
  background: #0b3a6b;
  color: #fff;
  font-size: 0.74rem;
  font-weight: 700;
  padding: 0.65rem 0.6rem;
  text-align: center;
  white-space: nowrap;
  border: 1px solid #0b3a6b;
}
.loker-table td {
  font-size: 0.78rem;
  color: #1f2937;
  padding: 0.6rem;
  border: 1px solid #e3e7ec;
  vertical-align: top;
  line-height: 1.4;
}
.col-no {
  width: 46px;
  text-align: center;
  font-weight: 700;
  color: #0b3a6b;
}
.col-center {
  text-align: center;
  white-space: nowrap;
}
.empty-row {
  text-align: center;
  color: #9ca3af;
  font-size: 0.85rem;
  padding: 2rem 1rem;
}

/* ===== BADGE STATUS ===== */
.badge {
  display: inline-block;
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 700;
}
.badge-tersedia {
  background: #dcfce7;
  color: #15803d;
}
.badge-diambil {
  background: #fee2e2;
  color: #b91c1c;
}

/* ===== KOTAK NOTE MERAH ===== */
.note-box {
  background: #e60000;
  color: #fff;
  border-radius: 14px;
  padding: 1rem 1.1rem;
  box-shadow: 0 8px 20px rgba(230, 0, 0, 0.22);
}
.note-title {
  font-size: 1rem;
  font-weight: 700;
  margin: 0 0 0.5rem;
}
.note-list {
  margin: 0;
  padding-left: 1.25rem;
  font-size: 0.78rem;
  font-weight: 600;
  line-height: 1.6;
  letter-spacing: 0.01em;
}
.note-list li + li {
  margin-top: 0.4rem;
}

/* =====================================================
   BREAKPOINTS
   @media 641px  : tablet
   @media 768px  : desktop
   @media 1024px : large desktop (tabel di kiri, note merah di kanan)
   ===================================================== */

@media (min-width: 641px) {
  .lowongan-container {
    padding: 1.25rem 1.25rem 3.5rem;
  }
  .lowongan-header {
    padding: 0.9rem 1.25rem;
    gap: 1rem;
  }
  .header-logo {
    height: 52px;
  }
  .header-title {
    font-size: 1.2rem;
    white-space: normal;
  }
  .title-break {
    display: none;
  }
  .loker-table th {
    font-size: 0.78rem;
    padding: 0.75rem 0.7rem;
  }
  .loker-table td {
    font-size: 0.82rem;
    padding: 0.7rem;
  }
  .note-box {
    padding: 1.15rem 1.35rem;
  }
  .note-list {
    font-size: 0.82rem;
  }
}

@media (min-width: 768px) {
  .lowongan-container {
    padding: 1.5rem 1.5rem 4rem;
  }
  .header-logo {
    height: 58px;
  }
  .header-title {
    font-size: 1.4rem;
  }
  .loker-table th {
    font-size: 0.82rem;
  }
  .loker-table td {
    font-size: 0.85rem;
  }
  .note-list {
    font-size: 0.86rem;
  }
}

@media (min-width: 1024px) {
  .lowongan-container {
    padding: 1.75rem 2.5rem 4rem;
  }
  .header-logo {
    height: 64px;
  }
  .header-title {
    font-size: 1.6rem;
  }
  .lowongan-layout {
    flex-direction: row;
    align-items: flex-start;
    gap: 1.25rem;
  }
  .table-wrapper {
    flex: 1;
  }
  .note-box {
    width: 320px;
    flex-shrink: 0;
  }
  .loker-table th {
    font-size: 0.84rem;
  }
  .loker-table td {
    font-size: 0.86rem;
  }
}
</style>