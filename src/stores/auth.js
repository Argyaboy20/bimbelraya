import { defineStore } from 'pinia'

// Durasi session: 1 jam (dalam milidetik)
const SESSION_DURATION = 60 * 60 * 1000

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: false,
    role: null,        // 'admin' atau 'tentor'
    user: null,
    kodeTentor: null,  // diakses langsung tanpa harus buka user.kodeTentor
    expiresAt: null    // timestamp kapan session berakhir
  }),

  actions: {
    login(userData) {
      this.isLoggedIn = true
      this.role = userData.role
      this.user = userData
      this.kodeTentor = userData.kodeTentor || null
      this.expiresAt = Date.now() + SESSION_DURATION

      // Simpan ke localStorage supaya bertahan walau halaman di-refresh,
      // tapi tetap expired otomatis setelah 1 jam
      localStorage.setItem('authSession', JSON.stringify({
        role: this.role,
        user: this.user,
        kodeTentor: this.kodeTentor,
        expiresAt: this.expiresAt
      }))
    },

    logout() {
      this.isLoggedIn = false
      this.role = null
      this.user = null
      this.kodeTentor = null
      this.expiresAt = null
      localStorage.removeItem('authSession')
    },

    // Dipanggil sekali saat aplikasi pertama dibuka (di App.vue)
    // Cek apakah ada session tersimpan dan masih berlaku
    restoreSession() {
      const saved = localStorage.getItem('authSession')
      if (!saved) return

      const session = JSON.parse(saved)

      // Kalau sudah lewat 1 jam → anggap expired, hapus, paksa login ulang
      if (Date.now() > session.expiresAt) {
        localStorage.removeItem('authSession')
        return
      }

      // Masih berlaku → restore state seperti semula
      this.isLoggedIn = true
      this.role = session.role
      this.user = session.user
      this.kodeTentor = session.kodeTentor
      this.expiresAt = session.expiresAt
    }
  }
})