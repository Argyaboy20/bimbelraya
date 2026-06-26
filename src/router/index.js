import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Publik
import LandingPage from '@/views/LandingPage.vue'
import LoginPage from '@/views/LoginPage.vue'
import SignInPage from '@/views/SignInPage.vue'
import LoginAdmin from '@/views/LoginAdmin.vue'

// Admin
import AdminDashboard from '@/views/admin/Dashboard.vue'
import DataTentor from '@/views/admin/DataTentor.vue'
import DataWaliMurid from '@/views/admin/DataWaliMurid.vue'
import LaporanPresensi from '@/views/admin/LaporanPresensi.vue'

// Tentor
import DashboardTentor from '@/views/tentor/Tentor.vue'
import TentorBiodata from '@/views/tentor/Biodata.vue'
import TentorPresensi from '@/views/tentor/Presensi.vue'
import PerpanjangKontrak from '@/views/tentor/PerpanjangKontrak.vue'

const routes = [
  // ===== PUBLIK =====
  {
    path: '/',
    component: LandingPage,    // ← buka pertama kali langsung ke sini
    meta: { title: 'Bimbel Raya' }
  },
  {
    path: '/login',
    component: LoginPage,
    meta: { title: 'Bimbel Raya - Masuk Akun' }
  },
  {
    path: '/daftar',
    component: SignInPage,
    meta: { title: 'Bimbel Raya - Daftar Tentor' }
  },
  {
    // BARU: halaman login khusus admin, publik tapi terpisah dari login tentor
    path: '/loginadmin',
    component: LoginAdmin,
    meta: { title: 'Bimbel Raya - Portal Admin' }
  },

  // ===== ADMIN (butuh login + role admin) =====
  {
    path: '/admin',
    meta: { requiresAuth: true, role: 'admin' },
    children: [
      {
        path: 'dashboard',
        component: AdminDashboard,
        meta: { requiresAuth: true, role: 'admin', title: 'Dashboard Admin' }
      },
      {
        path: 'tentor',
        component: DataTentor,
        meta: { requiresAuth: true, role: 'admin', title: 'Data Tentor' }
      },
      {
        path: 'walimurid',
        component: DataWaliMurid,
        meta: { requiresAuth: true, role: 'admin', title: 'Data Wali Murid' }
      },
      {
        path: 'presensi',
        component: LaporanPresensi,
        meta: { requiresAuth: true, role: 'admin', title: 'Laporan Presensi' }
      }
    ]
  },

  // ===== TENTOR (butuh login + role tentor) =====
  {
    path: '/tentor',
    meta: { requiresAuth: true, role: 'tentor' },
    children: [
      {
        path: 'dashboardtentor/:id',
        component: DashboardTentor,
        meta: { requiresAuth: true, role: 'tentor', title: 'Bimbel Raya - Dashboard Tentor' }
      },
      {
        path: 'biodata',
        component: TentorBiodata,
        meta: { requiresAuth: true, role: 'tentor', title: 'Bimbel Raya - Biodata Tentor' }
      },
      {
        path: 'presensi',
        component: TentorPresensi,
        meta: { requiresAuth: true, role: 'tentor', title: 'Bimbel Raya - Presensi Tentor' }
      },
      {
        path: 'kontrak',
        component: PerpanjangKontrak,
        meta: { requiresAuth: true, role: 'tentor', title: 'Bimbel Raya - Perpanjang Kontrak' }
      }
    ]
  },

  // ===== CATCH ALL (halaman tidak ditemukan) =====
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'              // kalau url salah, balik ke landing
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// ===== PROTEKSI ROUTING + JUDUL TAB DINAMIS =====
router.beforeEach((to, from, next) => {
  // Update judul tab browser sesuai meta.title halaman tujuan. Kalau halaman tidak punya meta.title, pakai default "Bimbel Raya"
  document.title = to.meta.title || 'Bimbel Raya'

  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    // Belum login → paksa ke halaman login. BARU: kalau target tujuan ada di area /admin, lempar ke /daftar tentor
    if (to.path.startsWith('/admin')) {
      next('/daftar')
    } else {
      next('/login')
    }
  } else if (to.meta.role && auth.role !== to.meta.role) {
    // Role salah → redirect ke halaman utama masing-masing role
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
})

export default router