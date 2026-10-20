import { defineStore } from 'pinia'
import { api } from '@/api/http'

// Bentuk server → bentuk baris di DataWaliMurid.vue
const walimuridDariServer = (w) => ({
  kodeWali: w.kodeWali,
  nama: w.nama,
  kelas: w.kelas,
  asalSekolah: w.asalSekolah,
  alamat: w.alamat,
  paket: String(w.paket),
  hariPertemuan: w.hariPertemuan,
  jam: w.jam,
  kodeTentor: w.kodeTentor ?? '', // kosong kalau tentornya sudah dihapus
  guru: w.guru,
  mapel: w.mapel,
  hargaRaw: w.harga,
  hargaDisplay: 'Rp ' + Number(w.harga).toLocaleString('id-ID'),
  status: w.status,
})

export const useWalimuridStore = defineStore('walimurid', {
  state: () => ({
    // Nanti: this.rows = await (await fetch('/api/admin/walimurid')).json()
    // ============================================
    rows: [],
  }),

  actions: {
    // ===== DataWaliMurid.vue: data dari/ke server =====
    async fetchRows() {
      const data = await api('/api/admin/walimurid')
      this.rows = data.map(walimuridDariServer)
    },

    // Simpan 1 baris (bentuk baris frontend). Melempar ApiError kalau ditolak server.
    async simpanWalimurid(row) {
      const dibuat = await api('/api/admin/walimurid', {
        method: 'POST',
        body: {
          kodeWali: row.kodeWali.trim(),
          nama: row.nama.trim(),
          kelas: row.kelas.trim(),
          asalSekolah: row.asalSekolah.trim(),
          alamat: row.alamat.trim(),
          paket: Number(row.paket),
          hariPertemuan: row.hariPertemuan.trim(),
          jam: row.jam.trim(),
          kodeTentor: row.kodeTentor.trim(),
          guru: row.guru.trim(),
          mapel: row.mapel.trim(),
          harga: row.hargaRaw,
          status: row.status,
        },
      })
      this.rows.push(walimuridDariServer(dibuat))
    },

    // Ubah 1 baris tersimpan. kodeLama = kode sebelum diedit (kode walimurid boleh diganti).
    // Melempar ApiError kalau ditolak server (mis. 409 kode sudah dipakai).
    async ubahWalimurid(kodeLama, row) {
      const diubah = await api(`/api/admin/walimurid/${kodeLama}`, {
        method: 'PATCH',
        body: {
          kodeWali: row.kodeWali.trim(),
          nama: row.nama.trim(),
          kelas: row.kelas.trim(),
          asalSekolah: row.asalSekolah.trim(),
          alamat: row.alamat.trim(),
          paket: Number(row.paket),
          hariPertemuan: row.hariPertemuan.trim(),
          jam: row.jam.trim(),
          kodeTentor: row.kodeTentor.trim(),
          guru: row.guru.trim(),
          mapel: row.mapel.trim(),
          harga: row.hargaRaw,
          status: row.status,
        },
      })
      const baru = walimuridDariServer(diubah)
      const i = this.rows.findIndex((r) => r.kodeWali === kodeLama)
      if (i !== -1) this.rows[i] = baru
      return baru
    },

    async hapusWalimurid(kode) {
      await api(`/api/admin/walimurid/${kode}`, { method: 'DELETE' })
      this.rows = this.rows.filter((r) => r.kodeWali !== kode)
    },
  },
})