import { defineStore } from 'pinia'
import { api, ApiError } from '@/api/http'

// ============================================
// Daftar kolom teks lowongan. Dipakai bersama oleh
// DataLowongan.vue (admin, input) dan Lowongan.vue (publik, tampilan)
// supaya nama kolom & urutannya selalu sama persis di kedua halaman.
// Kolom "Guru (P/L)" dan "Status" dipisah karena bentuknya dropdown.
// ============================================
export const KOLOM_LOWONGAN = [
  { key: 'kelas', label: 'Kelas', placeholder: 'Contoh: 5 SD' },
  { key: 'alamat', label: 'Alamat Lengkap', placeholder: 'Alamat lengkap' },
  { key: 'paket', label: 'Pilihan Paket Seminggu', placeholder: 'Contoh: 2x seminggu' },
  { key: 'hari', label: 'Hari Les', placeholder: 'Contoh: Senin & Kamis' },
  { key: 'jam', label: 'Request Jam', placeholder: 'Contoh: 16.00 - 17.30 WIB' },
  { key: 'durasi', label: 'Durasi', placeholder: 'Contoh: 90 menit' },
  { key: 'periode', label: 'Periode', placeholder: 'Contoh: Juli - Desember 2026' },
  { key: 'mapel', label: 'Request Mapel', placeholder: 'Contoh: Matematika' }
]

export const STATUS_LOWONGAN = ['Tersedia', 'Sudah Diambil']

export const useLowonganStore = defineStore('lowongan', {
  state: () => ({
    // Struktur 1 lowongan (id angka dari server):
    // { id, kelas, alamat, paket, hari, jam, durasi, periode, mapel, guru, status }
    items: [],
    loading: false,
    error: ''
  }),

  actions: {
    async _muat(path, auth) {
      this.loading = true
      this.error = ''
      try {
        this.items = await api(path, { auth })
      } catch (err) {
        this.error = err instanceof ApiError ? err.message : 'Gagal memuat lowongan'
      } finally {
        this.loading = false
      }
    },

    // Halaman publik /lowongan (tanpa login)
    fetchPublik() {
      return this._muat('/api/lowongan', false)
    },

    // Halaman admin DataLowongan.vue
    fetchAdmin() {
      return this._muat('/api/admin/lowongan', true)
    },

    // Dipanggil DataLowongan.vue saat admin tekan "Iya". Melempar ApiError kalau ditolak server.
    async addLowongan(data) {
      const dibuat = await api('/api/admin/lowongan', { method: 'POST', body: data })
      this.items.push(dibuat)
      return dibuat
    },

    // Dipanggil DataLowongan.vue saat admin mengganti status baris yang sudah tersimpan
    async updateStatus(id, status) {
      const diubah = await api(`/api/admin/lowongan/${id}`, { method: 'PATCH', body: { status } })
      const item = this.items.find((i) => i.id === id)
      if (item) item.status = diubah.status
    },

    // Dipanggil DataLowongan.vue saat admin hapus baris
    async removeLowongan(id) {
      await api(`/api/admin/lowongan/${id}`, { method: 'DELETE' })
      this.items = this.items.filter((i) => i.id !== id)
    }
  }
})