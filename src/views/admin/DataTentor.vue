<!-- DataTentor.vue -->
<template>
  <div class="data-tentor-page">
    <Navbar />

    <div class="page-content">
      <h1 class="page-title">Data Tentor Bimbel Raya</h1>

      <div class="table-wrapper">
        <table class="sheet-table">
          <thead>
            <tr>
              <th class="col-no">No</th>
              <th>Nama Tentor</th>
              <th>Panggilan</th>
              <th>Nomor Telepon</th>
              <th>Email</th>
              <th>Lulusan</th>
              <th>Alamat</th>
              <th>Kode Tentor</th>
              <th>Gaji / Pertemuan</th>
              <th>Kontak Darurat</th>
              <th>CV</th>
              <th>Pas Photo</th>
              <th>Surat Kontrak</th>
              <th>Habis Masa Kontrak</th>
              <th>Hitungan Hari</th>
              <th class="col-confirm"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in rows" :key="row.rowId" :class="{ 'row-saved': row.isSaved, 'row-editing': row.isEditing }">
              <!-- Nomor — hanya tampil setelah baris dikonfirmasi simpan -->
              <td class="col-no">
                <span v-if="row.isSaved">{{ row.savedNumber }}</span>
              </td>

              <!-- Nama Tentor: huruf & spasi saja -->
              <td>
                <input
                  type="text"
                  class="cell-input"
                  :class="{ 'cell-error': row.touched.nama && namaError(row) }"
                  v-model="row.nama"
                  @input="(onNamaInput(row), onRowChanged(index))"
                  @focus="row.touched.nama = true"
                  :disabled="row.isSaved && !row.isEditing"
                  placeholder="Nama lengkap"
                />
                <p v-if="row.touched.nama && namaError(row)" class="cell-alert">
                  {{ namaError(row) }}
                </p>
              </td>

              <!-- Panggilan: huruf & spasi saja -->
              <td>
                <input
                  type="text"
                  class="cell-input"
                  :class="{ 'cell-error': row.touched.panggilan && panggilanError(row) }"
                  v-model="row.panggilan"
                  @input="(onPanggilanInput(row), onRowChanged(index))"
                  @focus="row.touched.panggilan = true"
                  :disabled="row.isSaved && !row.isEditing"
                  placeholder="Panggilan"
                />
                <p v-if="row.touched.panggilan && panggilanError(row)" class="cell-alert">
                  {{ panggilanError(row) }}
                </p>
              </td>

              <!-- Nomor Telepon: format wa.me/62... -->
              <td>
                <input
                  type="text"
                  class="cell-input"
                  :class="{ 'cell-error': row.touched.telepon && teleponError(row) }"
                  v-model="row.telepon"
                  @input="onRowChanged(index)"
                  @focus="row.touched.telepon = true"
                  :disabled="row.isSaved && !row.isEditing""
                  placeholder="wa.me/62812xxxxxxx"
                />
                <p v-if="row.touched.telepon && teleponError(row)" class="cell-alert">
                  {{ teleponError(row) }}
                </p>
              </td>

              <!-- Email -->
              <td>
                <input
                  type="text"
                  class="cell-input"
                  :class="{ 'cell-error': row.touched.email && emailError(row) }"
                  v-model="row.email"
                  @input="onRowChanged(index)"
                  @focus="row.touched.email = true"
                  :disabled="row.isSaved && !row.isEditing"
                  placeholder="nama@email.com"
                />
                <p v-if="row.touched.email && emailError(row)" class="cell-alert">
                  {{ emailError(row) }}
                </p>
              </td>

              <!-- Lulusan: huruf, angka, simbol -->
              <td>
                <input
                  type="text"
                  class="cell-input"
                  v-model="row.lulusan"
                  @input="onRowChanged(index)"
                  :disabled="row.isSaved && !row.isEditing"
                  placeholder="S1 Pendidikan..."
                />
              </td>

              <!-- Alamat: huruf, angka, simbol -->
              <td>
                <input
                  type="text"
                  class="cell-input"
                  v-model="row.alamat"
                  @input="onRowChanged(index)"
                  :disabled="row.isSaved && !row.isEditing"
                  placeholder="Alamat lengkap"
                />
              </td>

              <!-- Kode Tentor: angka & huruf, tanpa spasi -->
              <td>
                <input
                  type="text"
                  class="cell-input"
                  :class="{ 'cell-error': row.touched.kode && kodeError(row) }"
                  v-model="row.kodeTentor"
                  @input="(onKodeInput(row), onRowChanged(index))"
                  @focus="row.touched.kode = true"
                  :disabled="row.isSaved"
                  placeholder="Contoh: TR1001"
                />
                <p v-if="row.touched.kode && kodeError(row)" class="cell-alert">
                  {{ kodeError(row) }}
                </p>
              </td>

              <!-- Gaji per pertemuan: format Rp -->
              <td>
                <input
                  type="text"
                  class="cell-input"
                  v-model="row.gajiDisplay"
                  @input="(onGajiInput(row), onRowChanged(index))"
                  :disabled="row.isSaved && !row.isEditing"
                  placeholder="Rp 50.000"
                />
              </td>

              <!-- Kontak Darurat -->
              <td>
                <input
                  type="text"
                  class="cell-input"
                  :class="{ 'cell-error': row.touched.darurat && teleponDaruratError(row) }"
                  v-model="row.kontakDarurat"
                  @input="onRowChanged(index)"
                  @focus="row.touched.darurat = true"
                  :disabled="row.isSaved && !row.isEditing"
                  placeholder="wa.me/62812xxxxxxx"
                />
                <p v-if="row.touched.darurat && teleponDaruratError(row)" class="cell-alert">
                  {{ teleponDaruratError(row) }}
                </p>
              </td>

              <!-- CV: dropdown -->
              <td>
                <select
                  class="cell-select"
                  v-model="row.cv"
                  @change="onRowChanged(index)"
                  :disabled="row.isSaved && !row.isEditing"
                >
                  <option value="">-</option>
                  <option value="Sudah">Sudah</option>
                  <option value="Belum">Belum</option>
                </select>
              </td>

              <!-- Pas Photo: dropdown -->
              <td>
                <select
                  class="cell-select"
                  v-model="row.pasPhoto"
                  @change="onRowChanged(index)"
                  :disabled="row.isSaved && !row.isEditing"
                >
                  <option value="">-</option>
                  <option value="Sudah">Sudah</option>
                  <option value="Belum">Belum</option>
                </select>
              </td>

              <!-- Surat Kontrak: dropdown -->
              <td>
                <select
                  class="cell-select"
                  v-model="row.suratKontrak"
                  @change="onRowChanged(index)"
                  :disabled="row.isSaved && !row.isEditing"
                >
                  <option value="">-</option>
                  <option value="Sudah">Sudah</option>
                  <option value="Belum">Belum</option>
                </select>
              </td>

              <!-- Habis Masa Kontrak: date picker -->
              <td>
                <input
                  type="date"
                  class="cell-input cell-date"
                  v-model="row.habisKontrak"
                  @change="onRowChanged(index)"
                  :disabled="row.isSaved && !row.isEditing"
                />
              </td>

              <!-- Hitungan Hari: auto-calculate, readonly -->
              <td>
                <span class="hitungan-hari" :class="hitunganHariClass(row.habisKontrak)">
                  {{ hitunganHariText(row.habisKontrak) }}
                </span>
              </td>

              <!-- Tombol Konfirmasi — muncul kalau semua kolom 1-14 sudah terisi -->
              <td class="col-confirm">
                <div v-if="isRowComplete(row) && !row.isSaved && !row._cancelledOnce" class="confirm-popup">
                  <p class="confirm-title">Data sudah benar?</p>
                  <div class="confirm-actions">
                    <button class="btn-confirm yes" @click="confirmSave(index)">Iya</button>
                    <button class="btn-confirm no" @click="confirmCancel(index)">Tidak</button>
                  </div>
                </div>

                <template v-if="row.isSaved">
                  <template v-if="row.isEditing">
                    <button class="btn-edit-simpan" :disabled="row.isUpdating" @click="simpanEdit(row)">
                      <Save size="1.15em" class="ikon-inline" /> Simpan
                    </button>
                    <button class="btn-edit-batal" :disabled="row.isUpdating" @click="batalEdit(row)">
                      Batal
                    </button>
                  </template>
                  <button v-else class="btn-reset-row" @click="mulaiEdit(row)"><Pencil size="1.15em" class="ikon-inline" /> Edit</button>
                </template>

                <button v-if="row.isSaved && !row.isEditing" class="btn-reset-row" @click="bukaReset(row)">
                  <KeyRound size="1.15em" class="ikon-inline" /> Reset Password
                </button>

                <button v-if="row.isSaved && !row.isEditing" class="btn-delete-row" @click="deleteRow(index)">
                  <Trash2 size="1.15em" class="ikon-inline" /> Hapus
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- ===== MODAL RESET PASSWORD ===== -->
    <div v-if="resetModal.buka" class="modal-overlay" @click.self="!resetModal.password && tutupReset()">
      <div class="modal-box">
        <template v-if="!resetModal.password">
          <p class="modal-title">Reset password {{ resetModal.nama }}?</p>
          <p class="modal-sub">
            Password lama langsung tidak bisa dipakai. Tentor akan diminta membuat password baru saat
            login.
          </p>
          <div class="modal-btn-row">
            <button class="modal-btn btn-belum" :disabled="resetModal.loading" @click="tutupReset">
              Batal
            </button>
            <button class="modal-btn btn-reset-ya" :disabled="resetModal.loading" @click="jalankanReset">
              Ya, Reset
            </button>
          </div>
        </template>
        <template v-else>
          <p class="modal-title">Password sementara</p>
          <p class="modal-sub">
            Kirim ke {{ resetModal.nama }} lewat WhatsApp. Password ini hanya tampil sekali dan tidak
            bisa dilihat lagi.
          </p>
          <p class="pw-sementara">{{ resetModal.password }}</p>
          <div class="modal-btn-row">
            <button class="modal-btn btn-belum" @click="salinPassword">
              <template v-if="resetModal.tersalin">
                <Check size="1.15em" class="ikon-inline" /> Tersalin
              </template>
              <template v-else>Salin</template>
            </button>
            <button class="modal-btn btn-reset-ya" @click="tutupReset">Selesai</button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, onMounted } from 'vue'
