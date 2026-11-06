<!-- VerifikasiEmail.vue: halaman yang terbuka dari tombol "Verifikasikan Email" di email (publik) -->
<template>
  <div class="verif-page">
    <div class="verif-card">
      <img src="/assets/logobimbel.png" alt="Logo Bimbel Raya" class="verif-logo" />

      <!-- Sedang memeriksa -->
      <div v-if="status === 'memeriksa'" class="verif-isi" aria-live="polite">
        <span class="spinner"></span>
        <h1 class="verif-judul">Memeriksa link...</h1>
        <p class="verif-teks">Mohon tunggu sebentar.</p>
      </div>

      <!-- Berhasil -->
      <div v-else-if="status === 'berhasil'" class="verif-isi" aria-live="polite">
        <span class="verif-ikon ikon-ok"><CircleCheck size="1em" /></span>
        <h1 class="verif-judul">Email Terverifikasi</h1>
        <p class="verif-teks">
          <strong class="verif-email">{{ email }}</strong> berhasil diverifikasi.
        </p>
        <p class="verif-teks">
          Kembali ke halaman pendaftaran tadi. Statusnya akan berubah otomatis, lalu lanjutkan mengisi data.
          Tab ini boleh ditutup.
        </p>
        <p class="verif-catatan">Verifikasi berlaku selama 60 menit.</p>
      </div>

      <!-- Gagal -->
      <div v-else class="verif-isi" aria-live="polite">
        <span class="verif-ikon ikon-gagal"><CircleX size="1em" /></span>
        <h1 class="verif-judul">Verifikasi Gagal</h1>
        <p class="verif-teks">{{ pesan }}</p>
        <router-link to="/daftar" class="verif-tombol">Ke Halaman Pendaftaran</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
defineOptions({ name: 'VerifikasiEmailPage' })
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { api, ApiError } from '@/api/http'
import { CircleCheck, CircleX } from 'lucide-vue-next'

const route = useRoute()
const status = ref('memeriksa') // 'memeriksa' | 'berhasil' | 'gagal'
const email = ref('')
const pesan = ref('')

onMounted(async () => {
  const token = typeof route.query.token === 'string' ? route.query.token : ''
  // Token dari server selalu 64 karakter heksadesimal; selain itu tidak perlu dikirim
  if (!/^[a-f0-9]{64}$/.test(token)) {
    pesan.value = 'Link verifikasi tidak valid. Minta link baru dari halaman pendaftaran.'
    status.value = 'gagal'
    return
  }
  try {
    const data = await api('/api/auth/tentor/email/verifikasi', {
      method: 'POST',
      auth: false,
      body: { token },
    })
    email.value = data.email
    status.value = 'berhasil'
  } catch (err) {
    pesan.value = err instanceof ApiError ? err.message : 'Terjadi kesalahan. Coba lagi.'
    status.value = 'gagal'
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

/* =====================================================
   BASE STYLES (MOBILE FIRST)
   ===================================================== */
* {
  font-family: 'DM Sans', sans-serif;
  box-sizing: border-box;
}

.verif-page {
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem 1rem;
  background: linear-gradient(135deg, #fff8ec 0%, #fdf1de 50%, #fbe9d0 100%);
}
.verif-card {
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1.5rem;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 20px 60px rgba(243, 92, 43, 0.12), 0 4px 16px rgba(0, 0, 0, 0.04);
  text-align: center;
}
.verif-logo {
  height: 48px;
  width: auto;
  margin-bottom: 1.5rem;
}
.verif-isi {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
}

.verif-ikon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin-bottom: 0.3rem;
}
.ikon-ok {
  color: #16a34a;
  background: #e6f6ec;
}
.ikon-gagal {
  color: #F35C2B;
  background: #fdeee8;
}
.spinner {
  width: 44px;
  height: 44px;
  margin-bottom: 0.3rem;
  border-radius: 50%;
  border: 4px solid rgba(46, 135, 246, 0.2);
  border-top-color: #2E87F6;
  animation: putar 0.8s linear infinite;
}
@keyframes putar {
  to {
    transform: rotate(360deg);
  }
}

.verif-judul {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 700;
  color: #1f2937;
}
.verif-teks {
  margin: 0;
  font-size: 0.86rem;
  line-height: 1.6;
  color: #4b5563;
}
.verif-email {
  color: #1d6fd4;
  word-break: break-all;
}
.verif-catatan {
  margin: 0.4rem 0 0;
  font-size: 0.74rem;
  color: #9ca3af;
}
.verif-tombol {
  margin-top: 0.6rem;
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border-radius: 999px;
  background: #2E87F6;
  color: #fff;
  font-size: 0.88rem;
  font-weight: 700;
  text-decoration: none;
  box-shadow: 0 8px 20px rgba(46, 135, 246, 0.3);
}
.verif-tombol:hover {
  background: #1d6fd4;
}

@media (prefers-reduced-motion: reduce) {
  .spinner {
    animation-duration: 2s;
  }
}

/* =====================================================
   BREAKPOINTS
   @media 641px  : tablet
   @media 768px  : desktop
   @media 1024px : large desktop
   ===================================================== */
@media (min-width: 641px) {
  .verif-card {
    max-width: 460px;
    padding: 2.5rem 2.25rem;
    border-radius: 24px;
  }
  .verif-logo {
    height: 56px;
  }
  .verif-judul {
    font-size: 1.4rem;
  }
  .verif-teks {
    font-size: 0.92rem;
  }
}
@media (min-width: 768px) {
  .verif-card {
    max-width: 480px;
  }
}
@media (min-width: 1024px) {
  .verif-card {
    max-width: 500px;
    padding: 3rem 2.75rem;
  }
  .verif-judul {
    font-size: 1.5rem;
  }
}
</style>