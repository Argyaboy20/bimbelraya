<!-- LoginAdmin.vue -->
<template>
  <div class="login-admin-page">

    <!-- ===== BACKGROUND DEKORASI (lebih gelap/formal dari LoginPage tentor) ===== -->
    <div class="bg-decoration">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      <div class="blob blob-3"></div>
    </div>

    <div class="login-wrapper">
      <div class="form-card">
        <img src="/assets/logobimbel.png" alt="Logo Bimbel Raya" class="form-logo" />

        <h1 class="form-title">Portal Admin</h1>
        <p class="form-subtitle">Akses khusus untuk administrator Bimbel Raya</p>

        <!-- ===== PERINGATAN AKUN TERKUNCI ===== -->
        <div v-if="isLocked" class="lockout-warning">
          🔒 Terlalu banyak percobaan gagal. Coba lagi dalam
          <strong>{{ lockoutCountdown }}</strong> detik.
        </div>

        <form @submit.prevent="handleSubmit" class="form-body" novalidate>

          <!-- Email -->
          <div class="field-group">
            <label class="field-label">Email Admin</label>
            <input
              type="text"
              class="field-input"
              :class="{ 'is-error': touched.email && emailError }"
              v-model="form.email"
              @focus="touched.email = true"
              @blur="touched.email = true"
              :disabled="isLocked"
              placeholder="masukkan email"
              autocomplete="off"
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
                :disabled="isLocked"
                placeholder="Masukkan password"
                autocomplete="off"
              />
              <button type="button" class="toggle-eye" @click="showPassword = !showPassword" :disabled="isLocked">
                {{ showPassword ? '🙈' : '👁️' }}
              </button>
            </div>
            <p v-if="touched.password && passwordError" class="field-alert">{{ passwordError }}</p>
          </div>

          <!-- Kode Akses Admin (lapis ke-2) -->
          <div class="field-group">
            <label class="field-label">Kode Akses Admin</label>
            <input
              type="text"
              class="field-input code-input"
              :class="{ 'is-error': touched.kode && kodeError }"
              v-model="form.kodeAkses"
              @input="onKodeInput"
              @focus="touched.kode = true"
              @blur="touched.kode = true"
              :disabled="isLocked"
              placeholder="Kode akses 6 digit"
              maxlength="6"
              inputmode="numeric"
              autocomplete="off"
            />
            <p v-if="touched.kode && kodeError" class="field-alert">{{ kodeError }}</p>
            <p class="field-hint">Kode akses didapat dari sistem internal, bukan dari email biasa</p>
          </div>

          <!-- Pesan error gagal login (dari percobaan sebelumnya) -->
          <p v-if="loginError" class="login-error-alert">{{ loginError }}</p>

          <!-- Tombol Masuk -->
          <button type="submit" class="btn-submit" :disabled="!isFormValid || isLocked || isSubmitting">
            {{ isSubmitting ? 'Memverifikasi...' : 'Masuk sebagai Admin' }}
          </button>

          <p class="back-link">
            <router-link to="/login" class="link-text">← Kembali ke login tentor</router-link>
          </p>

        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// ============================================
// DUMMY DATA — nanti diganti pemanggilan API backend.
// Backend yang akan verifikasi email + password + kode akses
// sekaligus, BUKAN dicek satu-satu di frontend (agar tidak
// gampang dibaca orang lewat DevTools / Network tab)
// ============================================
const dummyAdminCredential = {
  email: 'bimbelrayaid@gmail.com',
  password: 'RayakanPrestasi26',
  kodeAkses: '260824'
}

// ===== STATE FORM =====
const form = reactive({
  email: '',
  password: '',
  kodeAkses: ''
})

const showPassword = ref(false)
const isSubmitting = ref(false)
const loginError = ref('')

const touched = reactive({
  email: false,
  password: false,
  kode: false
})

// ===== INPUT HANDLER: Kode Akses (hanya angka, max 6) =====
const onKodeInput = () => {
  form.kodeAkses = form.kodeAkses.replace(/[^0-9]/g, '').slice(0, 6)
}

// ===== VALIDASI FORMAT (bukan validasi isi — itu tugas backend) =====
const emailError = computed(() => {
  if (!form.email) return 'Email wajib diisi'
  const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/
  if (!emailRegex.test(form.email)) return 'Format email tidak valid'
  return ''
})