import { ApiError } from '@/api/http'
import { useTentorStore } from '@/stores/tentor'
import Navbar from '@/components/Navbar.vue'
import { Pencil, Save, KeyRound, Trash2, Check } from 'lucide-vue-next'

// ============================================
// Counter nomor urut global — hanya bertambah saat baris dikonfirmasi simpan
// ============================================
let savedCounter = 0
let rowIdCounter = 0

// ============================================
// Buat baris kosong baru
// ============================================
const createEmptyRow = () => ({
  rowId: rowIdCounter++,
  nama: '',
  panggilan: '',
  telepon: '',
  email: '',
  lulusan: '',
  alamat: '',
  kodeTentor: '',
  gajiDisplay: '',
  gajiRaw: 0,
  kontakDarurat: '',
  cv: '',
  pasPhoto: '',
  suratKontrak: '',
  habisKontrak: '',
  isSaved: false,
  savedNumber: null,
  isSaving: false,
  isEditing: false,
  isUpdating: false,
  cadangan: null,
  touched: {
    nama: false,
    panggilan: false,
    telepon: false,
    email: false,
    kode: false,
    darurat: false,
  },
})

const tentorStore = useTentorStore()

// State tabel — dimulai dengan 1 baris kosong; baris tersimpan dimuat dari server
const rows = reactive([createEmptyRow()])

