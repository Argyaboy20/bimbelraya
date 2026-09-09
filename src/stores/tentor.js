import { defineStore } from 'pinia'

export const useTentorStore = defineStore('tentor', {
  state: () => ({
    // ============================================
    // Data tentor yang SUDAH dikonfirmasi admin di DataTentor.vue.
    // Field-nya sama persis dengan kolom tabel DataTentor.vue.
    // Sumber data bersama yang dibaca juga oleh:
    // - PerpanjangKontrak.vue (tentor ajukan kontrak baru)
    // - DashboardTentor.vue (alert kontrak mau habis)
    // - SignInPage.vue (menyusul: verifikasi kode tentor saat daftar)
    //
    // Nanti diganti fetch dari backend:
    // async fetchTentor() {
    //   const res = await fetch('/api/admin/tentor')
    //   this.rows = await res.json()
    // }
    // ============================================
    rows: [],

    // ============================================
    // Riwayat kode tentor yang sudah di-generate & disetujui admin
    // (dipindah dari Dashboard.vue supaya bisa dipakai lintas halaman).
    // terpakai: false = kode masih tersedia untuk dipakai daftar
    // terpakai: true  = sudah dipakai satu akun tentor
    // ============================================
    kodeHistory: [],
  }),

  getters: {
    getByKode: (state) => (kode) => state.rows.find((r) => r.kodeTentor === kode) || null,
  },

  actions: {
    // ===== Dipanggil DataTentor.vue saat admin tekan "Iya" konfirmasi baris =====
    addRow(data) {
      this.rows.push({ ...data })
      // Nanti: await fetch('/api/admin/tentor', { method: 'POST', body: JSON.stringify(data) })
    },

    // ===== Dipanggil DataTentor.vue saat admin hapus baris manual =====
    removeByKode(kode) {
      this.rows = this.rows.filter((r) => r.kodeTentor !== kode)
      // Nanti: await fetch(`/api/admin/tentor/${kode}`, { method: 'DELETE' })
    },

    // ===== Dipanggil PerpanjangKontrak.vue saat tentor ajukan kontrak baru =====
    updateKontrak(kode, tanggalBaru) {
      const row = this.rows.find((r) => r.kodeTentor === kode)
      if (row) row.habisKontrak = tanggalBaru
      // Nanti: await fetch(`/api/tentor/${kode}/kontrak`, {
      //   method: 'PATCH', body: JSON.stringify({ habisKontrak: tanggalBaru })
      // })
    },

    // ===== Dipanggil Dashboard.vue admin saat "SETUJU" generate kode =====
    addKodeHistory(kode) {
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
    },

    // ===== Dipanggil SignInPage.vue (menyusul) saat tentor berhasil daftar pakai kode =====
    markKodeTerpakai(kode) {
      const entry = this.kodeHistory.find((k) => k.kode === kode)
      if (entry) entry.terpakai = true
    },

    // ============================================
    // Disapu setiap kali halaman tentor/admin relevan dimuat.
    // Kontrak yang sudah lewat tanggalnya (bukan hari ini, tapi
    // BENAR-BENAR sudah lewat) akan otomatis:
    // 1. Dihapus dari data tentor (seluruh baris miliknya)
    // 2. Kode tentornya dibebaskan lagi (terpakai: false) supaya
    //    bisa dipakai ulang akun lain secara acak
    //
    // Mengembalikan array kode yang baru saja dihapus, supaya
    // pemanggil (DashboardTentor.vue) bisa tahu kalau akunnya
    // sendiri yang baru saja kena hapus, dan bisa langsung logout.
    // ============================================
    checkExpiredContracts() {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const expired = this.rows.filter((r) => {
        if (!r.habisKontrak) return false
        const target = new Date(r.habisKontrak + 'T00:00:00')
        return target < today
      })

      expired.forEach((row) => {
        this.removeByKode(row.kodeTentor)
        const entry = this.kodeHistory.find((k) => k.kode === row.kodeTentor)
        if (entry) entry.terpakai = false
      })

      return expired.map((r) => r.kodeTentor)
    },
  },
})
