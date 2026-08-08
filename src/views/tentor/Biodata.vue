<!-- Biodata.vue -->
<template>
  <div class="biodata-page">
    <!-- ===== BACKGROUND DEKORASI (sama dengan DashboardTentor) ===== -->
    <div class="bg-dots"></div>
    <div class="bg-blob"></div>

    <!-- ===== KONTEN UTAMA ===== -->
    <div class="biodata-content">
      <!-- ===== AVATAR INISIAL ===== -->
      <div class="avatar-wrap">
        <div class="avatar-circle">
          <span class="avatar-initial">{{ inisialTentor }}</span>
        </div>
        <p class="avatar-label">Profil Tentor</p>
      </div>

      <!-- ===== FORM DATA ===== -->
      <div class="form-card">
        <!-- Nama Tentor -->
        <div class="field-group">
          <label class="field-label">Nama Tentor</label>
          <input
            type="text"
            class="field-input"
            :class="{ 'is-error': touched.nama && nameError, 'is-active': isEditing }"
            v-model="form.nama"
            :disabled="!isEditing"
            @input="onNameInput"
            @blur="touched.nama = true"
            placeholder="Nama lengkap tentor"
          />
          <p v-if="isEditing && touched.nama && nameError" class="field-alert">{{ nameError }}</p>
        </div>

        <!-- Nomor WhatsApp -->
        <div class="field-group">
          <label class="field-label">Nomor WhatsApp</label>
          <div
            class="phone-input-wrap"
            :class="{ 'is-error': isEditing && touched.wa && waError, 'is-active': isEditing }"
          >
            <span class="phone-prefix">+62</span>
            <input
              type="text"
              class="field-input phone-input"
              v-model="waNumber"
              :disabled="!isEditing"
              @input="onWaInput"
              @blur="touched.wa = true"
              placeholder="81234567890"
              inputmode="numeric"
            />
          </div>
          <p v-if="isEditing && touched.wa && waError" class="field-alert">{{ waError }}</p>
        </div>

        <!-- Email -->
        <div class="field-group">
          <label class="field-label">Email</label>
          <input
            type="text"
            class="field-input"
            :class="{
              'is-error': isEditing && touched.email && emailError,
              'is-active': isEditing,
            }"
            v-model="form.email"
            :disabled="!isEditing"
            @blur="touched.email = true"
            placeholder="nama@email.com"
          />
          <p v-if="isEditing && touched.email && emailError" class="field-alert">
            {{ emailError }}
          </p>
        </div>

        <!-- Password -->
        <div class="field-group">
          <label class="field-label">Password</label>
          <div class="password-wrap">
            <input
              :type="showPassword ? 'text' : 'password'"
              class="field-input"
              :class="{
                'is-error': isEditing && touched.password && passwordError,
                'is-active': isEditing,
              }"
              v-model="form.password"
              :disabled="!isEditing"
              @blur="touched.password = true"
              placeholder="Minimal 6 karakter"
            />
            <button
              v-if="isEditing"
              type="button"
              class="toggle-eye"
              @click="showPassword = !showPassword"
            >
              {{ showPassword ? '🙈' : '👁️' }}
            </button>
          </div>
          <p v-if="isEditing && touched.password && passwordError" class="field-alert">
            {{ passwordError }}
          </p>
        </div>

        <!-- Tombol Edit + Simpan -->
        <div class="btn-row">
          <button class="btn-edit" @click="startEdit">
            {{ isEditing ? 'Sedang Edit...' : 'Edit Profil' }}
          </button>
          <button class="btn-save" :disabled="!isEditing" @click="requestSave">Simpan Data</button>
        </div>
      </div>

      <!-- ===== TOMBOL HAPUS & KELUAR ===== -->
      <div class="danger-row">
        <button class="btn-hapus" @click="showHapusModal = true">Hapus Akun</button>
        <button class="btn-keluar" @click="showKeluarModal = true">Keluar Akun</button>
      </div>
    </div>

    <!-- ===== MODAL KONFIRMASI SIMPAN ===== -->
    <div v-if="showSimpanModal" class="modal-overlay" @click.self="showSimpanModal = false">
      <div class="modal-box">
        <p class="modal-title">Sudah benar semua data?</p>
        <div class="modal-btn-row">
          <button class="modal-btn btn-belum" @click="showSimpanModal = false">Belum</button>
          <button class="modal-btn btn-sudah" @click="simpanData">Sudah</button>
        </div>
      </div>
    </div>

    <!-- ===== MODAL KONFIRMASI HAPUS AKUN ===== -->
    <div v-if="showHapusModal" class="modal-overlay" @click.self="showHapusModal = false">
      <div class="modal-box">
        <p class="modal-title">Mau hapus akun kamu?</p>
        <p class="modal-sub">Semua data termasuk presensi dan kontrak akan dihapus permanen.</p>
        <div class="modal-btn-row">
          <button class="modal-btn btn-belum" @click="batalHapus">Tidak</button>
          <button class="modal-btn btn-hapus-konfirm" @click="hapusAkun">Ya, Hapus</button>
        </div>
      </div>
    </div>

    <!-- ===== MODAL KONFIRMASI KELUAR AKUN ===== -->
    <div v-if="showKeluarModal" class="modal-overlay" @click.self="showKeluarModal = false">
      <div class="modal-box">
        <p class="modal-title">Yakin mau keluar akun?</p>
        <p class="modal-sub">Kamu perlu login ulang untuk mengakses dashboard.</p>
        <div class="modal-btn-row">
          <button class="modal-btn btn-belum" @click="showKeluarModal = false">Tidak</button>
          <button class="modal-btn btn-sudah" @click="keluarAkun">Ya, Keluar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

