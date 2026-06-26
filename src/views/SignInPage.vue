<!-- SignInPage.vue -->
<template>
  <div class="signin-page">

    <!-- ===== BACKGROUND DEKORASI BERGERAK (mobile/tablet) ===== -->
    <div class="bg-decoration">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      <div class="blob blob-3"></div>
      <div class="blob blob-4"></div>
    </div>

    <!-- ===== WRAPPER UTAMA ===== -->
    <div class="signin-wrapper">

      <!-- ===== SISI KIRI (Desktop only) ===== -->
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
          <h2 class="side-title">Bergabung Jadi Tentor</h2>
          <p class="side-desc">
            Wujudkan dampak nyata bagi pendidikan anak bangsa bersama Bimbel Raya.
          </p>
        </div>
      </div>

      <!-- ===== FORM CARD ===== -->
      <div class="form-card">
        <img src="/assets/logobimbel.png" alt="Logo Bimbel Raya" class="form-logo" />

        <h1 class="form-title">Daftar Sebagai Tentor</h1>
        <p class="form-subtitle">Lengkapi data berikut untuk bergabung</p>

        <form @submit.prevent="handleSubmit" class="form-body" novalidate>

          <!-- Nama Tentor -->
          <div class="field-group">
            <label class="field-label">Nama Tentor</label>
            <input
              type="text"
              class="field-input"
              :class="{ 'is-error': touched.nama && nameError }"
              v-model="form.nama"
              @input="onNameInput"
              @focus="touched.nama = true"
              @blur="touched.nama = true"
              placeholder="Contoh: Andi Pratama"
            />
            <p v-if="touched.nama && nameError" class="field-alert">{{ nameError }}</p>
          </div>

          <!-- Nomor WA -->
          <div class="field-group">
            <label class="field-label">Nomor WhatsApp</label>
            <div class="phone-input-wrap" :class="{ 'is-error': touched.wa && waError }">
              <span class="phone-prefix">+62</span>
              <input
                type="text"
                class="field-input phone-input"
                v-model="waNumber"
                @input="onWaInput"
                @focus="touched.wa = true"
                @blur="touched.wa = true"
                placeholder="81234567890"
                inputmode="numeric"
              />
            </div>
            <p v-if="touched.wa && waError" class="field-alert">{{ waError }}</p>
          </div>

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
                placeholder="Minimal 6 karakter"
              />
              <button type="button" class="toggle-eye" @click="showPassword = !showPassword">
                {{ showPassword ? '🙈' : '👁️' }}
              </button>
            </div>
            <p v-if="touched.password && passwordError" class="field-alert">{{ passwordError }}</p>
          </div>

          <!-- Konfirmasi Password -->
          <div class="field-group">
            <label class="field-label">Konfirmasi Password</label>
            <div class="password-wrap">
              <input
                :type="showConfirm ? 'text' : 'password'"
                class="field-input"
                :class="{ 'is-error': touched.confirm && confirmError }"
                v-model="form.confirmPassword"
                @focus="touched.confirm = true"
                @blur="touched.confirm = true"
                placeholder="Ulangi password"
              />
              <button type="button" class="toggle-eye" @click="showConfirm = !showConfirm">
                {{ showConfirm ? '🙈' : '👁️' }}
              </button>
            </div>
            <p v-if="touched.confirm && confirmError" class="field-alert">{{ confirmError }}</p>
          </div>

          <!-- Kode Tentor -->
          <div class="field-group">
            <label class="field-label">Kode Tentor</label>
            <input
              type="text"
              class="field-input code-input"
              :class="{ 'is-error': touched.kode && kodeError, 'is-valid': touched.kode && kodeValidState }"
              v-model="form.kodeTentor"
              @input="onKodeInput"
              @focus="touched.kode = true"
              @blur="touched.kode = true"
              placeholder="4 digit kode dari admin"
              maxlength="4"
              inputmode="numeric"
            />
            <p v-if="touched.kode && kodeError" class="field-alert">{{ kodeError }}</p>
            <p v-if="touched.kode && kodeValidState" class="field-alert field-success">
              ✓ Kode terverifikasi, kode ini akan ditautkan ke data kamu
            </p>
          </div>

          <!-- Tombol Daftar -->
          <button type="submit" class="btn-submit" :disabled="!isFormValid">
            Daftar Tentor
          </button>

          <p class="login-redirect">
            Sudah punya akun?
            <router-link to="/login" class="login-link">Masuk ke sini</router-link>
          </p>

        </form>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// ============================================
