<!-- Berkas.vue (tentor): hanya melihat dan mengunduh -->
<template>
  <div class="berkas-tentor-page">
    <div class="page-content">
      <div class="kepala">
        <router-link :to="`/tentor/dashboardtentor/${kodeTentor}`" class="link-kembali">
          <ChevronLeft size="1.15em" class="ikon-inline" /> Kembali
        </router-link>

        <h1 class="page-title">Berkas</h1>
        <p class="page-sub">Modul, soal, dan file lain dari admin. Kamu bisa mengunduhnya di sini.</p>
      </div>

      <BerkasManager peran="tentor" />
    </div>
  </div>
</template>

<script setup>
defineOptions({ name: 'TentorBerkas' })
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { ChevronLeft } from 'lucide-vue-next'
import BerkasManager from '@/components/BerkasManager.vue'

const route = useRoute()
const kodeTentor = computed(() => route.params.id)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

* {
  font-family: 'DM Sans', sans-serif;
  box-sizing: border-box;
}

.berkas-tentor-page {
  width: 100%;
  min-height: 100vh;
  background-color: #fafafa;
  background-image:
    radial-gradient(circle at 10% 15%, rgba(46, 135, 246, 0.1) 0%, transparent 45%),
    radial-gradient(circle at 90% 10%, rgba(243, 92, 43, 0.1) 0%, transparent 40%);
}
.page-content {
  width: 100%;
  padding: 1.25rem 0 2.5rem;
}

/* Judul sejajar dengan daftar di BerkasManager (lebar dan padding yang sama) */
.kepala {
  width: 100%;
  max-width: 960px;
  margin: 0 auto;
  padding: 0 1rem;
}
.link-kembali {
  display: inline-block;
  margin-bottom: 0.8rem;
  font-size: 0.8rem;
  font-weight: 700;
  color: #2e87f6;
  text-decoration: none;
}
.ikon-inline {
  display: inline-block;
  vertical-align: -0.18em;
  margin-right: 0.1rem;
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

/* =====================================================
   BREAKPOINTS
   @media 641px  : tablet
   @media 768px  : desktop
   @media 1024px : large desktop
   ===================================================== */
@media (min-width: 641px) {
  .kepala {
    padding: 0 1.5rem;
  }
  .page-title {
    font-size: 1.3rem;
  }
  .page-sub {
    font-size: 0.85rem;
  }
}
@media (min-width: 768px) {
  .page-title {
    font-size: 1.45rem;
  }
}
@media (min-width: 1024px) {
  .kepala {
    padding: 0 2rem;
  }
  .page-title {
    font-size: 1.6rem;
  }
  .page-sub {
    font-size: 0.9rem;
  }
}
</style>