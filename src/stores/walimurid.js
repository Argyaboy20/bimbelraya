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
    // ============================================
    // Data walimurid yang SUDAH dikonfirmasi admin di DataWaliMurid.vue.
    // Field sama dengan kolom tabel: kodeWali, nama, kelas, asalSekolah, alamat,
    // paket, hariPertemuan, jam, kodeTentor, guru, mapel, hargaRaw, hargaDisplay, status.
    // Kunci unik: kodeWali.
    //
    // Nanti: this.rows = await (await fetch('/api/admin/walimurid')).json()
    // ============================================
    rows: [],
  }),

  getters: {
    // Walimurid aktif = status "Berlangsung" (dipakai kartu statistik di Dashboard)
    jumlahAktif: (state) => state.rows.filter((r) => r.status === 'Berlangsung').length,
  },

  actions: {
    addRow(data) {
      this.rows.push({ ...data })
      // Nanti: await fetch('/api/admin/walimurid', { method: 'POST', body: JSON.stringify(data) })
    },

    removeByKode(kode) {
      this.rows = this.rows.filter((r) => r.kodeWali !== kode)
      // Nanti: await fetch(`/api/admin/walimurid/${kode}`, { method: 'DELETE' })
    },

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

    async hapusWalimurid(kode) {
      await api(`/api/admin/walimurid/${kode}`, { method: 'DELETE' })
      this.rows = this.rows.filter((r) => r.kodeWali !== kode)
    },
  },
})