import { defineStore } from 'pinia'

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
  },
})