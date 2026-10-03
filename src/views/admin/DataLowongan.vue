<!-- DataLowongan.vue -->
<template>
  <div class="data-lowongan-page">
    <Navbar />

    <div class="page-content">
      <h1 class="page-title">Data Lowongan Tentor Bimbel Raya</h1>
      <p class="page-note">
        Lowongan yang sudah dikonfirmasi otomatis tampil di halaman publik
        <router-link to="/lowongan" class="note-link">/lowongan</router-link>.
      </p>

      <div class="table-wrapper">
        <table class="sheet-table">
          <thead>
            <tr>
              <th class="col-no">No</th>
              <th v-for="kolom in KOLOM_LOWONGAN" :key="kolom.key">{{ kolom.label }}</th>
              <th>Guru (P/L)</th>
              <th>Status</th>
              <th class="col-confirm"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in rows" :key="row.rowId" :class="{ 'row-saved': row.isSaved }">
              <!-- Nomor: hanya tampil setelah baris dikonfirmasi, urut sesuai posisi -->
              <td class="col-no">
                <span v-if="row.isSaved">{{ nomorUrut(index) }}</span>
              </td>

              <!-- 8 kolom teks (Kelas s/d Request Mapel) -->
              <td v-for="kolom in KOLOM_LOWONGAN" :key="kolom.key">
                <input
                  type="text"
                  class="cell-input"
                  :class="{ 'cell-error': isKosong(row, kolom.key) }"
                  v-model="row[kolom.key]"
                  :disabled="row.isSaved"
                  :placeholder="kolom.placeholder"
                  @input="onFieldInput(index)"
                  @blur="row.touched[kolom.key] = true"
                />
                <p v-if="isKosong(row, kolom.key)" class="cell-alert">Wajib diisi</p>
              </td>

              <!-- Guru (P/L) -->
              <td>
                <select
                  class="cell-select"
                  v-model="row.guru"
                  :disabled="row.isSaved"
                  @change="onFieldInput(index)"
                >
                  <option value="">-</option>
                  <option value="P">P (Perempuan)</option>
                  <option value="L">L (Laki-laki)</option>
                  <option value="P/L">P/L (Bebas)</option>
                </select>
              </td>

              <!-- Status: tetap bisa diubah walau baris sudah tersimpan -->
              <td>
                <select
                  class="cell-select cell-status"
                  :class="row.status === 'Tersedia' ? 'status-tersedia' : 'status-diambil'"
                  v-model="row.status"
                  @change="onStatusChange(index)"
                >
                  <option v-for="s in STATUS_LOWONGAN" :key="s" :value="s">{{ s }}</option>
                </select>
              </td>

              <!-- Konfirmasi / Hapus -->
              <td class="col-confirm">
                <div
                  v-if="isRowComplete(row) && !row.isSaved && !row.dismissed"
                  class="confirm-popup"
                >
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
    </div>
  </div>
</template>

<script setup>
defineOptions({ name: 'DataLowongan' })
import { reactive } from 'vue'
import Navbar from '@/components/Navbar.vue'
import { useLowonganStore, KOLOM_LOWONGAN, STATUS_LOWONGAN } from '@/stores/lowongan'

const lowonganStore = useLowonganStore()

let rowIdCounter = 0
const newId = () => `${Date.now()}-${Math.floor(Math.random() * 1000000)}`

// ===== Buat baris kosong baru =====
const createEmptyRow = () => ({
  rowId: rowIdCounter++, // key untuk v-for
  id: newId(), // id unik, jadi penghubung dengan data di store
  ...Object.fromEntries(KOLOM_LOWONGAN.map((k) => [k.key, ''])),
  guru: '',
  status: 'Tersedia',
  isSaved: false,
  dismissed: false, // true setelah admin tekan "Tidak" (popup disembunyikan)
  touched: {}
})

// ============================================
// Saat halaman dibuka, baris yang sudah tersimpan di store ikut
// ditampilkan lagi (supaya tidak "hilang" dari tampilan admin saat
// pindah halaman), lalu ditutup dengan 1 baris kosong untuk input baru.
// ============================================
const rows = reactive([
  ...lowonganStore.items.map((item) => ({ ...createEmptyRow(), ...item, isSaved: true })),
  createEmptyRow()
])

// ===== Nomor urut: hitung posisi di antara baris yang sudah tersimpan =====
const nomorUrut = (index) => rows.slice(0, index + 1).filter((r) => r.isSaved).length

// ===== Validasi =====
const isKosong = (row, key) => !row.isSaved && row.touched[key] && !row[key].trim()

const isRowComplete = (row) => {
  return (
    KOLOM_LOWONGAN.every((k) => row[k.key].trim() !== '') && row.guru !== '' && row.status !== ''
  )
}

