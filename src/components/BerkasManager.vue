<!-- BerkasManager.vue: tampilan folder dan file bergaya Drive. Dipakai halaman admin dan tentor. -->
<template>
  <div class="berkas">
    <!-- ===== BAR ATAS: jalur folder + tombol (admin) ===== -->
    <div class="bar-atas">
      <nav class="jalur" aria-label="Jalur folder">
        <button type="button" class="jalur-item" :class="{ aktif: !folderId }" @click="bukaFolder(null)">
          Berkas
        </button>
        <template v-for="(j, i) in isi?.jalur ?? []" :key="j.id">
          <ChevronRight class="jalur-panah" size="1em" />
          <button
            type="button"
            class="jalur-item"
            :class="{ aktif: i === (isi?.jalur.length ?? 0) - 1 }"
            @click="bukaFolder(j.id)"
          >
            {{ j.nama }}
          </button>
        </template>
      </nav>

      <div v-if="admin" class="tombol-admin">
        <button type="button" class="btn btn-garis" @click="bukaModal('folderBaru')">
          <FolderPlus size="1em" /> Folder Baru
        </button>
        <button type="button" class="btn btn-biru" @click="inputFile?.click()">
          <Upload size="1em" /> Unggah File
        </button>
        <input
          ref="inputFile"
          type="file"
          multiple
          :accept="JENIS_DITERIMA"
          class="input-tersembunyi"
          @change="saatFileDipilih"
        />
      </div>
    </div>

    <p v-if="admin" class="catatan">
      Maksimal 5 MB per file. Jenis yang diterima: JPG, PNG, WebP, GIF, PDF, Word, Excel, PowerPoint, TXT,
      CSV, dan ZIP.
    </p>

    <!-- ===== DAFTAR ===== -->
    <p v-if="galat" class="pesan pesan-galat">{{ galat }}</p>
    <p v-else-if="!isi" class="pesan">Memuat…</p>

    <template v-else>
      <div v-if="isi.folder.length === 0 && isi.berkas.length === 0" class="kosong">
        <span class="kosong-ikon"><FolderOpen size="1em" /></span>
        <p class="kosong-judul">Folder ini masih kosong</p>
        <p class="kosong-teks">
          {{ admin ? 'Buat folder baru atau unggah file untuk mengisinya.' : 'Belum ada file di sini.' }}
        </p>
      </div>

      <ul v-else class="daftar">
        <li class="baris baris-kepala" aria-hidden="true">
          <span class="kolom-nama">Nama</span>
          <span class="kolom kolom-ukuran">Ukuran</span>
          <span class="kolom kolom-tanggal">Diunggah</span>
          <span class="kolom-aksi"></span>
        </li>

        <!-- Folder -->
        <li v-for="f in isi.folder" :key="'d' + f.id" class="baris">
          <button type="button" class="kolom-nama nama-tombol" @click="bukaFolder(f.id)">
            <span class="ikon tipe-folder"><Folder size="1em" /></span>
            <span class="teks">
              <span class="nama">{{ f.nama }}</span>
              <span class="meta">Folder · {{ tanggal(f.createdAt) }}</span>
            </span>
          </button>
          <span class="kolom kolom-ukuran">—</span>
          <span class="kolom kolom-tanggal">{{ tanggal(f.createdAt) }}</span>
          <span class="kolom-aksi">
            <template v-if="admin">
              <button
                type="button"
                class="aksi"
                aria-label="Ubah nama folder"
                @click="bukaModal('ubah', { tipe: 'folder', id: f.id, nama: f.nama })"
              >
                <Pencil size="1em" />
              </button>
              <button
                type="button"
                class="aksi aksi-hapus"
                aria-label="Hapus folder"
                @click="bukaModal('hapus', { tipe: 'folder', id: f.id, nama: f.nama })"
              >
                <Trash2 size="1em" />
              </button>
            </template>
          </span>
        </li>

        <!-- File -->
        <li v-for="b in isi.berkas" :key="'f' + b.id" class="baris">
          <div class="kolom-nama">
            <span class="ikon" :class="kelasFile(b.nama)">
              <component :is="ikonFile(b.nama)" size="1em" />
            </span>
            <span class="teks">
              <span class="nama">{{ b.nama }}</span>
              <span class="meta">{{ formatUkuran(b.ukuran) }} · {{ tanggal(b.createdAt) }}</span>
            </span>
          </div>
          <span class="kolom kolom-ukuran">{{ formatUkuran(b.ukuran) }}</span>
          <span class="kolom kolom-tanggal">{{ tanggal(b.createdAt) }}</span>
          <span class="kolom-aksi">
            <button
              v-if="!admin"
              type="button"
              class="btn btn-biru btn-kecil"
              :disabled="mengunduh === b.id"
              @click="unduh(b)"
            >
              <Download size="1em" /> Unduh
            </button>
            <template v-else>
              <button
                type="button"
                class="aksi"
                aria-label="Ubah nama file"
                @click="bukaModal('ubah', { tipe: 'file', id: b.id, nama: b.nama })"
              >
                <Pencil size="1em" />
              </button>
              <button
                type="button"
                class="aksi aksi-hapus"
                aria-label="Hapus file"
                @click="bukaModal('hapus', { tipe: 'file', id: b.id, nama: b.nama })"
              >
                <Trash2 size="1em" />
              </button>
            </template>
          </span>
        </li>
      </ul>
    </template>

    <!-- ===== MODAL (hanya admin): folder baru, ubah nama, hapus ===== -->
    <div v-if="modal" class="modal-latar" @click.self="tutupModal">
      <form class="modal-kotak" @submit.prevent="kirimModal">
        <div class="modal-kepala">
          <h3 class="modal-judul">{{ judulModal }}</h3>
          <button type="button" class="modal-tutup" aria-label="Tutup" @click="tutupModal">
            <X size="1.1em" />
          </button>
        </div>

        <div class="modal-isi">
          <template v-if="modal.jenis === 'hapus'">
            <p class="modal-teks">
              {{
                modal.target.tipe === 'folder'
                  ? `Folder "${modal.target.nama}" beserta SELURUH isinya (folder di dalamnya dan semua file) akan dihapus permanen.`
                  : `File "${modal.target.nama}" akan dihapus permanen.`
              }}
              Tindakan ini tidak bisa dibatalkan.
            </p>
          </template>
          <template v-else>
            <label class="modal-label" for="berkas-nama">
              {{ modal.jenis === 'folderBaru' ? 'Nama folder' : 'Nama baru' }}
            </label>
            <input
              id="berkas-nama"
              v-model="isian"
              type="text"
              class="modal-input"
              maxlength="200"
              autocomplete="off"
              autofocus
            />
          </template>
          <p v-if="pesanModal" class="modal-galat">{{ pesanModal }}</p>
        </div>

        <div class="modal-aksi">
          <button type="button" class="btn btn-garis" @click="tutupModal">Batal</button>
          <button type="submit" class="btn" :class="modal.jenis === 'hapus' ? 'btn-merah' : 'btn-biru'">
            {{ modal.jenis === 'hapus' ? 'Hapus' : 'Simpan' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
defineOptions({ name: 'BerkasManager' })
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ApiError } from '@/api/http'
import { useBerkasStore } from '@/stores/berkas'
import {
  Folder,
  FolderOpen,
  FolderPlus,
  Upload,
  Download,
  Pencil,
  Trash2,
  X,
  ChevronRight,
  File,
  FileText,
  FileImage,
  FileSpreadsheet,
  FileArchive,
  Presentation,
} from 'lucide-vue-next'

const props = defineProps({
  // 'admin' = bisa kelola (folder, unggah, ubah nama, hapus); 'tentor' = hanya lihat dan unduh
  peran: { type: String, default: 'tentor' },
})
const admin = computed(() => props.peran === 'admin')

const route = useRoute()
const router = useRouter()
const berkas = useBerkasStore()

const MAKS_UKURAN = 5 * 1024 * 1024
const JENIS_DITERIMA = '.jpg,.jpeg,.png,.webp,.gif,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip'

// ===== Folder yang sedang dibuka: disimpan di alamat (?folder=12), jadi tombol Back naik satu folder =====
const folderId = computed(() => {
  const q = route.query.folder
  return typeof q === 'string' && /^\d{1,9}$/.test(q) ? q : null
})
const bukaFolder = (id) => {
  router.push({ query: id ? { folder: String(id) } : {} })
}

// ===== Memuat isi folder =====
const isi = ref(null)
const galat = ref('')

async function muat() {
  galat.value = ''
  try {
    isi.value = await berkas.fetchIsi(props.peran, folderId.value)
  } catch (err) {
    if (err instanceof ApiError && err.status === 404 && folderId.value) {
      router.replace({ query: {} }) // folder sudah tidak ada → kembali ke tingkat teratas
      return
    }
    isi.value = null
    galat.value = err instanceof ApiError ? err.message : 'Gagal memuat berkas. Coba muat ulang halaman.'
  }
}
onMounted(muat)
watch(folderId, () => {
  isi.value = null
  muat()
})

// ===== Tampilan =====
const formatUkuran = (b) => {
  if (b < 1024) return `${b} B`
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1).replace('.', ',')} KB`
  return `${(b / 1024 / 1024).toFixed(1).replace('.', ',')} MB`
}
const tanggal = (iso) =>
  new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  })
const ekstensi = (nama) => nama.split('.').pop().toLowerCase()
const ikonFile = (nama) => {
  const e = ekstensi(nama)
  if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(e)) return FileImage
  if (['xls', 'xlsx', 'csv'].includes(e)) return FileSpreadsheet
  if (['ppt', 'pptx'].includes(e)) return Presentation
  if (e === 'zip') return FileArchive
  if (['pdf', 'doc', 'docx', 'txt'].includes(e)) return FileText
  return File
}
const kelasFile = (nama) => {
  const e = ekstensi(nama)
  if (e === 'pdf') return 'tipe-pdf'
  if (['doc', 'docx'].includes(e)) return 'tipe-word'
  if (['xls', 'xlsx', 'csv'].includes(e)) return 'tipe-excel'
  if (['ppt', 'pptx'].includes(e)) return 'tipe-ppt'
  if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(e)) return 'tipe-gambar'
  return 'tipe-lain'
}

// ===== Unggah (admin): beberapa file sekaligus, dikirim satu per satu =====
const inputFile = ref(null)

async function saatFileDipilih(e) {
  const daftar = Array.from(e.target.files || [])
  e.target.value = '' // supaya file yang sama bisa dipilih ulang
  if (daftar.length === 0) return

  const gagal = []
  for (const f of daftar) {
    if (f.size > MAKS_UKURAN) {
      gagal.push(`${f.name}: lebih dari 5 MB`)
      continue
    }
    try {
      await berkas.unggah(f, folderId.value)
    } catch (err) {
      gagal.push(`${f.name}: ${err instanceof ApiError ? err.message : 'gagal diunggah'}`)
    }
  }
  await muat()
  if (gagal.length > 0) alert('Sebagian file gagal diunggah:\n' + gagal.join('\n'))
}

// ===== Modal (admin): folder baru, ubah nama, hapus =====
const modal = ref(null) // { jenis: 'folderBaru' | 'ubah' | 'hapus', target?: { tipe, id, nama } }
const isian = ref('')
const pesanModal = ref('')

const judulModal = computed(() => {
  if (!modal.value) return ''
  if (modal.value.jenis === 'folderBaru') return 'Folder Baru'
  if (modal.value.jenis === 'ubah') return modal.value.target.tipe === 'folder' ? 'Ubah Nama Folder' : 'Ubah Nama File'
  return modal.value.target.tipe === 'folder' ? 'Hapus Folder' : 'Hapus File'
})

function bukaModal(jenis, target = null) {
  modal.value = { jenis, target }
  isian.value = jenis === 'ubah' ? target.nama : ''
  pesanModal.value = ''
}
const tutupModal = () => {
  modal.value = null
}

async function kirimModal() {
  const m = modal.value
  if (!m) return
  pesanModal.value = ''
  try {
    if (m.jenis === 'folderBaru') {
      await berkas.buatFolder({ nama: isian.value, indukId: folderId.value ? Number(folderId.value) : null })
    } else if (m.jenis === 'ubah') {
      if (m.target.tipe === 'folder') await berkas.ubahNamaFolder(m.target.id, isian.value)
      else await berkas.ubahNamaFile(m.target.id, isian.value)
    } else if (m.target.tipe === 'folder') {
      await berkas.hapusFolder(m.target.id)
    } else {
      await berkas.hapusFile(m.target.id)
    }
    tutupModal()
    await muat()
  } catch (err) {
    pesanModal.value = err instanceof ApiError ? err.message : 'Gagal menyimpan. Coba lagi.'
  }
}

// ===== Unduh (tentor): minta link sementara ke server, lalu browser menyimpan filenya =====
const mengunduh = ref(null)
async function unduh(b) {
  mengunduh.value = b.id
  try {
    const link = await berkas.linkUnduh(b.id)
    window.location.assign(link)
  } catch (err) {
    alert(err instanceof ApiError ? err.message : 'Gagal menyiapkan unduhan. Coba lagi.')
  } finally {
    mengunduh.value = null
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

* {
  font-family: 'DM Sans', sans-serif;
  box-sizing: border-box;
}

.berkas {
  width: 100%;
  max-width: 960px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* ===== BAR ATAS ===== */
.bar-atas {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  margin-bottom: 0.7rem;
}
.jalur {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.15rem;
}
.jalur-item {
  border: 0;
  background: transparent;
  padding: 0.25rem 0.45rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #6b7280;
  cursor: pointer;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.jalur-item:hover {
  background: #eaf3ff;
  color: #1d6fd4;
}
.jalur-item.aktif {
  color: #1f2937;
  cursor: default;
}
.jalur-item.aktif:hover {
  background: transparent;
  color: #1f2937;
}
.jalur-panah {
  color: #9ca3af;
  flex-shrink: 0;
}

.tombol-admin {
  display: flex;
  gap: 0.5rem;
}
.input-tersembunyi {
  display: none;
}

/* ===== TOMBOL ===== */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  border: 0;
  border-radius: 10px;
  padding: 0.55rem 0.9rem;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease,
    background 0.15s ease;
}
.btn:active {
  transform: scale(0.97);
}
.btn:disabled {
  opacity: 0.6;
  cursor: default;
}
.btn-biru {
  background: linear-gradient(135deg, #2e87f6 0%, #1d6fd4 100%);
  color: #fff;
  box-shadow: 0 4px 12px rgba(46, 135, 246, 0.3);
}
.btn-garis {
  background: #fff;
  color: #1d6fd4;
  box-shadow: inset 0 0 0 1.5px #2e87f6;
}
.btn-merah {
  background: linear-gradient(135deg, #ef4444 0%, #c62828 100%);
  color: #fff;
}
.btn-kecil {
  padding: 0.4rem 0.7rem;
  font-size: 0.76rem;
}

.catatan {
  margin: 0 0 0.8rem;
  font-size: 0.72rem;
  color: #6b7280;
  line-height: 1.45;
}

.pesan {
  margin: 1.5rem 0;
  text-align: center;
  font-size: 0.85rem;
  color: #6b7280;
}
.pesan-galat {
  color: #b91c1c;
  font-weight: 600;
}

/* ===== KOSONG ===== */
.kosong {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  padding: 2.2rem 1rem;
  border: 2px dashed rgba(46, 135, 246, 0.4);
  border-radius: 18px;
  text-align: center;
  background: #fff;
}
.kosong-ikon {
  width: 56px;
  height: 56px;
  margin-bottom: 0.3rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  color: #fff;
  background: linear-gradient(135deg, #2e87f6 0%, #1d6fd4 100%);
}
.kosong-judul {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 700;
  color: #1f2937;
}
.kosong-teks {
  margin: 0;
  font-size: 0.8rem;
  color: #6b7280;
}

/* ===== DAFTAR ===== */
.daftar {
  list-style: none;
  margin: 0;
  padding: 0;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}
.baris {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 0.8rem;
  border-bottom: 1px solid #f0f1f3;
}
.baris:last-child {
  border-bottom: 0;
}
.baris:not(.baris-kepala):hover {
  background: #f7faff;
}
.baris-kepala {
  display: none;
}

.kolom-nama {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 0.65rem;
}
.nama-tombol {
  border: 0;
  background: transparent;
  padding: 0;
  text-align: left;
  font: inherit;
  cursor: pointer;
}
.ikon {
  flex-shrink: 0;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}
.tipe-folder {
  color: #1d6fd4;
  background: #eaf3ff;
}
.tipe-pdf {
  color: #c62828;
  background: #fdecec;
}
.tipe-word {
  color: #1d6fd4;
  background: #eaf3ff;
}
.tipe-excel {
  color: #178044;
  background: #e6f6ec;
}
.tipe-ppt {
  color: #d6481c;
  background: #fdeee8;
}
.tipe-gambar {
  color: #b9770e;
  background: #fbf1dc;
}
.tipe-lain {
  color: #6b7280;
  background: #f1f2f4;
}
.teks {
  min-width: 0;
  display: flex;
  flex-direction: column;
}
.nama {
  font-size: 0.88rem;
  font-weight: 600;
  color: #1f2937;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.meta {
  font-size: 0.7rem;
  color: #9ca3af;
}
.kolom {
  display: none;
}
.kolom-aksi {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}
.aksi {
  width: 34px;
  height: 34px;
  border: 0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.05rem;
  color: #6b7280;
  background: transparent;
  cursor: pointer;
}
.aksi:hover {
  background: #eaf3ff;
  color: #1d6fd4;
}
.aksi-hapus:hover {
  background: #fdecec;
  color: #c62828;
}

/* ===== MODAL ===== */
.modal-latar {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(17, 24, 39, 0.5);
}
.modal-kotak {
  width: 100%;
  max-width: 420px;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}
.modal-kepala {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.9rem 1rem;
  background: linear-gradient(135deg, #2e87f6 0%, #1d6fd4 100%);
}
.modal-judul {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 700;
  color: #fff;
}
.modal-tutup {
  width: 30px;
  height: 30px;
  border: 0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  cursor: pointer;
}
.modal-isi {
  padding: 1rem;
}
.modal-teks {
  margin: 0;
  font-size: 0.85rem;
  line-height: 1.55;
  color: #374151;
  word-break: break-word;
}
.modal-label {
  display: block;
  margin-bottom: 0.35rem;
  font-size: 0.78rem;
  font-weight: 600;
  color: #6b7280;
}
.modal-input {
  width: 100%;
  padding: 0.6rem 0.75rem;
  border: 1.5px solid #d1d5db;
  border-radius: 10px;
  font-size: 0.9rem;
  outline: none;
}
.modal-input:focus {
  border-color: #2e87f6;
  box-shadow: 0 0 0 3px rgba(46, 135, 246, 0.15);
}
.modal-galat {
  margin: 0.6rem 0 0;
  font-size: 0.78rem;
  font-weight: 600;
  color: #b91c1c;
}
.modal-aksi {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 0 1rem 1rem;
}

/* =====================================================
   BREAKPOINTS
   @media 641px  : tablet
   @media 768px  : desktop
   @media 1024px : large desktop
   ===================================================== */
@media (min-width: 641px) {
  .berkas {
    padding: 0 1.5rem;
  }
  .bar-atas {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
  .nama {
    font-size: 0.92rem;
  }
}

@media (min-width: 768px) {
  .baris {
    padding: 0.7rem 1rem;
  }
  .baris-kepala {
    display: flex;
    padding: 0.55rem 1rem;
    background: #f7f8fa;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: #9ca3af;
  }
  .kolom {
    display: block;
    font-size: 0.8rem;
    color: #6b7280;
  }
  .kolom-ukuran {
    width: 100px;
  }
  .kolom-tanggal {
    width: 120px;
  }
  .kolom-aksi {
    width: 90px;
    justify-content: flex-end;
  }
  .meta {
    display: none;
  }
}

@media (min-width: 1024px) {
  .berkas {
    padding: 0 2rem;
  }
  .kolom-ukuran {
    width: 120px;
  }
  .kolom-tanggal {
    width: 140px;
  }
}
</style>