onMounted(async () => {
  try {
    await Promise.all([tentorStore.fetchRows(), tentorStore.fetchKodeHistory()])
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) return // sesi habis, sudah dialihkan ke login
    alert(err instanceof ApiError ? err.message : 'Gagal memuat data tentor.')
    return
  }
  savedCounter = tentorStore.rows.length
  rows.splice(
    0,
    rows.length,
    ...tentorStore.rows.map((r, i) => ({
      ...createEmptyRow(),
      ...r,
      isSaved: true,
      savedNumber: i + 1,
    })),
    createEmptyRow(),
  )
})

// VALIDASI PER KOLOM
const namaError = (row) => {
  if (!row.nama) return 'Wajib diisi'
  if (!/^[a-zA-Z\s]+$/.test(row.nama)) return 'Hanya huruf & spasi'
  return ''
}
const panggilanError = (row) => {
  if (!row.panggilan) return 'Wajib diisi'
  if (!/^[a-zA-Z\s]+$/.test(row.panggilan)) return 'Hanya huruf & spasi'
  return ''
}
const teleponError = (row) => {
  if (!row.telepon) return 'Wajib diisi'
  if (!/^wa\.me\/62\d{8,13}$/.test(row.telepon)) return 'Format: wa.me/62812xxxxxxx'
  return ''
}
const teleponDaruratError = (row) => {
  if (!row.kontakDarurat) return 'Wajib diisi'
  if (!/^wa\.me\/62\d{8,13}$/.test(row.kontakDarurat)) return 'Format: wa.me/62812xxxxxxx'
  return ''
}
const emailError = (row) => {
  if (!row.email) return 'Wajib diisi'
  const regex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/
  if (!regex.test(row.email)) return 'Format email tidak valid'
  return ''
}
const kodeError = (row) => {
  if (!row.kodeTentor) return 'Wajib diisi'
  if (!/^[a-zA-Z0-9]+$/.test(row.kodeTentor)) return 'Tanpa spasi/simbol'
  if (!tentorStore.kodeSudahAda(row.kodeTentor)) return 'Kode belum di-generate di Dashboard'
  if (!row.isSaved && tentorStore.getByKode(row.kodeTentor)) return 'Kode sudah dipakai tentor lain'
  return ''
}

