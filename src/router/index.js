import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Publik
import LandingPage from '@/views/LandingPage.vue'
import LoginPage from '@/views/LoginPage.vue'
import SignInPage from '@/views/SignInPage.vue'
import LoginAdmin from '@/views/LoginAdmin.vue'
import LowonganTentor from '@/views/Lowongan.vue'

// Admin
import AdminDashboard from '@/views/admin/Dashboard.vue'
import DataTentor from '@/views/admin/DataTentor.vue'
import DataWaliMurid from '@/views/admin/DataWaliMurid.vue'
import LaporanPresensi from '@/views/admin/LaporanPresensi.vue'

// Tentor
import DashboardTentor from '@/views/tentor/DashboardTentor.vue'
import TentorBiodata from '@/views/tentor/Biodata.vue'
import TentorPresensi from '@/views/tentor/Presensi.vue'
import PerpanjangKontrak from '@/views/tentor/PerpanjangKontrak.vue'

const routes = [
  // ===== PUBLIK =====
  {
    path: '/',
    component: LandingPage, // ← buka pertama kali langsung ke sini
    meta: { title: 'Bimbel Raya' },
  },
  {
    path: '/login',
    component: LoginPage,
    meta: { title: 'Bimbel Raya - Masuk Akun' },
  },
  {
    path: '/daftar',
    component: SignInPage,
    meta: { title: 'Bimbel Raya - Daftar Tentor' },
  },
  {
    // BARU: halaman login khusus admin, publik tapi terpisah dari login tentor
    path: '/loginadmin',
    component: LoginAdmin,
    meta: { title: 'Bimbel Raya - Portal Admin' },
  },
  {
    path: '/lowongan',
    component: LowonganTentor,
    meta: { title: 'Bimbel Raya - Lowongan Tentor' },
  },

  // ===== ADMIN (butuh login + role admin) =====
  {
    path: '/admin',
    redirect: '/admin/dashboard',
    meta: { requiresAuth: true, role: 'admin' },
    children: [
      {
        path: 'dashboard',
        component: AdminDashboard,
        meta: { requiresAuth: true, role: 'admin', title: 'Dashboard Admin' },
      },
      {
        path: 'tentor',
        component: DataTentor,
        meta: { requiresAuth: true, role: 'admin', title: 'Data Tentor' },
      },
      {
        path: 'walimurid',
        component: DataWaliMurid,
        meta: { requiresAuth: true, role: 'admin', title: 'Data Wali Murid' },
      },
      {
        path: 'presensi',
        component: LaporanPresensi,
        meta: { requiresAuth: true, role: 'admin', title: 'Laporan Presensi' },
      },
    ],
  },

  // ===== TENTOR (butuh login + role tentor) =====
  {
    path: '/tentor',
    redirect: (to) => {
      // Redirect ke dashboard tentor sesuai kode yang sedang login
      const auth = useAuthStore()
      return `/tentor/dashboardtentor/${auth.kodeTentor}`
    },
    meta: { requiresAuth: true, role: 'tentor' },
    children: [
      {
        path: 'dashboardtentor/:id',
        component: DashboardTentor,
        meta: { requiresAuth: true, role: 'tentor', title: 'Bimbel Raya - Dashboard Tentor' },
      },
      {
        // :id = kode tentor, dummy sekarang "1001", nanti diisi otomatis dari auth.kodeTentor
        // saat komponen membuat link (lihat DashboardTentor.vue)
        path: 'biodata/:id',
        component: TentorBiodata,
        meta: { requiresAuth: true, role: 'tentor', title: 'Bimbel Raya - Biodata Tentor' },
      },
      {
        path: 'presensi/:id',
        component: TentorPresensi,
        meta: { requiresAuth: true, role: 'tentor', title: 'Bimbel Raya - Presensi Tentor' },
      },
      {
        path: 'kontrak/:id',
        component: PerpanjangKontrak,
        meta: { requiresAuth: true, role: 'tentor', title: 'Bimbel Raya - Perpanjang Kontrak' },
      },
    ],
  },

  // ===== CATCH ALL (halaman tidak ditemukan) =====
  {
    path: '/:pathMatch(.*)*',
    redirect: '/', // kalau url salah, balik ke landing
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// ===== PROTEKSI ROUTING + JUDUL TAB DINAMIS =====
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Bimbel Raya'

  const auth = useAuthStore()

  // Restore session dari localStorage DULU sebelum cek apapun
  // supaya refresh halaman tidak paksa logout / tembus proteksi
  if (!auth.isLoggedIn) {
    auth.restoreSession()
  }

  if (to.meta.requiresAuth) {
    if (!auth.isLoggedIn) {
      // Belum login sama sekali → arahkan sesuai area yang dituju
      if (to.path.startsWith('/admin')) {
        next('/daftar') // ← area admin → ke /daftar, /loginadmin tetap tersembunyi
      } else {
        next('/login') // ← area tentor → ke login tentor
      }
    } else if (to.meta.role && auth.role !== to.meta.role) {
      // Sudah login tapi role salah → redirect ke halaman rolenya
      if (auth.role === 'tentor') {
        next(`/tentor/dashboardtentor/${auth.kodeTentor}`)
      } else if (auth.role === 'admin') {
        next('/admin/dashboard')
      } else {
        next('/login')
      }
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
