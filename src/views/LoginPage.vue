<!-- LoginPage.vue -->
<template>
  <div class="login-page">

    <!-- ===== BACKGROUND DEKORASI BERGERAK (mobile/tablet) ===== -->
    <div class="bg-decoration">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      <div class="blob blob-3"></div>
      <div class="blob blob-4"></div>
    </div>

    <!-- ===== WRAPPER UTAMA ===== -->
    <div class="login-wrapper">

      <!-- ===== FORM CARD (kiri di desktop) ===== -->
      <div class="form-card">
        <img src="/assets/logobimbel.png" alt="Logo Bimbel Raya" class="form-logo" />

        <h1 class="form-title">Masuk Akun</h1>
        <p class="form-subtitle">Masuk untuk melanjutkan ke akun kamu</p>

        <form @submit.prevent="handleSubmit" class="form-body" novalidate>

          <!-- Email -->
          <div class="field-group">
            <label class="field-label">Email</label>
            <input
              type="text"
              class="field-input"
              :class="{ 'is-error': touched.email && emailError }"
              v-model="form.email"
              @focus="touched.email = true"
              @blur="touched.email = true"
              placeholder="nama@email.com"
            />
            <p v-if="touched.email && emailError" class="field-alert">{{ emailError }}</p>
          </div>

          <!-- Password -->
          <div class="field-group">
            <label class="field-label">Password</label>
            <div class="password-wrap">
              <input
                :type="showPassword ? 'text' : 'password'"
                class="field-input"
                :class="{ 'is-error': touched.password && passwordError }"
                v-model="form.password"
                @focus="touched.password = true"
                @blur="touched.password = true"
                placeholder="Masukkan password"
              />
              <button type="button" class="toggle-eye" @click="showPassword = !showPassword">
                {{ showPassword ? '🙈' : '👁️' }}
              </button>
            </div>
            <p v-if="touched.password && passwordError" class="field-alert">{{ passwordError }}</p>
          </div>

          <!-- Tombol Masuk -->
          <button type="submit" class="btn-submit" :disabled="!isFormValid">
            Masuk
          </button>

          <p class="login-redirect">
            Belum punya akun?
            <router-link to="/daftar" class="login-link">Daftar ke sini</router-link>
          </p>

        </form>
      </div>

      <!-- ===== SISI KANAN (Desktop only) ===== -->
      <div class="side-panel">
        <div class="side-decoration">
          <div class="blob side-blob-1"></div>
          <div class="blob side-blob-2"></div>
          <div class="blob side-blob-3"></div>
          <div class="floating-ring ring-1"></div>
          <div class="floating-ring ring-2"></div>
        </div>
        <div class="side-content">
          <img src="/assets/logobimbel.png" alt="Logo Bimbel Raya" class="side-logo" />
          <h2 class="side-title">Selamat Datang Kembali</h2>
          <p class="side-desc">
            Masuk untuk memantau aktivitas dan terus berkontribusi bersama Bimbel Raya.
          </p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// ===== STATE FORM =====
const form = reactive({
  email: '',
  password: ''
})

const showPassword = ref(false)

const router = useRouter()
const authStore = useAuthStore()

const dummyKodeTentor = '1001'

// Lacak field mana saja yang sudah pernah disentuh (untuk tampil/hilang alert)
const touched = reactive({
  email: false,
  password: false
})

// ===== VALIDASI: EMAIL =====
const emailError = computed(() => {
  if (!form.email) return 'Email wajib diisi'
  const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/
  if (!emailRegex.test(form.email)) return 'Format email tidak valid'
  return ''
})

// ===== VALIDASI: PASSWORD =====
const passwordError = computed(() => {
  if (!form.password) return 'Password wajib diisi'
  if (form.password.length < 6) return 'Password minimal 6 karakter'
  return ''
})

// ===== VALIDASI KESELURUHAN FORM =====
const isFormValid = computed(() => {
  return !emailError.value && !passwordError.value
})