// ===== INPUT HANDLER: strip karakter saat mengetik =====
const onNamaInput = (row) => {
  row.nama = row.nama.replace(/[^a-zA-Z\s]/g, '')
}
const onPanggilanInput = (row) => {
  row.panggilan = row.panggilan.replace(/[^a-zA-Z\s]/g, '')
}
const onKodeInput = (row) => {
  row.kodeTentor = row.kodeTentor.replace(/[^a-zA-Z0-9]/g, '')
}

// ===== GAJI: format jadi "Rp 50.000" otomatis saat mengetik =====
const onGajiInput = (row) => {
  const angkaSaja = row.gajiDisplay.replace(/[^0-9]/g, '')
  row.gajiRaw = Number(angkaSaja) || 0
  row.gajiDisplay = angkaSaja ? 'Rp ' + Number(angkaSaja).toLocaleString('id-ID') : ''
}

// ============================================
// HITUNGAN HARI — real-time dari hari ini ke tanggal habis kontrak
// ============================================
const hitunganHariText = (tanggal) => {
  if (!tanggal) return '-'

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(tanggal)
  target.setHours(0, 0, 0, 0)

  const diffMs = target - today
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return 'HABIS'
  if (diffDays === 0) return 'HABIS HARI INI'
  return `${diffDays} HARI LAGI`
}

