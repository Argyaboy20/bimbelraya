<!-- PerpanjangKontrak.vue -->
<template>
  <div class="kontrak-page">
    <!-- ===== HEADER ===== -->
    <div class="kontrak-header">
      <router-link :to="`/tentor/dashboardtentor/${kodeTentor}`" class="back-link">
        ‹ Kembali
      </router-link>
      <h1 class="header-title">Perpanjang Kontrak</h1>
      <p class="header-sub">Pantau dan ajukan perpanjangan masa kontrak mengajarmu</p>
    </div>

    <div class="kontrak-content">
      <!-- ===== STATE: DATA TENTOR TIDAK DITEMUKAN ===== -->
      <div v-if="!dataTentor" class="empty-card">
        <div class="empty-icon">⚠️</div>
        <p class="empty-text">Data kontrak kamu belum tersedia</p>
        <p class="empty-sub">
          Kamu belum terdaftar di data tentor admin, atau kontrak sudah tidak aktif. Hubungi admin
          Bimbel Raya.
        </p>
      </div>

      <template v-else>
        <!-- ===== SECTION: KONTRAK BIMBEL RAYA (readonly) ===== -->
        <section class="kontrak-section">
          <h2 class="section-title">Kontrak Bimbel Raya</h2>
          <div class="kontrak-card">
            <p class="kontrak-label">Kontrak berlaku hingga</p>
            <p class="kontrak-tanggal">{{ formattedKontrakSekarang }}</p>
            <div class="countdown-box" :class="countdownClass">
              {{ countdownText }}
            </div>
          </div>
        </section>

        <!-- ===== SECTION: AJUKAN KONTRAK BARU ===== -->
        <section class="kontrak-section">
          <h2 class="section-title">Ajukan Kontrak Baru</h2>
          <p class="section-desc">
            Pilih tanggal kontrak baru. Maksimal perpanjangan 3 bulan terhitung dari hari ini.
          </p>

          <form class="ajukan-form" @submit.prevent="requestSubmit">
            <div class="field-group">
              <label class="field-label">Tanggal Kontrak Baru</label>
              <input
                type="date"
                class="field-input"
                :class="{ 'is-error': touched && tanggalError }"
                v-model="form.tanggalBaru"
                :min="minTanggal"
                :max="maxTanggal"
                @change="touched = true"
              />
              <p v-if="touched && tanggalError" class="field-alert">{{ tanggalError }}</p>
              <p class="field-hint">
                Rentang yang diperbolehkan: {{ formattedMin }} — {{ formattedMax }}
              </p>
            </div>

            <button type="submit" class="btn-submit" :disabled="!isFormValid">
              Ajukan Kontrak
            </button>
          </form>
        </section>
      </template>
    </div>

    <!-- ===== MODAL KONFIRMASI ===== -->
    <div v-if="showConfirmModal" class="modal-overlay" @click.self="showConfirmModal = false">
      <div class="modal-box">
        <p class="modal-title">Sudah benar mau ajukan kontrak baru?</p>
        <p class="modal-sub">Kontrak akan diperbarui hingga {{ formattedTanggalBaru }}.</p>
        <div class="modal-btn-row">
          <button class="modal-btn btn-belum" @click="showConfirmModal = false">Belum</button>
          <button class="modal-btn btn-sudah" @click="submitKontrak">Sudah</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTentorStore } from '@/stores/tentor'
import { useAuthStore } from '@/stores/auth'

defineOptions({ name: 'PerpanjangKontrak' })

const route = useRoute()
const router = useRouter()
const tentorStore = useTentorStore()
const authStore = useAuthStore()
const kodeTentor = route.params.id

// ===== HELPER TANGGAL =====
const toDateKey = (d) => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

// ============================================
// Sebelum tampil, sapu dulu kontrak yang sudah expired di seluruh
// data tentor. Kalau ternyata akun sendiri yang baru saja terhapus
// (kontrak sudah lewat tanpa diperpanjang), langsung logout + redirect.
// ============================================
onMounted(() => {
  const kodeYangDihapus = tentorStore.checkExpiredContracts()
  if (kodeYangDihapus.includes(kodeTentor)) {
    alert('Masa kontrakmu sudah habis dan tidak diperpanjang. Akun telah dinonaktifkan.')
    authStore.logout()
    router.push('/daftar')
  }
})