defineOptions({ name: 'TentorBiodata' })

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const kodeTentor = route.params.id

// ============================================
// DUMMY DATA BIODATA TENTOR
// Nanti diganti dengan fetch dari API:
// onMounted(async () => {
//   const res = await fetch(`/api/tentor/${kodeTentor}`)
//   const data = await res.json()
//   form.nama = data.namaLengkap
//   form.email = data.email
//   form.password = data.password   // atau biarkan kosong & hanya update jika diisi
//   waNumber.value = data.noWA.replace('+62', '')
// })
// ============================================
const form = reactive({
  nama: 'Ahmad Fauzi',
  email: 'ahmadfauzi@email.com',
  password: 'Fauzi123',
})
const waNumber = ref('81234567890')

// ===== INISIAL AVATAR (sama seperti DashboardTentor) =====
const inisialTentor = computed(() => {
  return form.nama
    .split(' ')
    .map((kata) => kata[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
})

// ===== STATE EDIT =====
const isEditing = ref(false)
const showPassword = ref(false)
const showSimpanModal = ref(false)
const showHapusModal = ref(false)
const showKeluarModal = ref(false)

const touched = reactive({
  nama: false,
  wa: false,
  email: false,
  password: false,
})

const startEdit = () => {
  isEditing.value = true
}

// ===== VALIDASI (sama seperti SignInPage) =====

// Nama: hanya huruf dan spasi
const onNameInput = () => {
  form.nama = form.nama.replace(/[^a-zA-Z\s]/g, '')
}

// WA: hanya angka
const onWaInput = () => {
  waNumber.value = waNumber.value.replace(/[^0-9]/g, '')
}

const nameError = computed(() => {
  if (!form.nama) return 'Nama tentor wajib diisi'
  if (form.nama.trim().length < 3) return 'Nama minimal 3 karakter'
  return ''
})

const waError = computed(() => {
  if (!waNumber.value) return 'Nomor WhatsApp wajib diisi'
  if (waNumber.value.length < 9) return 'Nomor WhatsApp terlalu pendek'
  if (waNumber.value.length > 13) return 'Nomor WhatsApp terlalu panjang'
  if (waNumber.value.startsWith('0')) return 'Tanpa angka 0 di depan, karena sudah ada +62'
  return ''
})

const emailError = computed(() => {
  if (!form.email) return 'Email wajib diisi'
  const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/
  if (!emailRegex.test(form.email)) return 'Format email tidak valid'
  return ''
})

const passwordError = computed(() => {
  const pw = form.password
  if (!pw) return 'Password wajib diisi'
  if (pw.length < 6) return 'Password minimal 6 karakter'
  if (!/[A-Z]/.test(pw)) return 'Password harus mengandung huruf kapital'
  if (!/[a-z]/.test(pw)) return 'Password harus mengandung huruf kecil'
  if (!/[0-9]/.test(pw)) return 'Password harus mengandung angka'
  return ''
})

const isFormValid = computed(() => {
  return !nameError.value && !waError.value && !emailError.value && !passwordError.value
})

// ===== REQUEST SIMPAN: tandai semua touched dulu, baru tampil modal =====
const requestSave = () => {
  Object.keys(touched).forEach((k) => (touched[k] = true))
  if (!isFormValid.value) return
  showSimpanModal.value = true
}

// ===== SIMPAN DATA =====
const simpanData = () => {
  // ============================================
  // Nanti diganti dengan API call sungguhan:
  // await fetch(`/api/tentor/${kodeTentor}`, {
  //   method: 'PUT',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({
  //     namaLengkap: form.nama,
  //     noWA: `+62${waNumber.value}`,
  //     email: form.email,
  //     password: form.password
  //   })
  // })
  // ============================================
  console.log('Data tersimpan:', { ...form, noWA: `+62${waNumber.value}` })
  isEditing.value = false
  showSimpanModal.value = false
  // Reset touched
  Object.keys(touched).forEach((k) => (touched[k] = false))
}

// ===== BATAL HAPUS: tutup modal dan tetap di halaman biodata =====
const batalHapus = () => {
  showHapusModal.value = false
  router.push(`/tentor/biodata/${kodeTentor}`)
}

// ===== KELUAR AKUN =====
const keluarAkun = () => {
  authStore.logout()
  router.push('/login')
}

// ===== HAPUS AKUN =====
const hapusAkun = () => {
  // ============================================
  // Nanti diganti dengan API call sungguhan:
  // await fetch(`/api/tentor/${kodeTentor}`, { method: 'DELETE' })
  // — menghapus: data tentor, presensi, kontrak, semua record terkait kodeTentor
  // ============================================
  console.log(`Akun tentor ${kodeTentor} dihapus`)
  authStore.logout()
  showHapusModal.value = false
  router.push('/daftar')
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

* {
  font-family: 'DM Sans', sans-serif;
  box-sizing: border-box;
}

/* ===== HALAMAN ===== */
.biodata-page {
  position: relative;
  overflow: hidden;
  width: 100%;
  min-height: 100vh;
  background-color: #fdfaf3;
  background-image:
    radial-gradient(circle at 12% 18%, rgba(46, 135, 246, 0.18) 0%, transparent 42%),
    radial-gradient(circle at 88% 12%, rgba(243, 92, 43, 0.16) 0%, transparent 40%),
    radial-gradient(circle at 50% 92%, rgba(249, 236, 204, 0.55) 0%, transparent 58%);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 2rem 1rem 3rem;
}

/* Corak titik-titik kanan (sama seperti DashboardTentor) */
.bg-dots {
  position: absolute;
  inset: 0 0 0 auto;
  width: 24%;
  max-width: 160px;
  pointer-events: none;
  z-index: 0;
  background-image:
    radial-gradient(rgba(46, 135, 246, 0.18) 1.5px, transparent 1.5px),
    radial-gradient(rgba(243, 92, 43, 0.15) 1.5px, transparent 1.5px);
  background-size:
    26px 26px,
    26px 26px;
  background-position:
    0 0,
    13px 13px;
  -webkit-mask-image: linear-gradient(to left, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%);
  mask-image: linear-gradient(to left, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%);
}

/* Blob dekorasi kanan */
.bg-blob {
  position: absolute;
  top: 10%;
  right: -70px;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(249, 236, 204, 0.9) 0%,
    rgba(243, 92, 43, 0.22) 60%,
    transparent 75%
  );
  filter: blur(6px);
  pointer-events: none;
  z-index: 0;
}

/* ===== KONTEN ===== */
.biodata-content {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

/* ===== AVATAR ===== */
.avatar-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.avatar-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2e87f6 0%, #1d6fd4 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    0 8px 24px rgba(46, 135, 246, 0.35),
    inset 0 0 0 3px rgba(255, 255, 255, 0.25);
}

.avatar-initial {
  font-size: 1.75rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.04em;
}

.avatar-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #6b7280;
  margin: 0;
}

/* ===== FORM CARD ===== */
.form-card {
  width: 100%;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 1.5rem 1.25rem;
  box-shadow:
    0 8px 32px rgba(46, 135, 246, 0.1),
    0 2px 8px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* ===== FIELD GROUP ===== */
.field-group {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.field-label {
  font-size: 0.78rem;
  font-weight: 600;
  color: #374151;
}

.field-input {
  width: 100%;
  padding: 0.6rem 0.85rem;
  border-radius: 10px;
  border: 1.5px solid #e5e7eb;
  font-size: 0.875rem;
  outline: none;
  background: #f9fafb;
  color: #1f2937;
  transition:
    border-color 0.2s,
    box-shadow 0.2s,
    background 0.2s;
  cursor: default;
}

/* Saat editing: background berubah putih & border biru */
.field-input.is-active:not(:disabled) {
  background: #fff;
  cursor: text;
}
.field-input:focus:not(:disabled) {
  border-color: #2e87f6;
  box-shadow: 0 0 0 3px rgba(46, 135, 246, 0.12);
  background: #fff;
}
.field-input.is-error {
  border-color: #f35c2b;
}
.field-input.is-error:focus {
  box-shadow: 0 0 0 3px rgba(243, 92, 43, 0.12);
}
.field-input:disabled {
  opacity: 0.75;
  cursor: not-allowed;
}

.field-alert {
  font-size: 0.72rem;
  color: #f35c2b;
  margin: 0;
  line-height: 1.3;
}

/* ===== PHONE INPUT ===== */
.phone-input-wrap {
  display: flex;
  align-items: center;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  overflow: hidden;
  background: #f9fafb;
  transition:
    border-color 0.2s,
    background 0.2s;
}
.phone-input-wrap.is-active {
  background: #fff;
}
.phone-input-wrap.is-error {
  border-color: #f35c2b;
}
.phone-input-wrap:focus-within {
  border-color: #2e87f6;
  box-shadow: 0 0 0 3px rgba(46, 135, 246, 0.12);
  background: #fff;
}
.phone-prefix {
  padding: 0 0.65rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  border-right: 1.5px solid #e5e7eb;
  background: transparent;
  flex-shrink: 0;
  line-height: 2.6;
}
.phone-input {
  border: none !important;
  box-shadow: none !important;
  border-radius: 0 !important;
  background: transparent !important;
  flex: 1;
}

/* ===== PASSWORD WRAP ===== */
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

/* ===== TOMBOL EDIT + SIMPAN ===== */
.btn-row {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.25rem;
}

.btn-edit,
.btn-save {
  flex: 1;
  padding: 0.65rem 0.5rem;
  border-radius: 10px;
  border: none;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s,
    opacity 0.2s;
}

.btn-edit {
  background: #2e87f6;
  color: #fff;
  box-shadow: 0 4px 14px rgba(46, 135, 246, 0.3);
}
.btn-edit:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(46, 135, 246, 0.4);
}

.btn-save {
  background: #16a34a;
  color: #fff;
  box-shadow: 0 4px 14px rgba(22, 163, 74, 0.3);
}
.btn-save:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(22, 163, 74, 0.4);
}
.btn-save:disabled {
  background: #d1d5db;
  color: #9ca3af;
  box-shadow: none;
  cursor: not-allowed;
}

/* ===== TOMBOL HAPUS & KELUAR ===== */
.danger-row {
  display: flex;
  gap: 0.75rem;
  width: 100%;
}

.btn-hapus,
.btn-keluar {
  flex: 1;
  padding: 0.65rem 0.5rem;
  border-radius: 10px;
  border: 1.5px solid;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  background: transparent;
  transition:
    background 0.2s,
    color 0.2s,
    transform 0.2s;
}

.btn-hapus {
  border-color: #ef4444;
  color: #ef4444;
}
.btn-hapus:hover {
  background: #ef4444;
  color: #fff;
  transform: translateY(-1px);
}

.btn-keluar {
  border-color: #6b7280;
  color: #6b7280;
}
.btn-keluar:hover {
  background: #6b7280;
  color: #fff;
  transform: translateY(-1px);
}

/* ===== MODAL ===== */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(3px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal-box {
  background: #fff;
  border-radius: 18px;
  padding: 1.75rem 1.5rem;
  width: 100%;
  max-width: 320px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.18);
  animation: modalIn 0.22s ease-out;
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: scale(0.94) translateY(12px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal-title {
  font-size: 1rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.4rem;
}
.modal-sub {
  font-size: 0.8rem;
  color: #6b7280;
  margin: 0 0 1.25rem;
  line-height: 1.5;
}

.modal-btn-row {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.25rem;
}

.modal-btn {
  flex: 1;
  padding: 0.65rem;
  border-radius: 10px;
  border: none;
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
  transition:
    transform 0.15s,
    box-shadow 0.15s;
}
.modal-btn:hover {
  transform: translateY(-1px);
}

.btn-belum {
  background: #f3f4f6;
  color: #374151;
}
.btn-belum:hover {
  background: #e5e7eb;
}

.btn-sudah {
  background: #2e87f6;
  color: #fff;
  box-shadow: 0 4px 12px rgba(46, 135, 246, 0.3);
}
.btn-sudah:hover {
  box-shadow: 0 6px 16px rgba(46, 135, 246, 0.4);
}

.btn-hapus-konfirm {
  background: #ef4444;
  color: #fff;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}
.btn-hapus-konfirm:hover {
  box-shadow: 0 6px 16px rgba(239, 68, 68, 0.4);
}

/* =====================================================
   RESPONSIVE — Mobile-first (default ≤ 639px)
   ===================================================== */

/* ===== TABLET (≥ 641px) ===== */
@media (min-width: 641px) {
  .biodata-page {
    padding: 2.5rem 1.5rem 4rem;
    align-items: center;
  }

  .biodata-content {
    max-width: 460px;
    gap: 1.75rem;
  }

  .avatar-circle {
    width: 96px;
    height: 96px;
  }
  .avatar-initial {
    font-size: 2.1rem;
  }
  .avatar-label {
    font-size: 0.85rem;
  }

  .form-card {
    padding: 2rem 1.75rem;
    border-radius: 22px;
    gap: 1.1rem;
  }
  .field-label {
    font-size: 0.8rem;
  }
  .field-input {
    padding: 0.65rem 0.9rem;
    font-size: 0.9rem;
  }
  .btn-edit,
  .btn-save,
  .btn-hapus,
  .btn-keluar {
    font-size: 0.85rem;
    padding: 0.7rem 0.5rem;
  }

  .modal-box {
    padding: 2rem 1.75rem;
    max-width: 360px;
  }
  .modal-title {
    font-size: 1.05rem;
  }
}

/* ===== DESKTOP (≥ 768px) ===== */
@media (min-width: 768px) {
  .biodata-page {
    padding: 3rem 2rem 5rem;
  }

  .biodata-content {
    max-width: 500px;
    gap: 2rem;
  }

  .avatar-circle {
    width: 108px;
    height: 108px;
  }
  .avatar-initial {
    font-size: 2.4rem;
  }
  .avatar-label {
    font-size: 0.88rem;
  }

  .form-card {
    padding: 2.25rem 2rem;
    border-radius: 24px;
    gap: 1.2rem;
  }
  .field-label {
    font-size: 0.82rem;
  }
  .field-input {
    padding: 0.7rem 1rem;
    font-size: 0.9rem;
    border-radius: 12px;
  }
  .phone-prefix {
    font-size: 0.9rem;
  }
  .btn-edit,
  .btn-save,
  .btn-hapus,
  .btn-keluar {
    font-size: 0.88rem;
    padding: 0.72rem 0.5rem;
    border-radius: 12px;
  }

  .modal-box {
    max-width: 380px;
  }
}

/* ===== LARGE DESKTOP (≥ 1024px) ===== */
@media (min-width: 1024px) {
  .biodata-page {
    padding: 4rem 2rem 6rem;
  }

  .biodata-content {
    max-width: 520px;
    gap: 2.25rem;
  }

  .avatar-circle {
    width: 120px;
    height: 120px;
  }
  .avatar-initial {
    font-size: 2.7rem;
  }

  .form-card {
    padding: 2.5rem 2.25rem;
    gap: 1.25rem;
  }
  .field-input {
    font-size: 0.95rem;
  }
  .btn-edit,
  .btn-save,
  .btn-hapus,
  .btn-keluar {
    font-size: 0.9rem;
    padding: 0.75rem 0.5rem;
  }

  .modal-box {
    max-width: 400px;
    padding: 2.25rem 2rem;
  }
  .modal-title {
    font-size: 1.1rem;
  }
  .modal-sub {
    font-size: 0.85rem;
  }
}
</style>