const passwordError = computed(() => {
  if (!form.password) return 'Password wajib diisi'
  if (form.password.length < 6) return 'Password minimal 6 karakter'
  return ''
})

const kodeError = computed(() => {
  if (!form.kodeAkses) return 'Kode akses wajib diisi'
  if (form.kodeAkses.length < 6) return 'Kode akses harus 6 digit'
  return ''
})

const isFormValid = computed(() => {
  return !emailError.value && !passwordError.value && !kodeError.value
})

// ============================================
// PROTEKSI BRUTE FORCE — rate limiting sisi frontend.
// Catatan penting: ini HANYA lapisan tambahan di sisi
// tampilan. Proteksi sesungguhnya WAJIB ada juga di backend
// (rate limiting per-IP, captcha, log percobaan), karena
// validasi di frontend selalu bisa dilewati orang yang
// langsung memanggil API tanpa lewat form ini.
// ============================================
const MAX_ATTEMPTS = 5
const LOCKOUT_DURATION = 60 // detik

const failedAttempts = ref(0)
const isLocked = ref(false)
const lockoutCountdown = ref(0)
let countdownTimer = null

const loadAttemptState = () => {
  const saved = localStorage.getItem('adminLoginAttempt')
  if (!saved) return

  const data = JSON.parse(saved)
  const now = Date.now()

  if (data.lockedUntil && now < data.lockedUntil) {
    isLocked.value = true
    startCountdown(Math.ceil((data.lockedUntil - now) / 1000))
  } else if (data.lockedUntil && now >= data.lockedUntil) {
    localStorage.removeItem('adminLoginAttempt')
    failedAttempts.value = 0
  } else {
    failedAttempts.value = data.count || 0
  }
}

const saveAttemptState = (lockedUntil = null) => {
  localStorage.setItem('adminLoginAttempt', JSON.stringify({
    count: failedAttempts.value,
    lockedUntil
  }))
}

const startCountdown = (seconds) => {
  lockoutCountdown.value = seconds
  countdownTimer = setInterval(() => {
    lockoutCountdown.value -= 1
    if (lockoutCountdown.value <= 0) {
      clearInterval(countdownTimer)
      isLocked.value = false
      failedAttempts.value = 0
      localStorage.removeItem('adminLoginAttempt')
    }
  }, 1000)
}

const registerFailedAttempt = () => {
  failedAttempts.value += 1

  if (failedAttempts.value >= MAX_ATTEMPTS) {
    isLocked.value = true
    const lockedUntil = Date.now() + LOCKOUT_DURATION * 1000
    saveAttemptState(lockedUntil)
    startCountdown(LOCKOUT_DURATION)
    loginError.value = `Terlalu banyak percobaan gagal. Akun dikunci sementara.`
  } else {
    saveAttemptState()
    const sisaPercobaan = MAX_ATTEMPTS - failedAttempts.value
    loginError.value = `Email, password, atau kode akses salah. Sisa percobaan: ${sisaPercobaan}`
  }
}

onMounted(() => {
  loadAttemptState()
})
onUnmounted(() => {
  if (countdownTimer) clearInterval(countdownTimer)
})

