import { defineStore } from 'pinia'

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
    // ============================================
    // Struktur 1 lowongan:
    // { id, kelas, alamat, paket, hari, jam, durasi, periode, mapel, guru, status }
    //
    // Ditulis dari DataLowongan.vue (admin), hanya dibaca oleh Lowongan.vue (publik).
    //
    // Nanti diganti fetch dari backend:
    // async fetchLowongan() {
    //   const res = await fetch('/api/lowongan')   // endpoint publik, tanpa login
    //   this.items = await res.json()
    // }
    // ============================================
    items: []
  }),

  actions: {
    // Dipanggil DataLowongan.vue saat admin tekan "Iya" di konfirmasi baris
    addLowongan(data) {
      this.items.push({ ...data })
      // Nanti: await fetch('/api/admin/lowongan', { method: 'POST', body: JSON.stringify(data) })
    },

    // Dipanggil DataLowongan.vue saat admin mengganti status baris yang sudah tersimpan
    updateStatus(id, status) {
      const item = this.items.find((i) => i.id === id)
      if (item) item.status = status
      // Nanti: await fetch(`/api/admin/lowongan/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) })
    },

    // Dipanggil DataLowongan.vue saat admin hapus baris
    removeLowongan(id) {
      this.items = this.items.filter((i) => i.id !== id)
      // Nanti: await fetch(`/api/admin/lowongan/${id}`, { method: 'DELETE' })
    }
  }
})