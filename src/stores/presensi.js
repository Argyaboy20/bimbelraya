import { defineStore } from 'pinia'
import { api } from '@/api/http'

const hariTanggal = (key) =>
  new Date(key + 'T00:00:00').toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

// Presensi dari server → bentuk baris di Presensi.vue
const dariServer = (p) => ({
  id: p.id,
  tanggalKey: p.tanggal,
  hariTanggalDisplay: hariTanggal(p.tanggal),
  jamPresensi: p.jam,
  materi: p.materi,
  fotoLink: p.fotoLink, // link sementara (5 menit), null kalau fotonya sudah dihapus
  kehadiran: true,
})

export const usePresensiStore = defineStore('presensi', {
  state: () => ({
    // Riwayat presensi milik tentor yang sedang login (dari server, 200 terbaru)
    riwayatSaya: [],
  }),

  actions: {  
    // ===== Presensi.vue (tentor): riwayat milik sendiri dari server =====
    async fetchSaya() {
      const rows = await api('/api/tentor/presensi')
      this.riwayatSaya = rows.map(dariServer)
    },

    // Kirim presensi: foto (data URL dari kamera) diubah jadi file, dikirim sebagai multipart.
    // Melempar ApiError kalau ditolak server.
    async kirimPresensi({ tanggal, materi, foto }) {
      const blob = await (await fetch(foto)).blob()
      const fd = new FormData()
      fd.append('tanggal', tanggal)
      fd.append('materi', materi)
      fd.append('foto', blob, 'foto.jpg')
      const dibuat = await api('/api/tentor/presensi', { method: 'POST', body: fd })
      this.riwayatSaya.unshift(dariServer(dibuat))
      // tanggal mundur (sampai 2 hari) tetap diurutkan benar: terbaru dulu
      this.riwayatSaya.sort((a, b) => (a.tanggalKey < b.tanggalKey ? 1 : a.tanggalKey > b.tanggalKey ? -1 : 0))
    },
  },
})
