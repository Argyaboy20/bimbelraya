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
  lesId: p.lesId ?? null, // presensi lama (sebelum fitur Les Siswa) tidak punya siswa
  namaSiswa: p.namaSiswa ?? null,
  kelasSiswa: p.kelasSiswa ?? null,
  namaWalimurid: p.namaWalimurid ?? null,
})

let urutanFetchSaya = 0 // hanya hasil permintaan terbaru yang dipakai
export const usePresensiStore = defineStore('presensi', {
  state: () => ({
    // Riwayat presensi milik tentor yang sedang login (dari server, 200 terbaru)
    riwayatSaya: [],

    // Daftar siswa milik tentor yang sedang login (Les Siswa); jumlahPresensi > 0 = tidak bisa dihapus
    daftarSiswa: [],
  }),

  actions: {  
        // ===== Presensi.vue (tentor): riwayat milik sendiri dari server =====
    // lesId diisi = hanya riwayat siswa itu; kosong = semua (200 terbaru)
    async fetchSaya(lesId) {
      const urutan = ++urutanFetchSaya
      const rows = await api(`/api/tentor/presensi${lesId ? `?lesId=${encodeURIComponent(lesId)}` : ''}`)
      if (urutan !== urutanFetchSaya) return // permintaan yang lebih baru sudah berjalan
      this.riwayatSaya = rows.map(dariServer)
    },

    // ===== Les Siswa =====
    async fetchSiswa() {
      this.daftarSiswa = await api('/api/tentor/les')
    },

    // Melempar ApiError kalau ditolak (duplikat 409, melebihi 10 siswa 400, dan sebagainya)
    async tambahSiswa({ namaSiswa, kelas, namaWalimurid }) {
      const dibuat = await api('/api/tentor/les', {
        method: 'POST',
        body: { namaSiswa, kelas, namaWalimurid },
      })
      this.daftarSiswa.push(dibuat)
      return dibuat
    },

    // Hanya bisa kalau siswa belum punya presensi (server yang memutuskan)
    async hapusSiswa(id) {
      await api(`/api/tentor/les/${id}`, { method: 'DELETE' })
      this.daftarSiswa = this.daftarSiswa.filter((s) => s.id !== id)
    },

    // Kirim presensi: foto (data URL dari kamera) diubah jadi file, dikirim sebagai multipart.
    // Melempar ApiError kalau ditolak server.
    async kirimPresensi({ tanggal, materi, foto, lesId }) {
      const blob = await (await fetch(foto)).blob()
      const fd = new FormData()
      fd.append('tanggal', tanggal)
      fd.append('materi', materi)
      fd.append('lesId', String(lesId))
      fd.append('foto', blob, 'foto.jpg')
      const dibuat = await api('/api/tentor/presensi', { method: 'POST', body: fd })
      this.riwayatSaya.unshift(dariServer(dibuat))
      const siswa = this.daftarSiswa.find((s) => s.id === lesId)
      if (siswa) siswa.jumlahPresensi += 1 // sejak ada presensi, siswa ini tidak bisa dihapus lagi
      // tanggal mundur (sampai 2 hari) tetap diurutkan benar: terbaru dulu
      this.riwayatSaya.sort((a, b) => (a.tanggalKey < b.tanggalKey ? 1 : a.tanggalKey > b.tanggalKey ? -1 : 0))
    },
  },
})