// DUMMY DATA — kode tentor valid dari "admin"
// Nanti diganti dengan API call ke backend:
// const res = await fetch(`/api/tentor/verify-kode/${kode}`)
// ============================================
const dummyKodeTentorDariAdmin = ['1001', '1002', '1003', '2024', '8888']

const router = useRouter()
const authStore = useAuthStore()

// ===== STATE FORM =====
const form = reactive({
  nama: '',
  email: '',
  password: '',
  confirmPassword: '',
  kodeTentor: ''
})

const waNumber = ref('') // nomor WA tanpa prefix +62
const showPassword = ref(false)
const showConfirm = ref(false)

// Lacak field mana saja yang sudah pernah disentuh (untuk tampil/hilang alert)
const touched = reactive({
  nama: false,
  wa: false,
  email: false,
  password: false,
  confirm: false,
  kode: false
})

// ===== INPUT HANDLER: NAMA (hanya huruf & spasi) =====
const onNameInput = () => {
  // Hapus karakter selain huruf dan spasi secara realtime
  form.nama = form.nama.replace(/[^a-zA-Z\s]/g, '')
}

// ===== INPUT HANDLER: NOMOR WA (hanya angka) =====
const onWaInput = () => {
  waNumber.value = waNumber.value.replace(/[^0-9]/g, '')
}

// ===== INPUT HANDLER: KODE TENTOR (hanya angka, max 4) =====
const onKodeInput = () => {
  form.kodeTentor = form.kodeTentor.replace(/[^0-9]/g, '').slice(0, 4)
}

// ===== VALIDASI: NAMA =====
const nameError = computed(() => {
  if (!form.nama) return 'Nama tentor wajib diisi'
  if (form.nama.trim().length < 3) return 'Nama minimal 3 karakter'
  return ''
})

// ===== VALIDASI: NOMOR WA =====
const waError = computed(() => {
  if (!waNumber.value) return 'Nomor WhatsApp wajib diisi'
  if (waNumber.value.length < 9) return 'Nomor WhatsApp terlalu pendek'
  if (waNumber.value.length > 13) return 'Nomor WhatsApp terlalu panjang'
  if (waNumber.value.startsWith('0')) return 'Tanpa angka 0 di depan, karena sudah ada +62'
  return ''
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
  const pw = form.password
  if (!pw) return 'Password wajib diisi'
  if (pw.length < 6) return 'Password minimal 6 karakter'
  if (!/[A-Z]/.test(pw)) return 'Password harus mengandung huruf kapital'
  if (!/[a-z]/.test(pw)) return 'Password harus mengandung huruf kecil'
  if (!/[0-9]/.test(pw)) return 'Password harus mengandung angka'
  return ''
})

// ===== VALIDASI: KONFIRMASI PASSWORD (realtime cek kecocokan) =====
const confirmError = computed(() => {
  if (!form.confirmPassword) return 'Konfirmasi password wajib diisi'
  if (form.confirmPassword !== form.password) return 'Password tidak sama'
  return ''
})

// ===== VALIDASI: KODE TENTOR (cek ke dummy data admin) =====
const kodeError = computed(() => {
  if (!form.kodeTentor) return 'Kode tentor wajib diisi'
  if (form.kodeTentor.length < 4) return 'Kode tentor harus 4 digit'
  if (!dummyKodeTentorDariAdmin.includes(form.kodeTentor)) {
    return 'Kode tentor tidak ditemukan, hubungi admin untuk mendapat kode'
  }
  return ''
})

