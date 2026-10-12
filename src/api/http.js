// Satu-satunya pintu untuk memanggil backend.
// Menempelkan token otomatis, menangani sesi habis (401), dan menyeragamkan error.
import { useAuthStore } from '@/stores/auth'

const BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')
const TIMEOUT_MS = 30_000

export class ApiError extends Error {
  constructor(status, message, data = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status // 0 = tidak bisa terhubung ke server
    this.data = data // isi balasan server (mis. batas tanggal min/max)
  }
}

// auth: false untuk login/daftar/halaman publik (tanpa token, dan 401 tidak berarti sesi habis)
export async function api(path, { method = 'GET', body, auth = true } = {}) {
  if (!BASE_URL) throw new ApiError(0, 'Alamat server belum diatur (VITE_API_URL).')

  const authStore = useAuthStore()
  const headers = {}
  if (auth && authStore.token) headers.Authorization = `Bearer ${authStore.token}`

  let payload
  if (body instanceof FormData) {
    payload = body // browser mengatur Content-Type + boundary sendiri
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
    payload = JSON.stringify(body)
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  let res
  try {
    res = await fetch(BASE_URL + path, { method, headers, body: payload, signal: controller.signal })
  } catch {
    throw new ApiError(0, 'Tidak dapat terhubung ke server. Periksa koneksi internet kamu lalu coba lagi.')
  } finally {
    clearTimeout(timer)
  }

  let data = null
  if (res.status !== 204) {
    try {
      data = await res.json()
    } catch {
      data = null
    }
  }
  if (res.ok) return data

  // 401 pada permintaan yang membawa token = sesi habis atau tidak valid → keluar
  if (res.status === 401 && auth && authStore.isLoggedIn) {
    const tujuan = authStore.role === 'admin' ? '/daftar' : '/login' // sama dengan penjaga router
    authStore.logout()
    window.location.assign(tujuan)
  }

  throw new ApiError(res.status, data?.message || 'Terjadi kesalahan pada server', data)
}