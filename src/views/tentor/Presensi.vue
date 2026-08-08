<!-- Presensi.vue -->
<template>
  <div class="presensi-page">
    <!-- ===== HEADER ===== -->
    <div class="presensi-header">
      <router-link :to="`/tentor/dashboardtentor/${kodeTentor}`" class="back-link">
        ‹ Kembali
      </router-link>
      <h1 class="header-title">Presensi</h1>
      <p class="header-sub">Isi presensi setiap kali selesai mengajar</p>
    </div>

    <div class="presensi-content">
      <!-- ===== FORM PRESENSI ===== -->
      <form class="presensi-form" @submit.prevent="requestSubmit">
        <!-- 1. Hari & Tanggal -->
        <div class="field-group">
          <label class="field-label">Hari, Tanggal</label>
          <div class="date-row">
            <input
              type="date"
              class="field-input date-input"
              v-model="form.tanggal"
              @change="touched.tanggal = true"
            />
            <button type="button" class="btn-today" @click="setToday">Hari Ini</button>
          </div>
          <p class="date-preview">{{ formattedTanggal }}</p>
          <p v-if="touched.tanggal && tanggalError" class="field-alert">{{ tanggalError }}</p>
        </div>

        <!-- 2. Materi -->
        <div class="field-group">
          <label class="field-label">Materi</label>
          <textarea
            class="field-textarea"
            :class="{ 'is-error': touched.materi && materiError }"
            v-model="form.materi"
            @input="onMateriInput"
            @blur="touched.materi = true"
            rows="5"
            placeholder="Tuliskan materi yang diajarkan hari ini..."
          ></textarea>
          <div class="materi-footer">
            <p v-if="touched.materi && materiError" class="field-alert">{{ materiError }}</p>
            <p class="word-counter" :class="{ 'over-limit': jumlahKata > 1500 }">
              {{ jumlahKata }}/1500 kata
            </p>
          </div>
        </div>

        <!-- 3. Foto Kegiatan Les (kamera live + deteksi wajah) -->
        <UploadFoto
          v-model="form.foto"
          label="Foto Kegiatan Les"
          description="Foto berupa selfie boleh berupa kegiatan les atau bersama walimurid"
          :min-faces="2"
          camera-facing="user"
        />

        <!-- 4. Tombol Konfirmasi -->
        <button type="submit" class="btn-submit" :disabled="!isFormValid">
          Konfirmasi Presensi
        </button>
      </form>

      <!-- ===== TABEL RIWAYAT PRESENSI ===== -->
      <div class="riwayat-section">
        <div class="riwayat-header">
          <h2 class="section-title">Riwayat Presensi</h2>
          <button
            type="button"
            class="btn-download"
            :disabled="riwayat.length === 0"
            @click="downloadPNG"
          >
            ⬇️ Download PNG
          </button>
        </div>

        <div class="table-wrapper" ref="tableRef">
          <table class="riwayat-table">
            <thead>
              <tr>
                <th class="col-no">No</th>
                <th>Hari, Tanggal</th>
                <th>Materi</th>
                <th class="col-kehadiran">Kehadiran</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="riwayat.length === 0">
                <td colspan="4" class="empty-row">Belum ada presensi yang dilakukan</td>
              </tr>
              <tr v-for="(item, index) in riwayat" :key="index">
                <td class="col-no">{{ riwayat.length - index }}</td>
                <td>{{ item.hariTanggalDisplay }}</td>
                <td class="col-materi">{{ item.materi }}</td>
                <td class="col-kehadiran">
                  <span v-if="item.kehadiran" class="check-yes">✔️</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ===== MODAL KONFIRMASI ===== -->
    <div v-if="showConfirmModal" class="modal-overlay" @click.self="showConfirmModal = false">
      <div class="modal-box">
        <p class="modal-title">Sudah benar mau presensi sekarang?</p>
        <p class="modal-sub">Pastikan tanggal, materi, dan foto sudah sesuai sebelum konfirmasi.</p>
        <div class="modal-btn-row">
          <button class="modal-btn btn-belum" @click="showConfirmModal = false">Belum</button>
          <button class="modal-btn btn-sudah" @click="submitPresensi">Sudah</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRoute } from 'vue-router'
import { usePresensiStore } from '@/stores/presensi'
import UploadFoto from '@/components/UploadFoto.vue'

defineOptions({ name: 'TentorPresensi' })

const route = useRoute()
const presensiStore = usePresensiStore()
const kodeTentor = route.params.id