const hitunganHariClass = (tanggal) => {
  if (!tanggal) return ''
  const text = hitunganHariText(tanggal)
  if (text.includes('HABIS')) return 'text-danger'

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(tanggal)
  target.setHours(0, 0, 0, 0)
  const diffDays = Math.round((target - today) / (1000 * 60 * 60 * 24))

  if (diffDays <= 7) return 'text-warning'
  return 'text-safe'
}

// ============================================
// CEK APAKAH BARIS SUDAH LENGKAP (kolom 1-14 semua terisi & valid)
// ============================================
const isRowComplete = (row) => {
  return (
    !namaError(row) &&
    !panggilanError(row) &&
    !teleponError(row) &&
    !emailError(row) &&
    row.lulusan.trim() !== '' &&
    row.alamat.trim() !== '' &&
    !kodeError(row) &&
    row.gajiRaw > 0 &&
    !teleponDaruratError(row) &&
    row.cv !== '' &&
    row.pasPhoto !== '' &&
    row.suratKontrak !== '' &&
    row.habisKontrak !== ''
  )
}

// ============================================
// AUTO-ADD BARIS BARU — saat baris terakhir mulai diisi
// ============================================
const onRowChanged = (index) => {
  const isLastRow = index === rows.length - 1
  const row = rows[index]

  // Cek apakah baris ini sudah mulai diisi (minimal satu field tidak kosong)
  const hasContent =
    row.nama ||
    row.panggilan ||
    row.telepon ||
    row.email ||
    row.lulusan ||
    row.alamat ||
    row.kodeTentor ||
    row.gajiDisplay ||
    row.kontakDarurat ||
    row.cv ||
    row.pasPhoto ||
    row.suratKontrak ||
    row.habisKontrak

  if (isLastRow && hasContent) {
    rows.push(createEmptyRow())
  }
}

// ============================================
// KONFIRMASI SIMPAN
// ============================================
const confirmSave = async (index) => {
  const row = rows[index]
  if (row.isSaving) return
  row.isSaving = true
  try {
    await tentorStore.simpanTentor(row)
    savedCounter += 1
    row.isSaved = true
    row.savedNumber = savedCounter
  } catch (err) {
    alert(err instanceof ApiError ? err.message : 'Gagal menyimpan data tentor. Coba lagi.')
  } finally {
    row.isSaving = false
  }
}

const confirmCancel = (index) => {
  // Batal simpan — data di kolom TETAP ADA, hanya popup konfirmasi yang hilang.
  // Trik: toggle sebuah flag sementara supaya isRowComplete tetap true tapi popup tidak otomatis muncul lagi sampai ada perubahan baru di baris ini.
  const row = rows[index]
  row._cancelledOnce = true
}

const deleteRow = async (index) => {
  const yakin = confirm(
    'Yakin mau hapus data tentor ini? Akun login dan kodenya ikut terhapus. Riwayat presensi tetap tersimpan sebagai rekap.',
  )
  if (!yakin) return
  const row = rows[index]
  try {
    await tentorStore.hapusTentor(row.kodeTentor)
    const posisi = rows.indexOf(row)
    if (posisi !== -1) rows.splice(posisi, 1)
  } catch (err) {
    alert(err instanceof ApiError ? err.message : 'Gagal menghapus data tentor. Coba lagi.')
  }
}

// ============================================
// EDIT BARIS TERSIMPAN (Kode Tentor tidak bisa diubah)
// ============================================
const KOLOM_EDIT = [
  'nama',
  'panggilan',
  'telepon',
  'email',
  'lulusan',
  'alamat',
  'gajiDisplay',
  'gajiRaw',
  'kontakDarurat',
  'cv',
  'pasPhoto',
  'suratKontrak',
  'habisKontrak',
]

const mulaiEdit = (row) => {
  row.cadangan = Object.fromEntries(KOLOM_EDIT.map((k) => [k, row[k]]))
  row.isEditing = true
}

const batalEdit = (row) => {
  if (row.cadangan) Object.assign(row, row.cadangan)
  row.cadangan = null
  row.isEditing = false
  Object.keys(row.touched).forEach((k) => (row.touched[k] = false))
}

