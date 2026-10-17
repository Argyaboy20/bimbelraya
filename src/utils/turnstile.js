// Cloudflare Turnstile (anti-bot). Tanpa VITE_TURNSTILE_SITE_KEY semuanya mati dan token kosong.
const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || ''
const URL_SKRIP = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
const TUNGGU_MAKS_MS = 20_000

export class TurnstileError extends Error {
  constructor(pesan) {
    super(pesan)
    this.name = 'TurnstileError'
  }
}

let muatSkrip = null
function muatTurnstile() {
  if (window.turnstile) return Promise.resolve(window.turnstile)
  if (!muatSkrip) {
    muatSkrip = new Promise((resolve, reject) => {
      const s = document.createElement('script')
      s.src = URL_SKRIP
      s.async = true
      s.onload = () => resolve(window.turnstile)
      s.onerror = () => {
        muatSkrip = null
        s.remove()
        reject(new Error('skrip gagal dimuat'))
      }
      document.head.appendChild(s)
    })
  }
  return muatSkrip
}

// Pasang widget di `elemen`. Mengembalikan { ambilToken, hancurkan }.
// Setiap token hanya berlaku sekali: setelah diambil, widget diminta membuat token baru.
export function buatTurnstile(elemen) {
  if (!SITE_KEY || !elemen) {
    const kosong = async () => ''
    return { ambilToken: kosong, ambilTokenLonggar: kosong, hancurkan() {} }
  }

  let idWidget = null
  let token = ''
  let galat = ''
  let menunggu = []
  let hancur = false

  const segarkan = () => {
    if (idWidget !== null && window.turnstile) window.turnstile.reset(idWidget)
  }
  const gagalkanSemua = (pesan) => {
    const daftar = menunggu
    menunggu = []
    daftar.forEach((m) => {
      clearTimeout(m.timer)
      m.reject(new TurnstileError(pesan))
    })
  }

  muatTurnstile()
    .then((ts) => {
      if (hancur) return
      idWidget = ts.render(elemen, {
        sitekey: SITE_KEY,
        appearance: 'interaction-only',
        callback: (t) => {
          galat = ''
          const m = menunggu.shift()
          if (m) {
            clearTimeout(m.timer)
            m.resolve(t)
            segarkan() // token sudah terpakai: minta yang baru
          } else {
            token = t
          }
        },
        'expired-callback': () => {
          token = ''
          segarkan()
        },
        'error-callback': () => {
          galat = 'Verifikasi keamanan gagal. Muat ulang halaman lalu coba lagi.'
          gagalkanSemua(galat)
        },
      })
    })
    .catch(() => {
      galat = 'Verifikasi keamanan tidak dapat dimuat. Matikan pemblokir iklan atau muat ulang halaman, lalu coba lagi.'
      gagalkanSemua(galat)
    })

  const ambilToken = () => {
    if (galat) {
      const g = galat
      galat = ''
      segarkan()
      return Promise.reject(new TurnstileError(g))
    }
    if (token) {
      const t = token
      token = ''
      segarkan()
      return Promise.resolve(t)
    }
    return new Promise((resolve, reject) => {
      const m = {
        resolve,
        reject,
        timer: setTimeout(() => {
          menunggu = menunggu.filter((x) => x !== m)
          reject(new TurnstileError('Verifikasi keamanan terlalu lama. Muat ulang halaman lalu coba lagi.'))
        }, TUNGGU_MAKS_MS),
      }
      menunggu.push(m)
    })
  }

  const hancurkan = () => {
    hancur = true
    gagalkanSemua('Dibatalkan')
    if (idWidget !== null && window.turnstile) {
      try {
        window.turnstile.remove(idWidget)
      } catch {
        // elemen sudah dilepas dari halaman
      }
    }
  }

  // Versi longgar: kalau widget gagal, kirim token kosong dan biarkan server yang memutuskan
  const ambilTokenLonggar = () => ambilToken().catch(() => '')

  return { ambilToken, ambilTokenLonggar, hancurkan }
}