// ===== DATA TENTOR SAAT INI (reaktif dari store) =====
const dataTentor = computed(() => tentorStore.getByKode(kodeTentor))

const formattedKontrakSekarang = computed(() => {
  return dataTentor.value ? formatTanggal(dataTentor.value.habisKontrak) : '-'
})

// ===== COUNTDOWN REALTIME =====
const countdownText = computed(() => {
  if (!dataTentor.value || !dataTentor.value.habisKontrak) return '-'
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(dataTentor.value.habisKontrak + 'T00:00:00')
  const diffDays = Math.round((target - today) / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return 'Masa kontrak sudah habis'
  if (diffDays === 0) return 'Hari ini masa kontrak habis pukul 23.59'
  return `${diffDays} hari lagi masa kontrak habis`
})

const countdownClass = computed(() => {
  if (!dataTentor.value || !dataTentor.value.habisKontrak) return ''
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(dataTentor.value.habisKontrak + 'T00:00:00')
  const diffDays = Math.round((target - today) / (1000 * 60 * 60 * 24))

  if (diffDays <= 0) return 'text-danger'
  if (diffDays <= 5) return 'text-warning'
  return 'text-safe'
})

// ===== FORM AJUKAN KONTRAK BARU =====
const form = reactive({ tanggalBaru: '' })
const touched = ref(false)

const minTanggal = computed(() => toDateKey(new Date()))
const maxTanggal = computed(() => {
  const d = new Date()
  d.setMonth(d.getMonth() + 3)
  return toDateKey(d)
})
const formattedMin = computed(() => formatTanggal(minTanggal.value))
const formattedMax = computed(() => formatTanggal(maxTanggal.value))
const formattedTanggalBaru = computed(() => formatTanggal(form.tanggalBaru))

const tanggalError = computed(() => {
  if (!form.tanggalBaru) return 'Tanggal kontrak baru wajib diisi'
  if (form.tanggalBaru < minTanggal.value) return 'Tanggal tidak boleh sebelum hari ini'
  if (form.tanggalBaru > maxTanggal.value) return 'Maksimal perpanjangan 3 bulan dari hari ini'
  return ''
})

const isFormValid = computed(() => !tanggalError.value)

// ===== SUBMIT =====
const showConfirmModal = ref(false)
const requestSubmit = () => {
  touched.value = true
  if (!isFormValid.value) return
  showConfirmModal.value = true
}

const submitKontrak = () => {
  tentorStore.updateKontrak(kodeTentor, form.tanggalBaru)
  form.tanggalBaru = ''
  touched.value = false
  showConfirmModal.value = false
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

* {
  font-family: 'DM Sans', sans-serif;
  box-sizing: border-box;
}

.kontrak-page {
  width: 100%;
  min-height: 100vh;
  background-color: #fdfaf3;
  background-image:
    radial-gradient(circle at 12% 18%, rgba(46, 135, 246, 0.14) 0%, transparent 42%),
    radial-gradient(circle at 88% 12%, rgba(243, 92, 43, 0.12) 0%, transparent 40%),
    radial-gradient(circle at 50% 92%, rgba(249, 236, 204, 0.5) 0%, transparent 58%);
}

/* ===== HEADER ===== */
.kontrak-header {
  padding: 1.25rem 1rem 0.5rem;
  max-width: 640px;
  margin: 0 auto;
}
.back-link {
  display: inline-block;
  font-size: 0.8rem;
  font-weight: 600;
  color: #2e87f6;
  text-decoration: none;
  margin-bottom: 0.5rem;
}
.back-link:hover {
  text-decoration: underline;
}
.header-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.15rem;
}
.header-sub {
  font-size: 0.78rem;
  color: #6b7280;
  margin: 0;
}

/* ===== CONTENT ===== */
.kontrak-content {
  max-width: 640px;
  margin: 0 auto;
  padding: 1rem 1rem 3rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* ===== EMPTY STATE ===== */
.empty-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  padding: 2.5rem 1.5rem;
  text-align: center;
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.06);
}
.empty-icon {
  font-size: 2.5rem;
  margin-bottom: 0.75rem;
}
.empty-text {
  font-size: 1rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.4rem;
}
.empty-sub {
  font-size: 0.82rem;
  color: #6b7280;
  line-height: 1.5;
  margin: 0;
}