const simpanEdit = async (row) => {
  if (row.isUpdating) return
  if (!isRowComplete(row)) {
    Object.keys(row.touched).forEach((k) => (row.touched[k] = true))
    alert('Masih ada kolom yang kosong atau formatnya salah. Periksa kolom yang bertanda merah.')
    return
  }
  row.isUpdating = true
  try {
    await tentorStore.ubahTentor(row)
    row.cadangan = null
    row.isEditing = false
  } catch (err) {
    alert(err instanceof ApiError ? err.message : 'Gagal menyimpan perubahan. Coba lagi.')
  } finally {
    row.isUpdating = false
  }
}

// ============================================
// RESET PASSWORD TENTOR (password sementara tampil SATU KALI)
// ============================================
const resetModal = reactive({
  buka: false,
  kode: '',
  nama: '',
  password: '',
  loading: false,
  tersalin: false,
})

const bukaReset = (row) => {
  resetModal.buka = true
  resetModal.kode = row.kodeTentor
  resetModal.nama = row.nama
  resetModal.password = ''
  resetModal.tersalin = false
}

const tutupReset = () => {
  if (resetModal.loading) return
  resetModal.buka = false
  resetModal.password = '' // buang dari memori
}

const jalankanReset = async () => {
  if (resetModal.loading) return
  resetModal.loading = true
  try {
    resetModal.password = await tentorStore.resetPasswordTentor(resetModal.kode)
  } catch (err) {
    resetModal.buka = false
    if (err instanceof ApiError && err.status === 401) return
    alert(err instanceof ApiError ? err.message : 'Gagal reset password. Coba lagi.')
  } finally {
    resetModal.loading = false
  }
}

const salinPassword = async () => {
  try {
    await navigator.clipboard.writeText(resetModal.password)
    resetModal.tersalin = true
  } catch {
    alert('Tidak bisa menyalin otomatis. Salin manual dari kotak di atas.')
  }
}

// Override: popup tidak muncul lagi setelah "Tidak" ditekan,
// kecuali row diubah lagi (re-trigger lewat onRowChanged)
watch(
  () => rows.map((r) => JSON.stringify({ ...r, isSaved: undefined, savedNumber: undefined, isSaving: undefined, _cancelledOnce: undefined })),
  (newVal, oldVal) => {
    rows.forEach((row, i) => {
      if (oldVal && newVal[i] !== oldVal[i]) {
        row._cancelledOnce = false
      }
    })
  },
)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

* {
  font-family: 'DM Sans', sans-serif;
  box-sizing: border-box;
}

.data-tentor-page {
  width: 100%;
  min-height: 100vh;
  background: #f7f8fa;
}

.page-content {
  width: 100%;
  padding: 1.5rem 0 3rem; /* tanpa padding kiri-kanan, biar table-wrapper full width */
}

.page-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1.1rem;
  padding: 0 1rem;
  text-align: center;
}

/* ===== TABLE WRAPPER — full width, scroll horizontal seperti Excel ===== */
.table-wrapper {
  width: 100%;
  overflow-x: auto;
  border-radius: 0; /* full-bleed dari tepi ke tepi, tanpa rounded corner mepet layar */
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border-top: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
}

.sheet-table {
  border-collapse: collapse;
  width: 100%;
  min-width: 1700px; /* paksa scroll horizontal karena kolom banyak, persis kayak Excel */
  background: #fff;
}

.sheet-table th {
  background: #2e87f6;
  color: #fff;
  font-size: 0.76rem;
  font-weight: 700;
  padding: 0.65rem 0.55rem;
  text-align: left;
  white-space: nowrap;
  position: sticky;
  top: 0;
  z-index: 5;
}

.sheet-table td {
  border: 1px solid #e5e7eb;
  padding: 0.4rem;
  vertical-align: top;
  min-width: 130px;
}

