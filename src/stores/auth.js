import { defineStore } from 'pinia'

// Durasi session: 1 jam (dalam milidetik)
const SESSION_DURATION = 60 * 60 * 1000

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: false,
    role: null,        // 'admin' atau 'tentor'
    user: null,
    kodeTentor: null,  // diakses langsung tanpa harus buka user.kodeTentor
    token: null,
    expiresAt: null    // timestamp kapan session berakhir
  }),

  actions: {
    login(userData) {
      // token dan expiresInSeconds datang dari server; sisanya jadi data pengguna
      const { token = null, expiresInSeconds, ...user } = userData
      this.isLoggedIn = true
      this.role = user.role
      this.user = user
      this.kodeTentor = user.kodeTentor || null
      this.token = token
      this.expiresAt = Date.now() + (expiresInSeconds ? expiresInSeconds * 1000 : SESSION_DURATION)

      // Simpan ke localStorage supaya bertahan walau halaman di-refresh,
      // tapi tetap expired otomatis setelah masa berlaku token habis
      localStorage.setItem('authSession', JSON.stringify({
        role: this.role,
        user: this.user,
        kodeTentor: this.kodeTentor,
        token: this.token,
        expiresAt: this.expiresAt
      }))
    },

    logout() {
      this.isLoggedIn = false
      this.role = null
      this.user = null
      this.kodeTentor = null
      this.token = null
      this.expiresAt = null
      localStorage.removeItem('authSession')
    },

        // Dipanggil setelah server mengeluarkan token baru (perpanjang sesi).
    // Data pengguna tidak berubah; hanya token dan masa berlakunya.
    perbaruiToken({ token, expiresInSeconds }) {
      if (!this.isLoggedIn) return
      this.token = token
      this.expiresAt = Date.now() + expiresInSeconds * 1000
      localStorage.setItem('authSession', JSON.stringify({
        role: this.role,
        user: this.user,
        kodeTentor: this.kodeTentor,
        token: this.token,
        expiresAt: this.expiresAt
      }))
    },

    // Dipanggil sekali saat aplikasi pertama dibuka (di App.vue)
    // Cek apakah ada session tersimpan dan masih berlaku
    restoreSession() {
      const saved = localStorage.getItem('authSession')
      if (!saved) return

      const session = JSON.parse(saved)

      // Kalau sudah lewat 1 jam → anggap expired, hapus, paksa login ulang
      if (!session.token || Date.now() > session.expiresAt) {
        localStorage.removeItem('authSession')
        return
      }

      // Masih berlaku → restore state seperti semula
      this.isLoggedIn = true
      this.role = session.role
      this.user = session.user
      this.kodeTentor = session.kodeTentor
      this.token = session.token
      this.expiresAt = session.expiresAt
    }
  }
})