/* ===== SECTION ===== */
.kontrak-section {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}
.section-title {
  font-size: 1rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}
.section-desc {
  font-size: 0.78rem;
  color: #6b7280;
  margin: -0.3rem 0 0;
  line-height: 1.5;
}

/* ===== KONTRAK CARD (readonly) ===== */
.kontrak-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(6px);
  border-radius: 18px;
  padding: 1.25rem;
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.06);
  text-align: center;
}
.kontrak-label {
  font-size: 0.76rem;
  color: #6b7280;
  margin: 0 0 0.3rem;
}
.kontrak-tanggal {
  font-size: 1.3rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.85rem;
}
.countdown-box {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  font-size: 0.82rem;
  font-weight: 700;
}
.text-safe {
  background: #dcfce7;
  color: #15803d;
}
.text-warning {
  background: #fef9c3;
  color: #a16207;
}
.text-danger {
  background: #fee2e2;
  color: #b91c1c;
}

/* ===== FORM AJUKAN ===== */
.ajukan-form {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(6px);
  border-radius: 18px;
  padding: 1.25rem;
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.06);
}
.field-group {
  display: flex;
  flex-direction: column;
}
.field-label {
  font-size: 0.82rem;
  font-weight: 700;
  color: #374151;
  margin-bottom: 0.4rem;
}
.field-input {
  width: 100%;
  padding: 0.65rem 0.9rem;
  border-radius: 10px;
  border: 1.5px solid #e5e7eb;
  font-size: 0.86rem;
  outline: none;
  font-family: inherit;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}
.field-input:focus {
  border-color: #2e87f6;
  box-shadow: 0 0 0 3px rgba(46, 135, 246, 0.12);
}
.field-input.is-error {
  border-color: #f35c2b;
}
.field-alert {
  font-size: 0.74rem;
  color: #f35c2b;
  margin: 0.35rem 0 0;
}
.field-hint {
  font-size: 0.7rem;
  color: #9ca3af;
  margin: 0.35rem 0 0;
}

.btn-submit {
  width: 100%;
  padding: 0.85rem;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #2e87f6 0%, #1d6fd4 100%);
  color: #fff;
  font-weight: 700;
  font-size: 0.92rem;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(46, 135, 246, 0.3);
  transition:
    transform 0.2s,
    box-shadow 0.2s,
    opacity 0.2s;
}
.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
}
.btn-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
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
  transition: transform 0.15s;
}
.modal-btn:hover {
  transform: translateY(-1px);
}
.btn-belum {
  background: #f3f4f6;
  color: #374151;
}
.btn-sudah {
  background: #2e87f6;
  color: #fff;
  box-shadow: 0 4px 12px rgba(46, 135, 246, 0.3);
}

/* =====================================================
   BREAKPOINTS
   @media 641px  : tablet
   @media 768px  : desktop
   @media 1024px : large desktop
   ===================================================== */

@media (min-width: 641px) {
  .kontrak-header {
    padding: 1.5rem 1.25rem 0.6rem;
  }
  .header-title {
    font-size: 1.25rem;
  }
  .kontrak-content {
    padding: 1.1rem 1.25rem 3.5rem;
    gap: 1.75rem;
  }
  .kontrak-card,
  .ajukan-form {
    padding: 1.5rem;
    border-radius: 20px;
  }
  .kontrak-tanggal {
    font-size: 1.5rem;
  }
  .field-input {
    font-size: 0.9rem;
  }
  .btn-submit {
    font-size: 0.95rem;
    padding: 0.9rem;
  }
}

@media (min-width: 768px) {
  .kontrak-header,
  .kontrak-content {
    max-width: 720px;
  }
  .header-title {
    font-size: 1.35rem;
  }
  .kontrak-card,
  .ajukan-form {
    padding: 1.75rem 2rem;
  }
}

@media (min-width: 1024px) {
  .kontrak-header,
  .kontrak-content {
    max-width: 780px;
  }
  .kontrak-card,
  .ajukan-form {
    padding: 2rem 2.25rem;
  }
}
</style>