// ===== SUBMIT =====
const handleSubmit = () => {
  touched.email = true
  touched.password = true

  if (!isFormValid.value) return

  const payload = {
    email: form.email,
    password: form.password
  }

  // ============================================
  // Nanti diganti dengan API call sungguhan:
  // await fetch('/api/auth/login', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(payload)
  // })
  // Lalu simpan token & role ke stores/auth.js, redirect sesuai role
  // ============================================
  console.log('Data login:', payload)
  authStore.login({ role: 'tentor', kodeTentor: dummyKodeTentor })
  router.push(`/tentor/dashboardtentor/${dummyKodeTentor}`)
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

* {
  font-family: 'DM Sans', sans-serif;
  box-sizing: border-box;
}

.login-page {
  position: relative;
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  overflow: hidden;
  background: linear-gradient(135deg, #fdf3e7 0%, #fbe7d6 45%, #fde8d8 100%);
}

/* ===== BACKGROUND BLOB DECORATION ===== */
.bg-decoration {
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: 0;
  pointer-events: none;
}
.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.55;
}
.blob-1 {
  width: 280px;
  height: 280px;
  background: #2E87F6;
  top: -80px;
  right: -80px;
  animation: floatBlob1 15s ease-in-out infinite;
}
.blob-2 {
  width: 240px;
  height: 240px;
  background: #F9ECCC;
  bottom: -60px;
  left: -50px;
  animation: floatBlob2 17s ease-in-out infinite;
}
.blob-3 {
  width: 180px;
  height: 180px;
  background: #F35C2B;
  top: 38%;
  left: 8%;
  opacity: 0.22;
  animation: floatBlob3 13s ease-in-out infinite;
}
.blob-4 {
  width: 200px;
  height: 200px;
  background: #2E87F6;
  bottom: 8%;
  right: 6%;
  opacity: 0.25;
  animation: floatBlob1 19s ease-in-out infinite reverse;
}

@keyframes floatBlob1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(-40px, 30px) scale(1.1); }
  66% { transform: translate(20px, 50px) scale(0.95); }
}
@keyframes floatBlob2 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(50px, -30px) scale(1.15); }
}
@keyframes floatBlob3 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-30px, -40px) scale(1.2); }
}
@keyframes floatRing1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(20px, -25px) scale(1.1); }
  66% { transform: translate(-15px, 15px) scale(0.95); }
}
@keyframes floatRing2 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-20px, 20px) scale(1.15); }
}

/* ===== WRAPPER ===== */
.login-wrapper {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 420px;
  display: flex;
}

/* ===== SIDE PANEL (muncul mulai desktop) ===== */
.side-panel {
  display: none;
}

/* ===== FORM CARD ===== */
.form-card {
  width: 100%;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(10px);
  border-radius: 22px;
  padding: 2.25rem 1.5rem;
  box-shadow: 0 20px 60px rgba(46, 135, 246, 0.12), 0 4px 16px rgba(0,0,0,0.04);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form-logo {
  height: 48px;
  width: auto;
  margin-bottom: 1.1rem;
}

.form-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  text-align: center;
  margin-bottom: 0.25rem;
}
.form-subtitle {
  font-size: 0.82rem;
  color: #6b7280;
  text-align: center;
  margin-bottom: 1.5rem;
}

.form-body {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* ===== FIELD GROUP ===== */
.field-group {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.field-label {
  font-size: 0.78rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.4rem;
}
.field-input {
  width: 100%;
  padding: 0.65rem 0.85rem;
  border-radius: 10px;
  border: 1.5px solid #e5e7eb;
  font-size: 0.88rem;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  background: #fff;
}
.field-input:focus {
  border-color: #2E87F6;
  box-shadow: 0 0 0 3px rgba(46, 135, 246, 0.12);
}
.field-input.is-error {
  border-color: #F35C2B;
}
.field-input.is-error:focus {
  box-shadow: 0 0 0 3px rgba(243, 92, 43, 0.12);
}

.field-alert {
  font-size: 0.72rem;
  color: #F35C2B;
  margin-top: 0.35rem;
  line-height: 1.3;
}

/* ===== PASSWORD INPUT ===== */
.password-wrap {
  position: relative;
  display: flex;
  align-items: center;
}
.password-wrap .field-input {
  padding-right: 2.5rem;
}
.toggle-eye {
  position: absolute;
  right: 0.6rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.2rem;
  line-height: 1;
}

/* ===== SUBMIT BUTTON ===== */
.btn-submit {
  width: 100%;
  padding: 0.8rem;
  border-radius: 12px;
  border: none;
  background: #2E87F6;
  color: #fff;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: transform 0.2s, opacity 0.2s, box-shadow 0.2s;
  box-shadow: 0 8px 20px rgba(46, 135, 246, 0.3);
}
.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(46, 135, 246, 0.4);
}
.btn-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
}

.login-redirect {
  text-align: center;
  font-size: 0.78rem;
  color: #6b7280;
  margin-top: 0.75rem;
}
.login-link {
  color: #2E87F6;
  font-weight: 600;
  text-decoration: none;
  margin-left: 0.25rem;
}
.login-link:hover {
  text-decoration: underline;
}

/* =====================================================
   @media 641px  : tablet
   @media 768px  : desktop
   @media 1024px : large desktop
   ===================================================== */

/* ===== TABLET (≥ 641px) ===== */
@media (min-width: 641px) {

  .login-page {
    padding: 2.5rem 1.5rem;
  }

  .blob-1 { width: 320px; height: 320px; }
  .blob-2 { width: 270px; height: 270px; }
  .blob-3 { width: 200px; height: 200px; }
  .blob-4 { width: 230px; height: 230px; }

  .login-wrapper {
    max-width: 480px;
  }

  .form-card {
    border-radius: 24px;
    padding: 2.75rem 2.25rem;
  }
  .form-logo {
    height: 56px;
    margin-bottom: 1.25rem;
  }
  .form-title {
    font-size: 1.4rem;
  }
  .form-subtitle {
    font-size: 0.88rem;
    margin-bottom: 1.75rem;
  }
  .form-body {
    gap: 1.1rem;
  }

  .field-label {
    font-size: 0.8rem;
  }
  .field-input {
    padding: 0.75rem 0.9rem;
    font-size: 0.92rem;
  }
  .field-alert {
    font-size: 0.74rem;
  }

  .btn-submit {
    padding: 0.85rem;
    font-size: 0.95rem;
  }
  .login-redirect {
    font-size: 0.8rem;
  }
}