// State sukses verifikasi kode (dipisah dari error agar bisa tampil pesan hijau)
const kodeValidState = computed(() => {
  return form.kodeTentor.length === 4 && !kodeError.value
})

// ===== VALIDASI KESELURUHAN FORM =====
const isFormValid = computed(() => {
  return (
    !nameError.value &&
    !waError.value &&
    !emailError.value &&
    !passwordError.value &&
    !confirmError.value &&
    !kodeError.value
  )
})

// ===== SUBMIT =====
const handleSubmit = () => {
  // Tandai semua field sudah disentuh agar semua error tampil jika ada yang terlewat
  Object.keys(touched).forEach((key) => (touched[key] = true))

  if (!isFormValid.value) return

  const payload = {
    nama: form.nama.trim(),
    noWA: `+62${waNumber.value}`,
    email: form.email,
    password: form.password,
    kodeTentor: form.kodeTentor
  }

  // ============================================
  // Nanti diganti dengan API call sungguhan:
  // await fetch('/api/auth/register-tentor', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(payload)
  // })
  // ============================================
  console.log('Data pendaftaran tentor:', payload)
  authStore.login({ role: 'tentor', kodeTentor: form.kodeTentor })
  router.push(`/tentor/dashboardtentor/${form.kodeTentor}`)
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

* {
  font-family: 'DM Sans', sans-serif;
  box-sizing: border-box;
}

.signin-page {
  position: relative;
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  overflow: hidden;
  background: linear-gradient(135deg, #fff8ec 0%, #fdf1de 50%, #fbe9d0 100%);
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
  width: 380px;
  height: 380px;
  background: #F35C2B;
  top: -100px;
  left: -100px;
  animation: floatBlob1 14s ease-in-out infinite;
}
.blob-2 {
  width: 300px;
  height: 300px;
  background: #F9ECCC;
  bottom: -80px;
  right: -60px;
  animation: floatBlob2 16s ease-in-out infinite;
}
.blob-3 {
  width: 220px;
  height: 220px;
  background: #2E87F6;
  top: 40%;
  right: 8%;
  opacity: 0.25;
  animation: floatBlob3 12s ease-in-out infinite;
}
.blob-4 {
  width: 260px;
  height: 260px;
  background: #F35C2B;
  bottom: 10%;
  left: 5%;
  opacity: 0.3;
  animation: floatBlob1 18s ease-in-out infinite reverse;
}

@keyframes floatBlob1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(40px, 30px) scale(1.1); }
  66% { transform: translate(-20px, 50px) scale(0.95); }
}
@keyframes floatBlob2 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-50px, -30px) scale(1.15); }
}
@keyframes floatBlob3 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(30px, -40px) scale(1.2); }
}

/* ===== WRAPPER ===== */
.signin-wrapper {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 460px;
  display: flex;
}

/* ===== SIDE PANEL (Desktop only, hidden default) ===== */
.side-panel {
  display: none;
}

/* ===== FORM CARD ===== */
.form-card {
  width: 100%;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 2.5rem 2rem;
  box-shadow: 0 20px 60px rgba(243, 92, 43, 0.12), 0 4px 16px rgba(0,0,0,0.04);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form-logo {
  height: 56px;
  width: auto;
  margin-bottom: 1.25rem;
}

.form-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #1f2937;
  text-align: center;
  margin-bottom: 0.25rem;
}
.form-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  text-align: center;
  margin-bottom: 1.75rem;
}

.form-body {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

/* ===== FIELD GROUP ===== */
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
  border-color: #2E87F6;
  box-shadow: 0 0 0 3px rgba(46, 135, 246, 0.12);
}
.field-input.is-error {
  border-color: #F35C2B;
}
.field-input.is-error:focus {
  box-shadow: 0 0 0 3px rgba(243, 92, 43, 0.12);
}
.field-input.is-valid {
  border-color: #16a34a;
}

.field-alert {
  font-size: 0.74rem;
  color: #F35C2B;
  margin-top: 0.35rem;
  line-height: 1.3;
}
.field-alert.field-success {
  color: #16a34a;
}