// ===== SUBMIT =====
const handleSubmit = async () => {
  touched.email = true
  touched.password = true
  touched.kode = true
  loginError.value = ''

  if (!isFormValid.value || isLocked.value) return

  isSubmitting.value = true

  // Simulasi delay verifikasi (nanti diganti fetch ke backend)
  await new Promise((r) => setTimeout(r, 700))

  // ============================================
  // Nanti diganti dengan API call sungguhan, contoh:
  //
  // const res = await fetch('/api/auth/login-admin', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({
  //     email: form.email,
  //     password: form.password,
  //     kodeAkses: form.kodeAkses
  //   })
  // })
  // if (!res.ok) { registerFailedAttempt(); isSubmitting.value = false; return }
  // const data = await res.json()
  // authStore.login({ role: 'admin', ...data })
  // ============================================

  const isMatch =
    form.email === dummyAdminCredential.email &&
    form.password === dummyAdminCredential.password &&
    form.kodeAkses === dummyAdminCredential.kodeAkses

  if (!isMatch) {
    registerFailedAttempt()
    isSubmitting.value = false
    return
  }

  // Login berhasil → reset percobaan gagal
  failedAttempts.value = 0
  localStorage.removeItem('adminLoginAttempt')

  authStore.login({ role: 'admin', email: form.email })
  router.push('/admin/dashboard')
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

* {
  font-family: 'DM Sans', sans-serif;
  box-sizing: border-box;
}

.login-admin-page {
  position: relative;
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  overflow: hidden;
  background: linear-gradient(135deg, #1a2332 0%, #0f1722 50%, #1a2332 100%);
}

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
  filter: blur(70px);
  opacity: 0.25;
}
.blob-1 {
  width: 360px;
  height: 360px;
  background: #2E87F6;
  top: -100px;
  left: -80px;
  animation: floatBlob1 16s ease-in-out infinite;
}
.blob-2 {
  width: 280px;
  height: 280px;
  background: #F35C2B;
  bottom: -80px;
  right: -60px;
  animation: floatBlob2 18s ease-in-out infinite;
}
.blob-3 {
  width: 200px;
  height: 200px;
  background: #2E87F6;
  top: 45%;
  right: 10%;
  opacity: 0.15;
  animation: floatBlob3 14s ease-in-out infinite;
}
@keyframes floatBlob1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(40px, 30px) scale(1.1); }
}
@keyframes floatBlob2 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-40px, -30px) scale(1.1); }
}
@keyframes floatBlob3 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(20px, -30px) scale(1.15); }
}

.login-wrapper {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 420px;
}

.form-card {
  background: rgba(255, 255, 255, 0.97);
  border-radius: 20px;
  padding: 2.5rem 2rem;
  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.35);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form-logo {
  height: 52px;
  width: auto;
  margin-bottom: 1.25rem;
}

.form-title {
  font-size: 1.35rem;
  font-weight: 700;
  color: #1a2332;
  text-align: center;
  margin-bottom: 0.25rem;
}
.form-subtitle {
  font-size: 0.8rem;
  color: #6b7280;
  text-align: center;
  margin-bottom: 1.5rem;
}

.lockout-warning {
  width: 100%;
  background: #fef2f2;
  border: 1.5px solid #fca5a5;
  color: #b91c1c;
  font-size: 0.82rem;
  padding: 0.7rem 0.9rem;
  border-radius: 10px;
  margin-bottom: 1.25rem;
  text-align: center;
}

.form-body {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.field-group {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.field-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.4rem;
}
.field-input {
  width: 100%;
  padding: 0.7rem 0.9rem;
  border-radius: 10px;
  border: 1.5px solid #e5e7eb;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  background: #fff;
}
.field-input:focus {
  border-color: #1a2332;
  box-shadow: 0 0 0 3px rgba(26, 35, 50, 0.1);
}
.field-input.is-error {
  border-color: #F35C2B;
}
.field-input:disabled {
  background: #f3f4f6;
  cursor: not-allowed;
}

.field-alert {
  font-size: 0.74rem;
  color: #F35C2B;
  margin-top: 0.35rem;
  line-height: 1.3;
}
.field-hint {
  font-size: 0.7rem;
  color: #9ca3af;
  margin-top: 0.35rem;
  font-style: italic;
}

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

.code-input {
  letter-spacing: 0.3em;
  font-weight: 700;
  text-align: center;
}

.login-error-alert {
  background: #fef2f2;
  border: 1px solid #fca5a5;
  color: #b91c1c;
  font-size: 0.8rem;
  padding: 0.6rem 0.8rem;
  border-radius: 8px;
  text-align: center;
}

.btn-submit {
  width: 100%;
  padding: 0.85rem;
  border-radius: 12px;
  border: none;
  background: #1a2332;
  color: #fff;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  margin-top: 0.25rem;
  transition: transform 0.2s, opacity 0.2s, box-shadow 0.2s;
  box-shadow: 0 8px 20px rgba(26, 35, 50, 0.3);
}
.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(26, 35, 50, 0.4);
}
.btn-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
}

.back-link {
  text-align: center;
  margin-top: 0.75rem;
}
.link-text {
  font-size: 0.78rem;
  color: #6b7280;
  text-decoration: none;
}
.link-text:hover {
  text-decoration: underline;
}
</style>