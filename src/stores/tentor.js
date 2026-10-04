import { defineStore } from 'pinia'

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
    // AKUN LOGIN TENTOR — dibuat saat tentor daftar di /daftar.
    // { kodeTentor, nama, wa, email, password }
    //
    // SEMENTARA & HANYA UNTUK DEV: password disimpan polos di memori browser.
    // Nanti semua ini pindah ke backend: password di-hash (bcrypt), login dicek
    // server, dan frontend hanya menerima token JWT. Frontend tidak boleh
    // memegang password siapa pun di aplikasi sungguhan.
    // ============================================
    akun: [],
  }),

  getters: {
    getByKode: (state) => (kode) => state.rows.find((r) => r.kodeTentor === kode) || null,

    // Nama tentor: pakai data induk (admin) kalau ada, kalau belum pakai nama saat daftar
    getNama: (state) => (kode) => {
      const row = state.rows.find((r) => r.kodeTentor === kode)
      if (row) return row.nama
      const akun = state.akun.find((a) => a.kodeTentor === kode)
      return akun ? akun.nama : ''
    },

    getAkunByKode: (state) => (kode) => state.akun.find((a) => a.kodeTentor === kode) || null,

    // Kode sudah pernah di-generate (dipakai untuk menghindari kode kembar saat generate)
    kodeSudahAda: (state) => (kode) => state.kodeHistory.some((k) => k.kode === kode),

    // Kode ada di riwayat DAN belum dipakai akun mana pun
    kodeTersedia: (state) => (kode) =>
      state.kodeHistory.some((k) => k.kode === kode && !k.terpakai),
  },

  actions: {
    // ===== DataTentor.vue: admin tekan "Iya" di konfirmasi baris =====
    addRow(data) {
      this.rows.push({ ...data })
      // Nanti: await fetch('/api/admin/tentor', { method: 'POST', body: JSON.stringify(data) })
    },

    // ============================================
    // Hapus tentor SEPENUHNYA: baris data induk + akun login + hapus kodenya dari Riwayat Generate
    // (terpakai: false) supaya bisa dipakai tentor lain.
    // Dipakai oleh: DataTentor.vue (admin hapus), Biodata.vue (Hapus Akun),
    // dan checkExpiredContracts() di bawah.
    // ============================================
    removeByKode(kode) {
      this.rows = this.rows.filter((r) => r.kodeTentor !== kode)
      this.akun = this.akun.filter((a) => a.kodeTentor !== kode)
      this.kodeHistory = this.kodeHistory.filter((k) => k.kode !== kode)
      // Nanti: await fetch(`/api/tentor/${kode}`, { method: 'DELETE' })
    },

    // ===== PerpanjangKontrak.vue: tentor ajukan kontrak baru =====
    updateKontrak(kode, tanggalBaru) {
      const row = this.rows.find((r) => r.kodeTentor === kode)
      if (row) row.habisKontrak = tanggalBaru
      // Nanti: await fetch(`/api/tentor/${kode}/kontrak`, {
      //   method: 'PATCH', body: JSON.stringify({ habisKontrak: tanggalBaru })
      // })
    },

    // ===== Dashboard.vue admin: "SETUJU" generate kode =====
    // Mengembalikan false kalau kode sudah ada di riwayat (kode kembar).
    addKodeHistory(kode) {
      if (this.kodeSudahAda(kode)) return false
      this.kodeHistory.unshift({
        kode,
        tanggal: new Date().toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        terpakai: false,
      })
      return true
    },

    markKodeTerpakai(kode) {
      const entry = this.kodeHistory.find((k) => k.kode === kode)
      if (entry) entry.terpakai = true
    },

    // ============================================
    // SignInPage.vue: tentor daftar. Mengembalikan { ok, pesan } supaya
    // halaman bisa menampilkan alasan gagalnya.
    // ============================================
    daftarAkun({ kodeTentor, nama, wa, email, password }) {
      if (!this.kodeTersedia(kodeTentor)) {
        return { ok: false, pesan: 'Kode tentor tidak ditemukan atau sudah dipakai' }
      }
      const emailBersih = email.trim().toLowerCase()
      if (this.akun.some((a) => a.email === emailBersih)) {
        return { ok: false, pesan: 'Email sudah terdaftar' }
      }
      this.akun.push({ kodeTentor, nama: nama.trim(), wa, email: emailBersih, password })
      this.markKodeTerpakai(kodeTentor)
      return { ok: true }
      // Nanti: POST /api/auth/register-tentor
    },

    // ===== LoginPage.vue: kembalikan akun yang cocok, atau null kalau salah =====
    loginTentor(email, password) {
      const emailBersih = email.trim().toLowerCase()
      return this.akun.find((a) => a.email === emailBersih && a.password === password) || null
      // Nanti: POST /api/auth/login → server mengembalikan token JWT
    },

    // ===== Biodata.vue: tentor mengubah nama / email =====
    updateAkun(kode, { nama, email, wa, password }) {
      const akun = this.akun.find((a) => a.kodeTentor === kode)
      if (!akun) return { ok: false, pesan: 'Akun tidak ditemukan' }
      const emailBersih = email.trim().toLowerCase()
      if (this.akun.some((a) => a.email === emailBersih && a.kodeTentor !== kode)) {
        return { ok: false, pesan: 'Email sudah dipakai akun lain' }
      }
      akun.nama = nama.trim()
      akun.email = emailBersih
      akun.wa = wa
      akun.password = password
      return { ok: true }
    },

    // ============================================
    // Disapu setiap halaman tentor/admin relevan dimuat. Kontrak yang SUDAH lewat
    // (hari terakhir kontrak masih dihitung aktif) → tentor dihapus sepenuhnya
    // lewat removeByKode (baris + akun + kode dibebaskan).
    //
    // Mengembalikan daftar kode yang baru dihapus, supaya pemanggil
    // (DashboardTentor.vue) tahu kalau akunnya sendiri yang terhapus lalu logout.
    // ============================================
    checkExpiredContracts() {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const expired = this.rows.filter((r) => {
        if (!r.habisKontrak) return false
        return new Date(r.habisKontrak + 'T00:00:00') < today
      })

      expired.forEach((row) => this.removeByKode(row.kodeTentor))

      return expired.map((r) => r.kodeTentor)
    },
  },
})