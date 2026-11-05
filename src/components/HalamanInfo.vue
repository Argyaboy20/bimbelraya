<!-- HalamanInfo.vue: kerangka halaman informasi (Kebijakan Privasi, Tentang Sistem) -->
<template>
  <div class="info-page">
    <header class="info-header">
      <button type="button" class="info-kembali" @click="kembali">
        <ChevronLeft size="1.1em" /> Kembali
      </button>
      <img src="/assets/logobimbel.png" alt="Logo Bimbel Raya" class="info-logo" />
      <span></span>
    </header>

    <main class="info-isi">
      <h1 class="info-judul">{{ judul }}</h1>
      <p v-if="pembaruan" class="info-pembaruan">Terakhir diperbarui: {{ pembaruan }}</p>
      <slot />
    </main>

    <footer class="info-footer">© 2026 Bimbel Raya</footer>
  </div>
</template>

<script setup>
defineOptions({ name: 'HalamanInfo' })
import { useRouter } from 'vue-router'
import { ChevronLeft } from 'lucide-vue-next'

defineProps({
  judul: { type: String, required: true },
  pembaruan: { type: String, default: '' },
})

const router = useRouter()
// Ada riwayat halaman sebelumnya → mundur satu langkah; kalau halaman dibuka langsung → ke beranda
const kembali = () => {
  if (window.history.state?.back) router.back()
  else router.push('/')
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

* {
  font-family: 'DM Sans', sans-serif;
  box-sizing: border-box;
}

.info-page {
  width: 100%;
  min-height: 100vh;
  background-color: #fafafa;
  background-image:
    radial-gradient(circle at 10% 10%, rgba(46, 135, 246, 0.1) 0%, transparent 45%),
    radial-gradient(circle at 90% 5%, rgba(243, 92, 43, 0.1) 0%, transparent 40%);
}

/* ===== HEADER (mengikuti navbar tentor) ===== */
.info-header {
  position: sticky;
  top: 0;
  z-index: 10;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: 0.75rem 1rem;
  background: linear-gradient(
    135deg,
    rgba(46, 135, 246, 0.95) 0%,
    rgba(57, 148, 255, 0.9) 50%,
    rgba(46, 135, 246, 0.95) 100%
  );
  box-shadow: 0 4px 24px rgba(46, 135, 246, 0.25);
}
.info-kembali {
  justify-self: start;
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  border: 0;
  border-radius: 999px;
  padding: 0.4rem 0.8rem 0.4rem 0.5rem;
  font-size: 0.8rem;
  font-weight: 700;
  color: #fff;
  background: rgba(255, 255, 255, 0.2);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.35);
  cursor: pointer;
}
.info-kembali:hover {
  background: rgba(255, 255, 255, 0.32);
}
.info-logo {
  height: 30px;
  width: auto;
  filter: brightness(0) invert(1);
}

/* ===== ISI ===== */
.info-isi {
  width: 100%;
  max-width: 760px;
  margin: 0 auto;
  padding: 1.5rem 1rem 3rem;
}
.info-judul {
  margin: 0 0 0.3rem;
  font-size: 1.4rem;
  font-weight: 700;
  color: #1f2937;
}
.info-pembaruan {
  margin: 0 0 1.4rem;
  font-size: 0.74rem;
  color: #9ca3af;
}
.info-isi :slotted(h2) {
  margin: 1.6rem 0 0.5rem;
  font-size: 1.02rem;
  font-weight: 700;
  color: #1d6fd4;
}
.info-isi :slotted(p) {
  margin: 0 0 0.75rem;
  font-size: 0.88rem;
  line-height: 1.7;
  color: #374151;
}
.info-isi :slotted(ul) {
  margin: 0 0 0.75rem;
  padding-left: 1.2rem;
}
.info-isi :slotted(li) {
  margin-bottom: 0.4rem;
  font-size: 0.88rem;
  line-height: 1.65;
  color: #374151;
}
.info-isi :slotted(a) {
  color: #2e87f6;
  font-weight: 600;
}
.info-footer {
  padding: 1rem;
  text-align: center;
  font-size: 0.74rem;
  color: #9ca3af;
}

/* =====================================================
   BREAKPOINTS
   @media 641px  : tablet
   @media 768px  : desktop
   @media 1024px : large desktop
   ===================================================== */
@media (min-width: 641px) {
  .info-header {
    padding: 0.65rem 1.5rem;
  }
  .info-kembali {
    font-size: 0.85rem;
  }
  .info-logo {
    height: 34px;
  }
  .info-isi {
    padding: 2rem 1.5rem 3.5rem;
  }
  .info-judul {
    font-size: 1.6rem;
  }
  .info-isi :slotted(p),
  .info-isi :slotted(li) {
    font-size: 0.93rem;
  }
}
@media (min-width: 768px) {
  .info-header {
    padding: 0.7rem 2rem;
  }
  .info-logo {
    height: 36px;
  }
  .info-judul {
    font-size: 1.8rem;
  }
  .info-isi :slotted(h2) {
    font-size: 1.1rem;
  }
}
@media (min-width: 1024px) {
  .info-header {
    padding: 0.75rem 3rem;
  }
  .info-logo {
    height: 38px;
  }
  .info-isi {
    padding: 2.5rem 2rem 4rem;
  }
  .info-judul {
    font-size: 2rem;
  }
  .info-isi :slotted(p),
  .info-isi :slotted(li) {
    font-size: 0.98rem;
  }
}
</style>