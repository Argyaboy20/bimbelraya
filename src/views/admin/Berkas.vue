<!-- Berkas.vue (admin) -->
<template>
  <div class="berkas-page">
    <Navbar />

    <div class="page-content">
      <h1 class="page-title">Berkas Bimbel Raya</h1>
      <p class="page-note">
        File yang diunggah di sini muncul di halaman Berkas semua tentor. Klik nama file untuk membukanya atau unduh.
      </p>

      <BerkasManager peran="admin" />
    </div>
  </div>
</template>

<script setup>
defineOptions({ name: 'AdminBerkas' })
import Navbar from '@/components/Navbar.vue'
import BerkasManager from '@/components/BerkasManager.vue'
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

* {
  font-family: 'DM Sans', sans-serif;
  box-sizing: border-box;
}

.berkas-page {
  width: 100%;
  min-height: 100vh;
  background: #f7f8fa;
}
.page-content {
  width: 100%;
  padding: 1.5rem 0 3rem;
}
.page-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.35rem;
  padding: 0 1rem;
  text-align: center;
}
.page-note {
  font-size: 0.74rem;
  color: #6b7280;
  text-align: center;
  margin: 0 0 1.1rem;
  padding: 0 1rem;
}

/* =====================================================
   BREAKPOINTS
   @media 641px  : tablet
   @media 768px  : desktop
   @media 1024px : large desktop
   ===================================================== */
@media (min-width: 641px) {
  .page-title {
    font-size: 1.3rem;
  }
  .page-note {
    font-size: 0.82rem;
  }
}
@media (min-width: 768px) {
  .page-title {
    font-size: 1.45rem;
  }
}
@media (min-width: 1024px) {
  .page-title {
    font-size: 1.6rem;
  }
  .page-note {
    font-size: 0.9rem;
  }
}
</style>