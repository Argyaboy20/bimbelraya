<!-- DataWaliMurid.vue -->
<template>
  <div class="data-walimurid-page">
    <Navbar />

    <div class="page-content">
      <h1 class="page-title">Data Walimurid Bimbel Raya</h1>

      <div class="content-layout">

        <!-- ===== TABEL UTAMA (scroll horizontal) ===== -->
        <div class="table-wrapper">
          <table class="sheet-table">
            <thead>
              <tr>
                <th class="col-no">No</th>
                <th>Kode Walimurid</th>
                <th>Nama Walimurid</th>
                <th>Kelas</th>
                <th>Asal Sekolah</th>
                <th>Alamat</th>
                <th>Paket/Minggu</th>
                <th>Hari Pertemuan</th>
                <th>Jam (WIB)</th>
                <th>Kode Tentor</th>
                <th>Guru</th>
                <th>Mapel</th>
                <th>Harga</th>
                <th>Status</th>
                <th class="col-confirm"></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, index) in rows"
                :key="row.rowId"
                :class="{ 'row-saved': row.isSaved }"
              >
                <!-- Nomor — hanya tampil setelah baris dikonfirmasi -->
                <td class="col-no">
                  <span v-if="row.isSaved">{{ row.savedNumber }}</span>
                </td>

                <!-- Kode Walimurid: huruf & angka, tanpa spasi -->
                <td>
                  <input
                    type="text"
                    class="cell-input"
                    :class="{ 'cell-error': row.touched.kodeWali && kodeWaliError(row) }"
                    v-model="row.kodeWali"
                    @input="onKodeWaliInput(row); onRowChanged(index)"
                    @focus="row.touched.kodeWali = true"
                    :disabled="row.isSaved"
                    placeholder="Contoh: WM1001"
                  />
                  <p v-if="row.touched.kodeWali && kodeWaliError(row)" class="cell-alert">{{ kodeWaliError(row) }}</p>
                </td>

                <!-- Nama Walimurid: huruf & spasi -->
                <td>
                  <input
                    type="text"
                    class="cell-input"
                    :class="{ 'cell-error': row.touched.nama && namaError(row) }"
                    v-model="row.nama"
                    @input="onNamaInput(row); onRowChanged(index)"
                    @focus="row.touched.nama = true"
                    :disabled="row.isSaved"
                    placeholder="Nama lengkap"
                  />
                  <p v-if="row.touched.nama && namaError(row)" class="cell-alert">{{ namaError(row) }}</p>
                </td>

                <!-- Kelas: huruf & angka -->
                <td>
                  <input
                    type="text"
                    class="cell-input"
                    v-model="row.kelas"
                    @input="onRowChanged(index)"
                    :disabled="row.isSaved"
                    placeholder="Contoh: 6 SD"
                  />
                </td>

                <!-- Asal Sekolah: huruf, angka, simbol -->
                <td>
                  <input
                    type="text"
                    class="cell-input"
                    v-model="row.asalSekolah"
                    @input="onRowChanged(index)"
                    :disabled="row.isSaved"
                    placeholder="Nama sekolah"
                  />
                </td>

                <!-- Alamat: huruf, angka, simbol -->
                <td>
                  <input
                    type="text"
                    class="cell-input"
                    v-model="row.alamat"
                    @input="onRowChanged(index)"
                    :disabled="row.isSaved"
                    placeholder="Alamat lengkap"
                  />
                </td>

                <!-- Paket/minggu: hanya angka -->
                <td>
                  <input
                    type="text"
                    class="cell-input"
                    :class="{ 'cell-error': row.touched.paket && paketError(row) }"
                    v-model="row.paket"
                    @input="onPaketInput(row); onRowChanged(index)"
                    @focus="row.touched.paket = true"
                    :disabled="row.isSaved"
                    placeholder="Contoh: 2"
                  />
                  <p v-if="row.touched.paket && paketError(row)" class="cell-alert">{{ paketError(row) }}</p>
                </td>

                <!-- Hari pertemuan: huruf & simbol -->
                <td>
                  <input
                    type="text"
                    class="cell-input"
                    v-model="row.hariPertemuan"
                    @input="onRowChanged(index)"
                    :disabled="row.isSaved"
                    placeholder="Senin & Kamis"
                  />
                </td>

                <!-- Jam (WIB): angka & simbol -->
                <td>
                  <input
                    type="text"
                    class="cell-input"
                    :class="{ 'cell-error': row.touched.jam && jamError(row) }"
                    v-model="row.jam"
                    @input="onJamInput(row); onRowChanged(index)"
                    @focus="row.touched.jam = true"
                    :disabled="row.isSaved"
                    placeholder="16:00-17:30"
                  />
                  <p v-if="row.touched.jam && jamError(row)" class="cell-alert">{{ jamError(row) }}</p>
                </td>

                <!-- Kode Tentor: huruf & angka -->
                <td>
                  <input
                    type="text"
                    class="cell-input"
                    :class="{ 'cell-error': row.touched.kodeTentor && kodeTentorError(row) }"
                    v-model="row.kodeTentor"
                    @input="onKodeTentorInput(row); onRowChanged(index)"
                    @focus="row.touched.kodeTentor = true"
                    :disabled="row.isSaved"
                    placeholder="Contoh: TR1001"
                  />
                  <p v-if="row.touched.kodeTentor && kodeTentorError(row)" class="cell-alert">{{ kodeTentorError(row) }}</p>
                </td>

                <!-- Guru: huruf & spasi -->
                <td>
                  <input
                    type="text"
                    class="cell-input"
                    v-model="row.guru"
                    @input="onGuruInput(row); onRowChanged(index)"
                    :disabled="row.isSaved"
                    placeholder="Nama tentor"
                  />
                </td>

                <!-- Mapel: huruf, angka, simbol -->
                <td>
                  <input
                    type="text"
                    class="cell-input"
                    v-model="row.mapel"
                    @input="onRowChanged(index)"
                    :disabled="row.isSaved"
                    placeholder="Matematika"
                  />
                </td>

                <!-- Harga: format Rp -->
                <td>
                  <input
                    type="text"
                    class="cell-input"
                    v-model="row.hargaDisplay"
                    @input="onHargaInput(row); onRowChanged(index)"
                    :disabled="row.isSaved"
                    placeholder="Rp 500.000"
                  />
                </td>

                <!-- Status: dropdown -->
                <td>
                  <select
                    class="cell-select"
                    v-model="row.status"
                    @change="onRowChanged(index)"
                    :disabled="row.isSaved"
                  >
                    <option value="">-</option>
                    <option value="Berlangsung">Berlangsung</option>
                    <option value="Jeda">Jeda</option>
                    <option value="Berhenti">Berhenti</option>
                  </select>
                </td>

                <!-- Tombol konfirmasi / hapus -->
                <td class="col-confirm">
                  <div v-if="isRowComplete(row) && !row.isSaved" class="confirm-popup">
                    <p class="confirm-title">Data sudah benar?</p>
                    <div class="confirm-actions">
                      <button class="btn-confirm yes" @click="confirmSave(index)">Iya</button>
                      <button class="btn-confirm no" @click="confirmCancel(index)">Tidak</button>
                    </div>
                  </div>

                  <button v-if="row.isSaved" class="btn-delete-row" @click="deleteRow(index)">
                    🗑️ Hapus
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- ===== TABEL RINGKASAN STATUS — terpisah, auto-hitung ===== -->
        <div class="summary-wrapper">
          <table class="summary-table">
            <thead>
              <tr>
                <th>Perhitungan Status</th>
              </tr>
            </thead>
            <tbody>
              <tr class="summary-header-row">
                <td class="summary-label-row">
                  <span class="summary-tag berlangsung">Berlangsung</span>
                  <span class="summary-tag jeda">Jeda</span>
                  <span class="summary-tag berhenti">Berhenti</span>
                  <span class="summary-tag total">Total</span>
                </td>
              </tr>
              <tr>
                <td class="summary-value-row">
                  <span class="summary-number berlangsung">{{ statusCount.berlangsung }}</span>
                  <span class="summary-number jeda">{{ statusCount.jeda }}</span>
                  <span class="summary-number berhenti">{{ statusCount.berhenti }}</span>
                  <span class="summary-number total">{{ statusCount.total }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue'
import Navbar from '@/components/Navbar.vue'

let savedCounter = 0
let rowIdCounter = 0

// ============================================
// Buat baris kosong baru
// ============================================
const createEmptyRow = () => ({
  rowId: rowIdCounter++,
  kodeWali: '',
  nama: '',
  kelas: '',
  asalSekolah: '',
  alamat: '',
  paket: '',
  hariPertemuan: '',
  jam: '',
  kodeTentor: '',
  guru: '',
  mapel: '',
  hargaDisplay: '',
  hargaRaw: 0,
  status: '',
  isSaved: false,
  savedNumber: null,
  touched: {
    kodeWali: false,
    nama: false,
    paket: false,
    jam: false,
    kodeTentor: false
  }
})

const rows = reactive([createEmptyRow()])

// ============================================
// VALIDASI PER KOLOM
// ============================================
const kodeWaliError = (row) => {
  if (!row.kodeWali) return 'Wajib diisi'
  if (!/^[a-zA-Z0-9]+$/.test(row.kodeWali)) return 'Tanpa spasi/simbol'
  return ''
}
const namaError = (row) => {
  if (!row.nama) return 'Wajib diisi'
  if (!/^[a-zA-Z\s]+$/.test(row.nama)) return 'Hanya huruf & spasi'
  return ''
}
const paketError = (row) => {
  if (!row.paket) return 'Wajib diisi'
  if (!/^[0-9]+$/.test(row.paket)) return 'Hanya angka'
  return ''
}
const jamError = (row) => {
  if (!row.jam) return 'Wajib diisi'
  if (!/^[0-9:\-–\s]+$/.test(row.jam)) return 'Hanya angka & simbol'
  return ''
}
const kodeTentorError = (row) => {
  if (!row.kodeTentor) return 'Wajib diisi'
  if (!/^[a-zA-Z0-9]+$/.test(row.kodeTentor)) return 'Tanpa spasi/simbol'
  return ''
}

// ===== INPUT HANDLER: strip karakter saat mengetik =====
const onKodeWaliInput = (row) => {
  row.kodeWali = row.kodeWali.replace(/[^a-zA-Z0-9]/g, '')
}
const onNamaInput = (row) => {
  row.nama = row.nama.replace(/[^a-zA-Z\s]/g, '')
}
const onPaketInput = (row) => {
  row.paket = row.paket.replace(/[^0-9]/g, '')
}
const onJamInput = (row) => {
  row.jam = row.jam.replace(/[^0-9:\-–\s]/g, '')
}
const onKodeTentorInput = (row) => {
  row.kodeTentor = row.kodeTentor.replace(/[^a-zA-Z0-9]/g, '')
}
const onGuruInput = (row) => {
  row.guru = row.guru.replace(/[^a-zA-Z\s]/g, '')
}

// ===== HARGA: format jadi "Rp 500.000" otomatis saat mengetik =====
const onHargaInput = (row) => {
  const angkaSaja = row.hargaDisplay.replace(/[^0-9]/g, '')
  row.hargaRaw = Number(angkaSaja) || 0
  row.hargaDisplay = angkaSaja
    ? 'Rp ' + Number(angkaSaja).toLocaleString('id-ID')
    : ''
}

// ============================================
// CEK APAKAH BARIS SUDAH LENGKAP (semua 14 kolom terisi & valid)
// ============================================
const isRowComplete = (row) => {
  return (
    !kodeWaliError(row) &&
    !namaError(row) &&
    row.kelas.trim() !== '' &&
    row.asalSekolah.trim() !== '' &&
    row.alamat.trim() !== '' &&
    !paketError(row) &&
    row.hariPertemuan.trim() !== '' &&
    !jamError(row) &&
    !kodeTentorError(row) &&
    row.guru.trim() !== '' &&
    row.mapel.trim() !== '' &&
    row.hargaRaw > 0 &&
    row.status !== ''
  )
}

// ============================================
// AUTO-ADD BARIS BARU
// ============================================
const onRowChanged = (index) => {
  const isLastRow = index === rows.length - 1
  const row = rows[index]

  const hasContent =
    row.kodeWali || row.nama || row.kelas || row.asalSekolah ||
    row.alamat || row.paket || row.hariPertemuan || row.jam ||
    row.kodeTentor || row.guru || row.mapel || row.hargaDisplay || row.status

  if (isLastRow && hasContent) {
    rows.push(createEmptyRow())
  }
}

// ============================================
// KONFIRMASI SIMPAN / BATAL / HAPUS
// ============================================
const confirmSave = (index) => {
  const row = rows[index]
  savedCounter += 1
  row.isSaved = true
  row.savedNumber = savedCounter

  // ============================================
  // Nanti diganti dengan API call sungguhan, contoh:
  // await fetch('/api/admin/walimurid', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ ...row })
  // })
  // ============================================
  console.log('Data walimurid tersimpan:', { ...row })
}

const confirmCancel = (index) => {
  // Popup hilang, data di kolom tetap ada, tidak tersimpan
  rows[index]._cancelledOnce = true
}

const deleteRow = (index) => {
  const yakin = confirm('Yakin mau hapus data walimurid ini?')
  if (!yakin) return

  // ============================================
  // Nanti diganti dengan API call sungguhan:
  // await fetch(`/api/admin/walimurid/${row.kodeWali}`, { method: 'DELETE' })
  // ============================================
  rows.splice(index, 1)
}

// ============================================
// PERHITUNGAN STATUS — otomatis hitung dari kolom Status semua baris
// yang sudah tersimpan (isSaved), persis seperti rumus COUNTIF di Excel
// ============================================
const statusCount = computed(() => {
  const savedRows = rows.filter((r) => r.isSaved)
  const berlangsung = savedRows.filter((r) => r.status === 'Berlangsung').length
  const jeda = savedRows.filter((r) => r.status === 'Jeda').length
  const berhenti = savedRows.filter((r) => r.status === 'Berhenti').length

  return {
    berlangsung,
    jeda,
    berhenti,
    total: berlangsung + jeda + berhenti
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

* {
  font-family: 'DM Sans', sans-serif;
  box-sizing: border-box;
}

/* =====================================================
   MOBILE (default, < 641px) — table & summary jadi 2 baris,
   masing-masing full width tanpa space kiri-kanan
   ===================================================== */
.data-walimurid-page {
  width: 100%;
  min-height: 100vh;
  background: #f7f8fa;
}

.page-content {
  width: 100%;
  padding: 1.5rem 0 3rem; /* tanpa padding kiri-kanan, biar wrapper full width */
}

.page-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1.1rem;
  padding: 0 1rem; /* jarak dari tepi khusus judul */
  text-align: center; /* rata tengah */
}

/* ===== LAYOUT: mobile = 2 baris (table di atas, summary di bawah) ===== */
.content-layout {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  width: 100%;
}

/* ===== TABEL UTAMA — full width, scroll horizontal seperti Excel ===== */
.table-wrapper {
  width: 100%;
  overflow-x: auto;
  border-radius: 0;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  border-top: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
}

.sheet-table {
  border-collapse: collapse;
  width: 100%;
  min-width: 1650px;
  background: #fff;
}

.sheet-table th {
  background: #2E87F6;
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
  min-width: 120px;
}

.col-no {
  min-width: 50px;
  text-align: center;
  font-weight: 700;
  color: #2E87F6;
}
.col-confirm {
  min-width: 160px;
}

.row-saved {
  background: #f0fdf4;
}

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
  border-color: #2E87F6;
  background: #f0f7ff;
}
.cell-input:disabled,
.cell-select:disabled {
  background: transparent;
  color: #374151;
  cursor: default;
}
.cell-error {
  border-color: #F35C2B;
  background: #fff5f2;
}
.cell-alert {
  font-size: 0.64rem;
  color: #F35C2B;
  margin-top: 0.15rem;
  line-height: 1.2;
}

/* ===== POPUP KONFIRMASI ===== */
.confirm-popup {
  background: #fff;
  border: 1.5px solid #2E87F6;
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
  background: #2E87F6;
  color: #fff;
}
.btn-confirm.no {
  background: #f3f4f6;
  color: #374151;
}

.btn-delete-row {
  width: 100%;
  padding: 0.4rem 0.6rem;
  border-radius: 8px;
  border: 1.5px solid #F35C2B;
  background: #fff;
  color: #F35C2B;
  font-size: 0.72rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.btn-delete-row:hover {
  background: #F35C2B;
  color: #fff;
}

/* ===== TABEL RINGKASAN STATUS — mobile: baris ke-2, full width ===== */
.summary-wrapper {
  width: 100%;
}

.summary-table {
  border-collapse: collapse;
  width: 100%;
  background: #fff;
  border-radius: 0;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  border-top: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
}

.summary-table thead th {
  background: #F35C2B;
  color: #fff;
  font-size: 0.82rem;
  font-weight: 700;
  padding: 0.65rem 0.9rem;
  text-align: left;
}

.summary-label-row,
.summary-value-row {
  display: flex;
  padding: 0.65rem 0.9rem;
}

.summary-label-row {
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
}

.summary-tag,
.summary-number {
  flex: 1;
  text-align: center;
  font-size: 0.72rem;
}

.summary-tag {
  font-weight: 600;
  color: #374151;
}
.summary-tag.berlangsung { color: #15803d; }
.summary-tag.jeda { color: #a16207; }
.summary-tag.berhenti { color: #b91c1c; }
.summary-tag.total { color: #2E87F6; }

.summary-number {
  font-size: 1.2rem;
  font-weight: 700;
}
.summary-number.berlangsung { color: #15803d; }
.summary-number.jeda { color: #a16207; }
.summary-number.berhenti { color: #b91c1c; }
.summary-number.total { color: #2E87F6; }

/* =====================================================
   BREAKPOINTS
   @media 641px  : tablet  → table & summary sejajar (2 kolom), rapat, full width
   @media 768px  : desktop
   @media 1024px : large desktop
   ===================================================== */

/* ===== TABLET (≥ 641px) — mulai sejajar, rapat, tanpa space kiri-kanan ===== */
@media (min-width: 641px) {
  .page-content {
    padding: 1.75rem 0 3rem;
  }
  .page-title {
    font-size: 1.25rem;
    margin-bottom: 1.2rem;
    padding: 0 1.25rem;
  }

  .content-layout {
    flex-direction: row;
    align-items: flex-start;
    gap: 0; /* rapat, tidak ada jarak antara table & summary */
  }
  .table-wrapper {
    flex: 1;
    min-width: 0; /* biar tetap bisa scroll internal, tidak mendorong summary keluar */
  }
  .summary-wrapper {
    width: 220px;
    flex-shrink: 0;
    border-left: 1px solid #e5e7eb; /* pembatas visual, bukan jarak/gap */
  }
  .summary-label-row,
  .summary-value-row {
    flex-direction: column;
    gap: 0.4rem;
    padding: 0.65rem 0.75rem;
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
  .summary-table thead th {
    font-size: 0.85rem;
  }
  .summary-number {
    font-size: 1.3rem;
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

  .summary-wrapper {
    width: 270px;
  }
  .summary-label-row,
  .summary-value-row {
    padding: 0.75rem 1rem;
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
  .summary-table thead th {
    font-size: 0.88rem;
    padding: 0.75rem 1rem;
  }
  .summary-number {
    font-size: 1.4rem;
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

  .summary-wrapper {
    width: 320px;
  }
  .summary-label-row,
  .summary-value-row {
    gap: 0.5rem;
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
  .btn-delete-row {
    font-size: 0.78rem;
  }
  .summary-table thead th {
    font-size: 0.9rem;
  }
  .summary-number {
    font-size: 1.45rem;
  }
}
</style>