// ============================================
// DUMMY NAMA TENTOR — nanti diganti fetch API, sama seperti file tentor lain
// ============================================
const namaTentor = ref('Ahmad Fauzi')

// ===== HELPER TANGGAL =====
const toDateKey = (d) => d.toISOString().split('T')[0]
const formatHariTanggal = (dateKeyStr) => {
  if (!dateKeyStr) return ''
  const d = new Date(dateKeyStr + 'T00:00:00')
  return d.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

// ===== STATE FORM =====
const form = reactive({
  tanggal: toDateKey(new Date()), // default hari ini
  materi: '',
  foto: '',
})

const touched = reactive({
  tanggal: false,
  materi: false,
})

const setToday = () => {
  form.tanggal = toDateKey(new Date())
  touched.tanggal = true
}

const formattedTanggal = computed(() => formatHariTanggal(form.tanggal))

// ===== VALIDASI =====
const tanggalError = computed(() => {
  if (!form.tanggal) return 'Tanggal wajib diisi'
  return ''
})

// Materi: hanya huruf, spasi, dan tanda baca umum — angka tidak diperbolehkan
const onMateriInput = () => {
  form.materi = form.materi.replace(/[^a-zA-Z\s,.\!\?'"\-:;()]/g, '')
}

const jumlahKata = computed(() => {
  const trimmed = form.materi.trim()
  if (!trimmed) return 0
  return trimmed.split(/\s+/).length
})

const materiError = computed(() => {
  if (!form.materi.trim()) return 'Materi wajib diisi'
  if (jumlahKata.value > 1500) return 'Materi melebihi batas 1500 kata'
  return ''
})

const isFormValid = computed(() => {
  return !tanggalError.value && !materiError.value && form.foto !== ''
})

// ===== SUBMIT =====
const showConfirmModal = ref(false)
const requestSubmit = () => {
  touched.tanggal = true
  touched.materi = true
  if (!isFormValid.value) return
  showConfirmModal.value = true
}

const submitPresensi = () => {
  const now = new Date()
  const jamPresensi = now.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

  const dataBaru = {
    namaTentor: namaTentor.value,
    kodeTentor,
    tanggalKey: form.tanggal,
    hariTanggalDisplay: formatHariTanggal(form.tanggal),
    jamPresensi,
    materi: form.materi.trim(),
    fotoUrl: form.foto,
    kehadiran: true,
  }

  presensiStore.addPresensi(dataBaru)

  // Reset form untuk entri berikutnya, tapi biarkan riwayat tetap tampil
  form.tanggal = toDateKey(new Date())
  form.materi = ''
  form.foto = ''
  touched.tanggal = false
  touched.materi = false
  showConfirmModal.value = false
}

// ===== RIWAYAT PRESENSI TENTOR INI =====
const riwayat = computed(() => presensiStore.riwayatByTentor(kodeTentor))

// ===== DOWNLOAD TABEL SEBAGAI PNG =====
const tableRef = ref(null)
const downloadPNG = async () => {
  if (riwayat.value.length === 0) return

  try {
    // ============================================
    // html2canvas dimuat dari CDN saat dibutuhkan saja (dynamic import),
    // supaya tidak menambah beban awal saat halaman pertama dibuka.
    // ============================================
    const html2canvasModule = await import(
      /* @vite-ignore */ 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/+esm'
    )
    const html2canvas = html2canvasModule.default

    const canvas = await html2canvas(tableRef.value, { backgroundColor: '#ffffff', scale: 2 })
    const link = document.createElement('a')
    link.download = `riwayat-presensi-${kodeTentor}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  } catch {
    alert('Gagal membuat gambar. Pastikan koneksi internet stabil dan coba lagi.')
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

* {
  font-family: 'DM Sans', sans-serif;
  box-sizing: border-box;
}

.presensi-page {
  width: 100%;
  min-height: 100vh;
  background-color: #fdfaf3;
  background-image:
    radial-gradient(circle at 12% 18%, rgba(46, 135, 246, 0.14) 0%, transparent 42%),
    radial-gradient(circle at 88% 12%, rgba(243, 92, 43, 0.12) 0%, transparent 40%),
    radial-gradient(circle at 50% 92%, rgba(249, 236, 204, 0.5) 0%, transparent 58%);
}

/* ===== HEADER ===== */
.presensi-header {
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
.presensi-content {
  max-width: 640px;
  margin: 0 auto;
  padding: 1rem 1rem 3rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* ===== FORM ===== */
.presensi-form {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(6px);
  border-radius: 20px;
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

/* Tanggal */
.date-row {
  display: flex;
  gap: 0.5rem;
}
.date-input {
  flex: 1;
}
.btn-today {
  padding: 0 0.9rem;
  border-radius: 10px;
  border: 1.5px solid #2e87f6;
  background: #fff;
  color: #2e87f6;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition:
    background 0.2s,
    color 0.2s;
}
.btn-today:hover {
  background: #2e87f6;
  color: #fff;
}
.date-preview {
  font-size: 0.76rem;
  color: #6b7280;
  margin: 0.35rem 0 0;
}

.field-input {
  width: 100%;
  padding: 0.65rem 0.9rem;
  border-radius: 10px;
  border: 1.5px solid #e5e7eb;
  font-size: 0.88rem;
  outline: none;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
  font-family: inherit;
}
.field-input:focus {
  border-color: #2e87f6;
  box-shadow: 0 0 0 3px rgba(46, 135, 246, 0.12);
}

/* Materi */
.field-textarea {
  width: 100%;
  padding: 0.7rem 0.9rem;
  border-radius: 12px;
  border: 1.5px solid #e5e7eb;
  font-size: 0.86rem;
  outline: none;
  resize: vertical;
  min-height: 110px;
  font-family: inherit;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}
.field-textarea:focus {
  border-color: #2e87f6;
  box-shadow: 0 0 0 3px rgba(46, 135, 246, 0.12);
}
.field-textarea.is-error {
  border-color: #f35c2b;
}

.materi-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.35rem;
}
.word-counter {
  font-size: 0.72rem;
  color: #9ca3af;
  margin: 0;
  margin-left: auto;
}
.word-counter.over-limit {
  color: #f35c2b;
  font-weight: 700;
}

.field-alert {
  font-size: 0.74rem;
  color: #f35c2b;
  margin: 0;
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

/* ===== RIWAYAT TABEL ===== */
.riwayat-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.riwayat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}
.section-title {
  font-size: 1rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}
.btn-download {
  padding: 0.5rem 0.9rem;
  border-radius: 10px;
  border: 1.5px solid #16a34a;
  background: #fff;
  color: #16a34a;
  font-size: 0.76rem;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition:
    background 0.2s,
    color 0.2s,
    opacity 0.2s;
}
.btn-download:hover:not(:disabled) {
  background: #16a34a;
  color: #fff;
}
.btn-download:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  border-color: #9ca3af;
  color: #9ca3af;
}

.table-wrapper {
  width: 100%;
  overflow-x: auto;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
  padding: 0.25rem;
}

.riwayat-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 500px;
}
.riwayat-table th {
  background: #2e87f6;
  color: #fff;
  font-size: 0.74rem;
  font-weight: 700;
  padding: 0.55rem 0.6rem;
  text-align: left;
}
.riwayat-table td {
  border-bottom: 1px solid #f0f0f0;
  padding: 0.55rem 0.6rem;
  font-size: 0.78rem;
  color: #374151;
  vertical-align: top;
}
.col-no {
  width: 40px;
  text-align: center;
  font-weight: 700;
  color: #2e87f6;
}
.col-kehadiran {
  width: 90px;
  text-align: center;
}
.col-materi {
  max-width: 260px;
  white-space: pre-wrap;
}
.check-yes {
  font-size: 1rem;
}
.empty-row {
  text-align: center;
  color: #9ca3af;
  font-size: 0.82rem;
  padding: 1.5rem 1rem;
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
  .presensi-header {
    padding: 1.5rem 1.25rem 0.6rem;
  }
  .header-title {
    font-size: 1.25rem;
  }
  .presensi-content {
    padding: 1.1rem 1.25rem 3.5rem;
    gap: 1.75rem;
  }
  .presensi-form {
    padding: 1.5rem;
    border-radius: 22px;
  }
  .field-input,
  .field-textarea {
    font-size: 0.9rem;
  }
  .btn-submit {
    font-size: 0.95rem;
    padding: 0.9rem;
  }
  .riwayat-table th,
  .riwayat-table td {
    font-size: 0.8rem;
    padding: 0.65rem 0.75rem;
  }
}

@media (min-width: 768px) {
  .presensi-header,
  .presensi-content {
    max-width: 720px;
  }
  .header-title {
    font-size: 1.35rem;
  }
  .presensi-form {
    padding: 1.75rem 2rem;
  }
}

@media (min-width: 1024px) {
  .presensi-header,
  .presensi-content {
    max-width: 780px;
  }
  .presensi-form {
    padding: 2rem 2.25rem;
  }
}
</style>