// ===== AUTO-ADD baris baru saat baris terakhir mulai diisi =====
const onFieldInput = (index) => {
  const row = rows[index]
  row.dismissed = false // ada perubahan → popup konfirmasi boleh muncul lagi

  const hasContent = KOLOM_LOWONGAN.some((k) => row[k.key].trim() !== '') || row.guru !== ''
  if (index === rows.length - 1 && hasContent) {
    rows.push(createEmptyRow())
  }
}

// ===== Data bersih yang disimpan ke store =====
const toItem = (row) => ({
  id: row.id,
  ...Object.fromEntries(KOLOM_LOWONGAN.map((k) => [k.key, row[k.key].trim()])),
  guru: row.guru,
  status: row.status
})

// ===== KONFIRMASI "Iya" → simpan, otomatis tampil di halaman publik =====
const confirmSave = (index) => {
  const row = rows[index]
  row.isSaved = true
  lowonganStore.addLowongan(toItem(row))
}

// ===== KONFIRMASI "Tidak" → popup hilang, isian tetap ada, tidak tersimpan =====
const confirmCancel = (index) => {
  rows[index].dismissed = true
}

// ===== Ganti status: kalau baris sudah tersimpan, ikut diperbarui di store =====
const onStatusChange = (index) => {
  const row = rows[index]
  if (row.isSaved) {
    lowonganStore.updateStatus(row.id, row.status)
  }
}

// ===== HAPUS baris (hilang juga dari halaman publik) =====
const deleteRow = (index) => {
  const yakin = confirm('Yakin mau hapus lowongan ini?')
  if (!yakin) return
  lowonganStore.removeLowongan(rows[index].id)
  rows.splice(index, 1)
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

* {
  font-family: 'DM Sans', sans-serif;
  box-sizing: border-box;
}

.data-lowongan-page {
  width: 100%;
  min-height: 100vh;
  background: #f7f8fa;
}

.page-content {
  width: 100%;
  padding: 1.5rem 0 3rem;
}

.page-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.35rem;
  padding: 0 1rem;
  text-align: center;
}
.page-note {
  font-size: 0.74rem;
  color: #6b7280;
  text-align: center;
  margin: 0 0 1.1rem;
  padding: 0 1rem;
}
.note-link {
  color: #2e87f6;
  font-weight: 600;
  text-decoration: none;
}
.note-link:hover {
  text-decoration: underline;
}

/* ===== TABEL — full width, scroll horizontal seperti Excel ===== */
.table-wrapper {
  width: 100%;
  overflow-x: auto;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border-top: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
}

.sheet-table {
  border-collapse: collapse;
  width: 100%;
  min-width: 1500px;
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
.cell-alert {
  font-size: 0.64rem;
  color: #f35c2b;
  margin: 0.15rem 0 0;
  line-height: 1.2;
}

/* ===== STATUS ===== */
.cell-status {
  font-weight: 700;
  cursor: pointer;
}
.status-tersedia {
  color: #15803d;
}
.status-diambil {
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
  margin: 0 0 0.4rem;
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
  padding: 0.4rem 0.6rem;
  border-radius: 8px;
  border: 1.5px solid #f35c2b;
  background: #fff;
  color: #f35c2b;
  font-size: 0.72rem;
  font-weight: 700;
  cursor: pointer;
  transition:
    background 0.2s,
    color 0.2s;
}
.btn-delete-row:hover {
  background: #f35c2b;
  color: #fff;
}

/* =====================================================
   BREAKPOINTS
   @media 641px  : tablet
   @media 768px  : desktop
   @media 1024px : large desktop
   ===================================================== */

@media (min-width: 641px) {
  .page-content {
    padding: 1.75rem 0 3rem;
  }
  .page-title {
    font-size: 1.25rem;
    padding: 0 1.25rem;
  }
  .page-note {
    font-size: 0.78rem;
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
  .confirm-title,
  .btn-confirm {
    font-size: 0.74rem;
  }
  .btn-delete-row {
    font-size: 0.76rem;
  }
}

@media (min-width: 768px) {
  .page-content {
    padding: 2rem 0 3.25rem;
  }
  .page-title {
    font-size: 1.3rem;
    padding: 0 1.5rem;
  }
  .page-note {
    font-size: 0.82rem;
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
}

@media (min-width: 1024px) {
  .page-content {
    padding: 2.25rem 0 3.5rem;
  }
  .page-title {
    font-size: 1.4rem;
    padding: 0 2.5rem;
  }
  .page-note {
    font-size: 0.86rem;
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
  .confirm-title,
  .btn-confirm {
    font-size: 0.76rem;
  }
  .btn-delete-row {
    font-size: 0.78rem;
  }
}
</style>