/* ===== PHONE INPUT ===== */
.phone-input-wrap {
  display: flex;
  align-items: stretch;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  overflow: hidden;
  transition: border-color 0.2s, box-shadow 0.2s;
  background: #fff;
}
.phone-input-wrap:focus-within {
  border-color: #2E87F6;
  box-shadow: 0 0 0 3px rgba(46, 135, 246, 0.12);
}
.phone-input-wrap.is-error {
  border-color: #F35C2B;
}
.phone-prefix {
  display: flex;
  align-items: center;
  padding: 0 0.75rem;
  background: #f3f4f6;
  color: #374151;
  font-weight: 600;
  font-size: 0.9rem;
  border-right: 1.5px solid #e5e7eb;
  user-select: none;
}
.phone-input {
  border: none;
  border-radius: 0;
  flex: 1;
}
.phone-input:focus {
  box-shadow: none;
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

.code-input {
  letter-spacing: 0.3em;
  font-weight: 700;
  text-align: center;
}

/* ===== SUBMIT BUTTON ===== */
.btn-submit {
  width: 100%;
  padding: 0.85rem;
  border-radius: 12px;
  border: none;
  background: #2E87F6;
  color: #fff;
  font-weight: 700;
  font-size: 0.95rem;
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
  font-size: 0.8rem;
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

/* ============================================
   DESKTOP — form jadi persegi panjang dengan
   panel kiri (logo + dekorasi) dan kanan (form)
   ============================================ */
@media (min-width: 1024px) {
  .signin-wrapper {
    max-width: 920px;
    border-radius: 28px;
    overflow: hidden;
    box-shadow: 0 30px 80px rgba(243, 92, 43, 0.15), 0 8px 24px rgba(0,0,0,0.06);
  }

  .side-panel {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 42%;
    background: linear-gradient(160deg, #2E87F6 0%, #1d5fc4 60%, #16429e 100%);
    overflow: hidden;
    padding: 3rem 2rem;
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
    width: 260px;
    height: 260px;
    background: #F35C2B;
    top: -60px;
    left: -60px;
    animation: floatBlob1 13s ease-in-out infinite;
  }
  .side-blob-2 {
    width: 220px;
    height: 220px;
    background: #F9ECCC;
    bottom: -60px;
    right: -50px;
    opacity: 0.4;
    animation: floatBlob2 15s ease-in-out infinite;
  }
  .side-blob-3 {
    width: 160px;
    height: 160px;
    background: #F9ECCC;
    top: 55%;
    left: 60%;
    opacity: 0.25;
    animation: floatBlob3 11s ease-in-out infinite;
  }
  .floating-ring {
    position: absolute;
    border: 2px solid rgba(249, 236, 204, 0.4);
    border-radius: 50%;
  }
  .ring-1 {
  width: 140px;
  height: 140px;
  top: 15%;
  right: 10%;
  animation: floatRing1 9s ease-in-out infinite;
}
.ring-2 {
  width: 90px;
  height: 90px;
  bottom: 18%;
  left: 12%;
  border-color: rgba(243, 92, 43, 0.5);
  animation: floatRing2 11s ease-in-out infinite;
}
@keyframes floatRing1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(-20px, 25px) scale(1.1); }
  66% { transform: translate(15px, -15px) scale(0.95); }
}
@keyframes floatRing2 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(20px, -20px) scale(1.15); }
}

  .side-content {
    position: relative;
    z-index: 1;
    text-align: center;
  }
  .side-logo {
    height: 64px;
    width: auto;
    margin-bottom: 1.5rem;
    filter: brightness(0) invert(1);
  }
  .side-title {
    color: #fff;
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.75rem;
  }
  .side-desc {
    color: #dce8fc;
    font-size: 0.9rem;
    line-height: 1.6;
    max-width: 260px;
    margin: 0 auto;
  }

  .form-card {
    width: 58%;
    border-radius: 0;
    box-shadow: none;
    padding: 3rem 3rem;
    background: #ffffff;
  }
  .form-logo {
    display: none; /* Logo sudah ada di side panel */
  }
}
</style>