/* ===== DESKTOP (≥ 768px) — layout 2 kolom mulai aktif ===== */
@media (min-width: 768px) {

  .login-page {
    padding: 3rem 2rem;
  }

  .login-wrapper {
    max-width: 760px;
    border-radius: 26px;
    overflow: hidden;
    box-shadow: 0 28px 70px rgba(46, 135, 246, 0.14), 0 6px 20px rgba(0,0,0,0.05);
  }

  /* Form di kiri */
  .form-card {
    order: 1;
    width: 56%;
    border-radius: 0;
    box-shadow: none;
    padding: 2.75rem 2.5rem;
    background: #ffffff;
  }
  .form-logo {
    display: none; /* logo sudah ada di side panel */
  }
  .form-title {
    font-size: 1.45rem;
    text-align: left;
  }
  .form-subtitle {
    text-align: left;
    margin-bottom: 1.75rem;
  }

  /* Panel dekorasi di kanan */
  .side-panel {
    order: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 44%;
    background: linear-gradient(200deg, #F35C2B 0%, #d6441a 60%, #a8330f 100%);
    overflow: hidden;
    padding: 2.5rem 1.5rem;
  }

  .side-decoration {
    position: absolute;
    inset: 0;
    overflow: hidden;
  }
  .side-decoration .blob {
    opacity: 0.5;
  }
  .side-blob-1 {
    width: 200px;
    height: 200px;
    background: #2E87F6;
    top: -50px;
    right: -50px;
    animation: floatBlob1 14s ease-in-out infinite;
  }
  .side-blob-2 {
    width: 170px;
    height: 170px;
    background: #F9ECCC;
    bottom: -50px;
    left: -40px;
    opacity: 0.4;
    animation: floatBlob2 16s ease-in-out infinite;
  }
  .side-blob-3 {
    width: 120px;
    height: 120px;
    background: #F9ECCC;
    top: 55%;
    right: 58%;
    opacity: 0.25;
    animation: floatBlob3 12s ease-in-out infinite;
  }
  .floating-ring {
    position: absolute;
    border: 2px solid rgba(249, 236, 204, 0.4);
    border-radius: 50%;
  }
  .ring-1 {
    width: 110px;
    height: 110px;
    top: 18%;
    left: 10%;
    animation: floatRing1 10s ease-in-out infinite;
  }
  .ring-2 {
    width: 70px;
    height: 70px;
    bottom: 15%;
    right: 12%;
    border-color: rgba(46, 135, 246, 0.5);
    animation: floatRing2 12s ease-in-out infinite;
  }

  .side-content {
    position: relative;
    z-index: 1;
    text-align: center;
  }
  .side-logo {
    height: 52px;
    width: auto;
    margin-bottom: 1.25rem;
    filter: brightness(0) invert(1);
  }
  .side-title {
    color: #fff;
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 0.65rem;
  }
  .side-desc {
    color: #fde3d4;
    font-size: 0.85rem;
    line-height: 1.55;
    max-width: 210px;
    margin: 0 auto;
  }
}

/* ===== LARGE DESKTOP (≥ 1024px) ===== */
@media (min-width: 1024px) {

  .login-wrapper {
    max-width: 920px;
    box-shadow: 0 30px 80px rgba(46, 135, 246, 0.15), 0 8px 24px rgba(0,0,0,0.06);
  }

  .form-card {
    width: 58%;
    padding: 3rem 3rem;
  }
  .form-title {
    font-size: 1.5rem;
  }
  .form-subtitle {
    font-size: 0.9rem;
  }
  .field-input {
    padding: 0.7rem 0.9rem;
    font-size: 0.9rem;
  }
  .btn-submit {
    padding: 0.85rem;
    font-size: 0.95rem;
  }

  .side-panel {
    width: 42%;
    padding: 3rem 2rem;
  }
  .side-blob-1 {
    width: 260px;
    height: 260px;
    top: -60px;
    right: -60px;
  }
  .side-blob-2 {
    width: 220px;
    height: 220px;
    bottom: -60px;
    left: -50px;
  }
  .side-blob-3 {
    width: 160px;
    height: 160px;
    top: 55%;
    right: 60%;
  }
  .ring-1 {
    width: 140px;
    height: 140px;
  }
  .ring-2 {
    width: 90px;
    height: 90px;
  }
  .side-logo {
    height: 64px;
    margin-bottom: 1.5rem;
  }
  .side-title {
    font-size: 1.5rem;
    margin-bottom: 0.75rem;
  }
  .side-desc {
    font-size: 0.9rem;
    max-width: 260px;
  }
}
</style>