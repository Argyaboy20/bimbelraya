import { defineStore } from 'pinia'
import { api } from '@/api/http'

// Halaman Berkas. peran = 'admin' atau 'tentor' (tentor hanya bisa melihat dan mengunduh).
// Semua aturan (ukuran, jenis file, nama kembar) dicek di server; frontend hanya menampilkan hasilnya.
export const useBerkasStore = defineStore('berkas', {
  actions: {
    // Isi satu folder (folderId kosong = tingkat teratas): { folderSaatIni, jalur, folder, berkas }
    fetchIsi(peran, folderId) {
      const q = folderId ? `?folderId=${encodeURIComponent(folderId)}` : ''
      return api(`/api/${peran}/berkas${q}`)
    },

    // ===== Khusus admin =====
    buatFolder({ nama, indukId }) {
      return api('/api/admin/berkas/folder', { method: 'POST', body: { nama, indukId: indukId ?? null } })
    },
    ubahNamaFolder(id, nama) {
      return api(`/api/admin/berkas/folder/${id}`, { method: 'PATCH', body: { nama } })
    },
    ubahNamaFile(id, nama) {
      return api(`/api/admin/berkas/file/${id}`, { method: 'PATCH', body: { nama } })
    },
    hapusFolder(id) {
      return api(`/api/admin/berkas/folder/${id}`, { method: 'DELETE' })
    },
    hapusFile(id) {
      return api(`/api/admin/berkas/file/${id}`, { method: 'DELETE' })
    },
    unggah(file, folderId) {
      const fd = new FormData()
      if (folderId) fd.append('folderId', String(folderId))
      fd.append('berkas', file) // file ditaruh terakhir
      return api('/api/admin/berkas/file', { method: 'POST', body: fd, pesan: 'Mengunggah file…' })
    },

    // ===== Khusus tentor: link unduh sementara (5 menit) =====
    async linkUnduh(id) {
      const data = await api(`/api/tentor/berkas/file/${id}/unduh`, { pesan: 'Menyiapkan unduhan…' })
      return data.link
    },
  },
})