.col-no {
  min-width: 50px;
  text-align: center;
  font-weight: 700;
  color: #2e87f6;
}
.col-confirm {
  min-width: 160px;
  position: relative;
}

.row-saved {
  background: #f0fdf4;
}

/* ===== INPUT CELL ===== */
.cell-input,
.cell-select {
  width: 100%;
  border: 1px solid transparent;
  background: transparent;
  padding: 0.4rem 0.3rem;
  font-size: 0.78rem;
  outline: none;
  border-radius: 6px;
  font-family: inherit;
}
.cell-input:focus,
.cell-select:focus {
  border-color: #2e87f6;
  background: #f0f7ff;
}
.cell-input:disabled,
.cell-select:disabled {
  background: transparent;
  color: #374151;
  cursor: default;
}
.cell-error {
  border-color: #f35c2b;
  background: #fff5f2;
}
.cell-date {
  font-size: 0.73rem;
}

.cell-alert {
  font-size: 0.64rem;
  color: #f35c2b;
  margin-top: 0.15rem;
  line-height: 1.2;
}

/* ===== HITUNGAN HARI ===== */
.hitungan-hari {
  display: inline-block;
  padding: 0.3rem 0.5rem;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 700;
  white-space: nowrap;
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

/* ===== POPUP KONFIRMASI ===== */
.confirm-popup {
  background: #fff;
  border: 1.5px solid #2e87f6;
  border-radius: 10px;
  padding: 0.6rem 0.7rem;
  box-shadow: 0 6px 18px rgba(46, 135, 246, 0.25);
  text-align: center;
}
.confirm-title {
  font-size: 0.7rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.4rem;
}
.confirm-actions {
  display: flex;
  gap: 0.4rem;
  justify-content: center;
}
.btn-confirm {
  flex: 1;
  padding: 0.3rem 0.5rem;
  border-radius: 6px;
  border: none;
  font-size: 0.7rem;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s;
}
.btn-confirm:hover {
  opacity: 0.85;
}
.btn-confirm.yes {
  background: #2e87f6;
  color: #fff;
}
.btn-confirm.no {
  background: #f3f4f6;
  color: #374151;
}

.btn-delete-row {
  width: 100%;
  padding: 0.28rem 0.45rem;
  border-radius: 6px;
  font-size: 0.66rem;
  line-height: 1.2;
  font-weight: 700;
  border: 1.5px solid #f35c2b;
  background: #fff;
  color: #f35c2b;
  cursor: pointer;
  transition:
    background 0.2s,
    color 0.2s;
}
.btn-delete-row:hover {
  background: #f35c2b;
  color: #fff;
}

.btn-reset-row {
  width: 100%;
  margin-bottom: 0.25rem;
  padding: 0.28rem 0.45rem;
  border-radius: 6px;
  font-size: 0.66rem;
  line-height: 1.2;
  font-weight: 700;
  border: 1.5px solid #2e87f6;
  background: #fff;
  color: #2e87f6;
  cursor: pointer;
  transition:
    background 0.2s,
    color 0.2s;
}
.btn-reset-row:hover {
  background: #2e87f6;
  color: #fff;
}

/* ===== MODE EDIT BARIS TERSIMPAN ===== */
.row-editing {
  background: #fffbeb;
}
.row-editing .cell-input:not(:disabled),
.row-editing .cell-select:not(:disabled) {
  border-color: #d1d5db;
  background: #fff;
}
.btn-edit-simpan,
.btn-edit-batal {
  width: 100%;
  padding: 0.28rem 0.45rem;
  border-radius: 6px;
  font-size: 0.66rem;
  line-height: 1.2;
  font-weight: 700;
  cursor: pointer;
}
.btn-edit-simpan {
  margin-bottom: 0.25rem;
  border: none;
  background: #22a559;
  color: #fff;
}
.btn-edit-batal {
  border: 1.5px solid #9ca3af;
  background: #fff;
  color: #4b5563;
}
.btn-edit-simpan:disabled,
.btn-edit-batal:disabled {
  opacity: 0.6;
  cursor: default;
}

/* ===== MODAL RESET PASSWORD ===== */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
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
  max-width: 360px;
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
  margin: 0 0 1rem;
  line-height: 1.5;
}
.pw-sementara {
  font-family: monospace;
  font-size: 1.3rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #1f2937;
  background: #f3f4f6;
  border-radius: 10px;
  padding: 0.75rem;
  margin: 0 0 1rem;
  user-select: all;
}
.modal-btn-row {
  display: flex;
  gap: 0.75rem;
}
.modal-btn {
  flex: 1;
  padding: 0.65rem;
  border-radius: 10px;
  border: none;
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
}
.modal-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.btn-belum {
  background: #f3f4f6;
  color: #374151;
}
.btn-reset-ya {
  background: #2e87f6;
  color: #fff;
}

