// Worker bimbelraya: menjaga API di Render tetap bangun lewat jadwal (cron).
// Halaman dan aset tetap dilayani oleh Cloudflare static assets.
const URL_PING = 'https://bimbelraya-api.onrender.com/api/ping'

export default {
  // Permintaan yang sampai ke Worker diteruskan ke aset statis
  async fetch(request, env) {
    return env.ASSETS.fetch(request)
  },

  // Dipanggil sesuai jadwal di wrangler.jsonc (triggers.crons)
  async scheduled(_event, _env, ctx) {
    ctx.waitUntil(
      fetch(URL_PING, { signal: AbortSignal.timeout(60000) }).catch(() => {}),
    )
  },
}