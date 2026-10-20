import { defineStore } from 'pinia'
import { api } from '@/api/http'

// Tanggal dari server (ISO) → teks seperti di riwayat sebelumnya, zona waktu Jakarta
const formatTanggal = (iso) =>
  new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta',
  })

// ===== Konversi bentuk server ↔ bentuk baris di DataTentor.vue =====
const keBoolean = (v) => v === 'Sudah'
const keSudahBelum = (b) => (b ? 'Sudah' : 'Belum')

const tentorDariServer = (t) => ({
  kodeTentor: t.kodeTentor,
  nama: t.nama,
  panggilan: t.panggilan,
  telepon: t.telepon,
  email: t.email,
  lulusan: t.lulusan,
  alamat: t.alamat,
  gajiRaw: t.gaji,
  gajiDisplay: 'Rp ' + Number(t.gaji).toLocaleString('id-ID'),
  kontakDarurat: t.kontakDarurat,
  cv: keSudahBelum(t.cv),
  pasPhoto: keSudahBelum(t.pasPhoto),
  suratKontrak: keSudahBelum(t.suratKontrak),
  habisKontrak: t.habisKontrak,
})

export const useTentorStore = defineStore('tentor', {
  state: () => ({
    // ============================================
    // DATA INDUK TENTOR — diisi admin di DataTentor.vue (semua kolom).
    // Kunci unik: kodeTentor.
    // Nanti: this.rows = await (await fetch('/api/admin/tentor')).json()
    // ============================================
    rows: [],
    // ============================================
    // RIWAYAT KODE TENTOR yang sudah di-generate & disetujui admin.
    // { kode, tanggal, terpakai }
    // terpakai: false = masih tersedia untuk dipakai daftar di /daftar
    // terpakai: true  = sudah dipakai satu akun tentor
    // ============================================
    kodeHistory: [],
    // ============================================
    akun: [],
    // Profil tentor yang sedang login (dari GET /api/tentor/me):
    // { kodeTentor, nama, wa, email, habisKontrak, kontrak: { status, sisaHari, hapusPada? } }
    profil: null,
  }),

  getters: {
    getByKode: (state) => (kode) => state.rows.find((r) => r.kodeTentor === kode) || null,

    // Kode sudah pernah di-generate (dipakai untuk menghindari kode kembar saat generate)
    kodeSudahAda: (state) => (kode) => state.kodeHistory.some((k) => k.kode === kode),
  },

  actions: {
    // ===== Dashboard.vue admin: riwayat dan pembuatan kode (dicek server) =====
    async fetchKodeHistory() {
      const rows = await api('/api/admin/kode')
      this.kodeHistory = rows.map((r) => ({
        kode: r.kode,
        tanggal: formatTanggal(r.createdAt),
        terpakai: r.terpakai,
      }))
    },

    // Server memilih kode acak yang belum ada. Belum disimpan sampai admin tekan SETUJU.
    async generateKodeBaru() {
      const data = await api('/api/admin/kode/generate', { method: 'POST' })
      return data.kode
    },

    // Simpan kode yang disetujui. Melempar ApiError kalau ditolak (mis. 409 kode sudah ada).
    async setujuKode(kode) {
      const dibuat = await api('/api/admin/kode/setuju', { method: 'POST', body: { kode } })
      this.kodeHistory.unshift({ kode: dibuat.kode, tanggal: formatTanggal(new Date()), terpakai: false })
    },

    // ===== DataTentor.vue: data tentor dari/ke server =====
    async fetchRows() {
      const data = await api('/api/admin/tentor')
      this.rows = data.map(tentorDariServer)
    },

    // Simpan 1 baris (bentuk baris frontend). Melempar ApiError kalau ditolak server.
    async simpanTentor(row) {
      const dibuat = await api('/api/admin/tentor', {
        method: 'POST',
        body: {
          kodeTentor: row.kodeTentor.trim(),
          nama: row.nama.trim(),
          panggilan: row.panggilan.trim(),
          telepon: row.telepon,
          email: row.email.trim(),
          lulusan: row.lulusan.trim(),
          alamat: row.alamat.trim(),
          gaji: row.gajiRaw,
          kontakDarurat: row.kontakDarurat,
          cv: keBoolean(row.cv),
          pasPhoto: keBoolean(row.pasPhoto),
          suratKontrak: keBoolean(row.suratKontrak),
          habisKontrak: row.habisKontrak,
        },
      })
      this.rows.push(tentorDariServer(dibuat))
    },

    // Ubah 1 baris tersimpan (bentuk baris frontend). Kode tentor tidak dikirim karena tidak bisa diubah.
    // Melempar ApiError kalau ditolak server.
    async ubahTentor(row) {
      const diubah = await api(`/api/admin/tentor/${row.kodeTentor}`, {
        method: 'PATCH',
        body: {
          nama: row.nama.trim(),
          panggilan: row.panggilan.trim(),
          telepon: row.telepon,
          email: row.email.trim(),
          lulusan: row.lulusan.trim(),
          alamat: row.alamat.trim(),
          gaji: row.gajiRaw,
          kontakDarurat: row.kontakDarurat,
          cv: keBoolean(row.cv),
          pasPhoto: keBoolean(row.pasPhoto),
          suratKontrak: keBoolean(row.suratKontrak),
          habisKontrak: row.habisKontrak,
        },
      })
      const baru = tentorDariServer(diubah)
      const i = this.rows.findIndex((r) => r.kodeTentor === baru.kodeTentor)
      if (i !== -1) this.rows[i] = baru
      return baru
    },

    // Admin hapus tentor: server menghapus data tentor + akun login + kodenya (presensi tetap tersimpan)
    async hapusTentor(kode) {
      await api(`/api/admin/tentor/${kode}`, { method: 'DELETE' })
      this.rows = this.rows.filter((r) => r.kodeTentor !== kode)
      this.kodeHistory = this.kodeHistory.filter((k) => k.kode !== kode)
    },

        // Admin reset password tentor: server membuat password sementara dan mengirimnya SATU KALI.
    // Mengembalikan teks password sementara (jangan disimpan di state atau localStorage).
    async resetPasswordTentor(kode) {
      const data = await api(`/api/admin/tentor/${kode}/reset-password`, { method: 'POST' })
      return data.passwordSementara
    },

    // ===== Halaman tentor: profil dan status kontrak dari server =====
    async fetchProfil() {
      this.profil = await api('/api/tentor/me')
      return this.profil
    },

    // Ubah profil. body hanya berisi yang berubah: { nama?, wa?, email?, passwordBaru?, passwordLama? }
    async ubahProfil(body) {
      this.profil = await api('/api/tentor/me', { method: 'PATCH', body })
      return this.profil
    },

    // Perpanjang kontrak (server menghitung batas 1 sampai 3 bulan dari hari ini).
    // Melempar ApiError kalau di luar batas; ApiError.data berisi { min, max }.
    async perpanjangKontrak(habisKontrak) {
      this.profil = await api('/api/tentor/kontrak', { method: 'PATCH', body: { habisKontrak } })
      return this.profil
    },

    // Catat persetujuan Surat Kontrak Tentor (hanya sekali selama masih berlaku).
    async setujuSurat() {
      this.profil = await api('/api/tentor/surat/setuju', { method: 'POST' })
      return this.profil
    },

    // Hapus akun sendiri (server meminta password). Melempar ApiError kalau password salah.
    async hapusAkunSendiri(password) {
      await api('/api/tentor/me', { method: 'DELETE', body: { password } })
      this.profil = null
    },
  },
})