.ikon-inline {
  display: inline-block;
  vertical-align: -0.18em;
  margin-right: 0.2rem;
}

/* =====================================================
   BREAKPOINTS (sama seperti file-file lain)
   @media 641px  : tablet
   @media 768px  : desktop
   @media 1024px : large desktop
   ===================================================== */

/* ===== TABLET (≥ 641px) ===== */
@media (min-width: 641px) {
  .page-content {
    padding: 1.75rem 0 3rem;
  }
  .page-title {
    font-size: 1.25rem;
    margin-bottom: 1.2rem;
    padding: 0 1.25rem;
  }

  .sheet-table th {
    font-size: 0.8rem;
    padding: 0.75rem 0.65rem;
  }
  .sheet-table td {
    padding: 0.45rem;
  }
  .cell-input,
  .cell-select {
    font-size: 0.82rem;
  }
  .cell-alert {
    font-size: 0.66rem;
  }
  .hitungan-hari {
    font-size: 0.74rem;
  }
  .confirm-title {
    font-size: 0.74rem;
  }
  .btn-confirm {
    font-size: 0.74rem;
  }
  .btn-reset-row,
  .btn-delete-row,
  .btn-edit-simpan,
  .btn-edit-batal {
    font-size: 0.68rem;
  }
}

/* ===== DESKTOP (≥ 768px) ===== */
@media (min-width: 768px) {
  .page-content {
    padding: 2rem 0 3.25rem;
  }
  .page-title {
    font-size: 1.3rem;
    margin-bottom: 1.25rem;
    padding: 0 1.5rem;
  }

  .sheet-table th {
    font-size: 0.84rem;
    padding: 0.8rem 0.7rem;
  }
  .sheet-table td {
    padding: 0.5rem;
  }
  .cell-input,
  .cell-select {
    font-size: 0.86rem;
  }
  .hitungan-hari {
    font-size: 0.76rem;
  }

  .btn-reset-row,
  .btn-delete-row,
  .btn-edit-simpan,
  .btn-edit-batal {
    font-size: 0.7rem;
  }
}

/* ===== LARGE DESKTOP (≥ 1024px) ===== */
@media (min-width: 1024px) {
  .page-content {
    padding: 2.25rem 0 3.5rem;
  }
  .page-title {
    font-size: 1.4rem;
    margin-bottom: 1.4rem;
    padding: 0 2.5rem;
  }

  .sheet-table th {
    font-size: 0.86rem;
    padding: 0.85rem 0.75rem;
  }
  .sheet-table td {
    padding: 0.55rem;
  }
  .cell-input,
  .cell-select {
    font-size: 0.88rem;
  }
  .cell-alert {
    font-size: 0.68rem;
  }
  .confirm-title {
    font-size: 0.76rem;
  }
  .btn-confirm {
    font-size: 0.76rem;
  }
  .btn-reset-row,
  .btn-delete-row,
  .btn-edit-simpan,
  .btn-edit-batal {
    font-size: 0.72rem;
  }
}
</style>
