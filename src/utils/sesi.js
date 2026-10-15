// Menjaga sesi tetap hidup selama pengguna aktif, dan memberi peringatan bila sesi hampir habis.
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { api, ApiError } from '@/api/http'

const PERPANJANG_BILA_SISA_KURANG_DARI = 15 * 60 * 1000 // 15 menit
const PERINGATAN_BILA_SISA_KURANG_DARI = 5 * 60 * 1000 // 5 menit
const AKTIF_BILA_INTERAKSI_DALAM = 5 * 60 * 1000 // pengguna dianggap aktif 5 menit setelah interaksi terakhir
const CEK_TIAP = 30 * 1000 // 30 detik

// true = tampilkan banner "sesi hampir berakhir"
export const sesiHampirHabis = ref(false)

let terakhirAktif = Date.now()
let sedangMemperpanjang = false
let batasTercapai = false // server menolak karena sudah 8 jam sejak login; jangan coba lagi

const tandaiAktif = () => {
  terakhirAktif = Date.now()
}

async function periksa() {
  const auth = useAuthStore()
  if (!auth.isLoggedIn || !auth.expiresAt) {
    sesiHampirHabis.value = false
    batasTercapai = false
    return
  }

  let sisa = auth.expiresAt - Date.now()
  const aktif = Date.now() - terakhirAktif < AKTIF_BILA_INTERAKSI_DALAM

  if (sisa > 0 && sisa < PERPANJANG_BILA_SISA_KURANG_DARI && aktif && !batasTercapai && !sedangMemperpanjang) {
    sedangMemperpanjang = true
    try {
      const data = await api('/api/auth/refresh', { method: 'POST' })
      auth.perbaruiToken(data)
    } catch (err) {
      // 403 = batas 8 jam tercapai. Gangguan jaringan atau server tidur: coba lagi pada pemeriksaan berikutnya.
      if (err instanceof ApiError && err.status === 403) batasTercapai = true
    } finally {
      sedangMemperpanjang = false
    }
    sisa = auth.expiresAt ? auth.expiresAt - Date.now() : 0
  }

  sesiHampirHabis.value = sisa > 0 && sisa < PERINGATAN_BILA_SISA_KURANG_DARI
}

// Panggil sekali saat aplikasi dibuka; mengembalikan fungsi untuk menghentikan pemantauan.
export function mulaiPemantauanSesi() {
  const peristiwa = ['pointerdown', 'keydown', 'touchstart', 'scroll']
  peristiwa.forEach((p) => window.addEventListener(p, tandaiAktif, { passive: true }))

  const saatTabTerlihat = () => {
    if (document.visibilityState === 'visible') {
      tandaiAktif()
      periksa()
    }
  }
  document.addEventListener('visibilitychange', saatTabTerlihat)

  const timer = setInterval(periksa, CEK_TIAP)
  periksa()

  return () => {
    peristiwa.forEach((p) => window.removeEventListener(p, tandaiAktif))
    document.removeEventListener('visibilitychange', saatTabTerlihat)
    clearInterval(timer)
  }
}