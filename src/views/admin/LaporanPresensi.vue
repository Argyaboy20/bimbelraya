<!-- LaporanPresensi.vue -->
<template>
  <div class="laporan-page">
    <Navbar />

    <div class="page-content">
      <div class="page-header">
        <div>
          <h1 class="page-title">Laporan Presensi Tentor</h1>
          <p class="page-date">{{ formattedToday }}</p>
        </div>
        <!-- Pilihan tampilan -->
        <div class="tab-row">
          <button class="tab-btn" :class="{ aktif: tampilan === 'harian' }" @click="tampilan = 'harian'">
            Harian
          </button>
          <button class="tab-btn" :class="{ aktif: tampilan === 'bulanan' }" @click="tampilan = 'bulanan'">
            Rekap Bulanan
          </button>
        </div>

        <!-- Navigasi ganti hari -->
        <div v-if="tampilan === 'harian'" class="date-nav">
          <button class="btn-nav" @click="prevDay">‹ Sebelumnya</button>
          <span class="date-label">{{ formattedSelectedDate }}</span>
          <button class="btn-nav" @click="nextDay" :disabled="isToday">Berikutnya ›</button>
        </div>
      </div>

      <!-- ===== RINGKASAN HARI INI ===== -->
      <div v-if="tampilan === 'harian'" class="summary-row">
        <div class="summary-card card-blue">
          <div class="summary-number">{{ sudahPresensi }}</div>
          <div class="summary-label">Sudah Presensi</div>
        </div>
        <div class="summary-card card-orange">
          <div class="summary-number">{{ belumPresensi }}</div>
          <div class="summary-label">Belum Presensi</div>
        </div>
        <div class="summary-card card-cream">
          <div class="summary-number">{{ totalTentor }}</div>
          <div class="summary-label">Total Tentor Aktif</div>
        </div>
      </div>

      <!-- ===== LIST PRESENSI ===== -->
      <div v-if="tampilan === 'harian'" class="presensi-section">
        <h2 class="section-title">Detail Presensi</h2>

        <p v-if="isToday" class="live-info" :class="{ 'live-gagal': galatLive }">
          <span class="live-titik"></span>
          {{ galatLive ? 'Koneksi terganggu · mencoba lagi' : 'Langsung' }}
          <template v-if="jamDiperbarui"> · diperbarui {{ jamDiperbarui }}</template>
        </p>

        <!-- Memuat data -->
        <div v-if="memuat && presensiHariIni.length === 0" class="empty-state">
          <p class="empty-text">Memuat data presensi...</p>
        </div>

        <!-- Gagal memuat -->
        <div v-else-if="galat" class="empty-state">
          <div class="empty-icon">⚠️</div>
          <p class="empty-text">{{ galat }}</p>
        </div>

        <!-- Belum ada presensi sama sekali pada tanggal ini -->
        <div v-else-if="presensiHariIni.length === 0" class="empty-state">
          <div class="empty-icon">📋</div>
          <p class="empty-text">
            Belum ada tentor yang presensi {{ isToday ? 'hari ini' : 'pada tanggal ini' }}
          </p>
          <p class="empty-sub">Data akan muncul otomatis saat tentor melakukan presensi</p>
        </div>

        <!-- Ada data presensi -->
        <div v-else class="presensi-list">
          <div
            v-for="(item, index) in presensiHariIni"
            :key="item.id"
            class="presensi-card"
          >
            <!-- Info tentor -->
            <div class="presensi-left">
              <div class="tentor-avatar">{{ item.namaTentor.charAt(0).toUpperCase() }}</div>
              <div class="tentor-info">
                <p class="tentor-nama">
                  {{ item.namaTentor }}
                  <span v-if="baru[item.id]" class="badge-baru">Baru</span>
                </p>
                <p class="tentor-kode">Kode: {{ item.kodeTentor }}</p>
              </div>
            </div>

            <!-- Detail presensi -->
            <div class="presensi-right">
              <p class="presensi-waktu">
                ✅ Sudah melakukan absensi pada pukul
                <strong>{{ item.jamPresensi }} WIB</strong>
              </p>
              <p class="presensi-materi">
                🎓 <strong>Siswa:</strong>
                <template v-if="item.namaSiswa">
                  {{ item.namaSiswa }} · Kelas {{ item.kelasSiswa }} · Wali: {{ item.namaWalimurid }}
                </template>
                <template v-else>—</template>
              </p>
              <p class="presensi-materi">📖 <strong>Materi:</strong> {{ item.materi }}</p>
              <!-- Foto bukti presensi (selfie): link sementara dari server -->
              <div class="foto-wrapper" v-if="item.fotoUrl">
                <img :src="item.fotoUrl" alt="Bukti presensi" class="foto-presensi" />
              </div>
              <div v-else class="foto-placeholder">
                📷 Foto bukti presensi sudah dihapus (tentor tidak lagi terdaftar)
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== REKAP BULANAN ===== -->
        <div v-if="tampilan === 'bulanan'" class="presensi-section">
          <div class="date-nav bulan-nav">
            <button class="btn-nav" @click="prevBulan">‹ Sebelumnya</button>
            <span class="date-label">{{ formattedBulan }}</span>
            <button class="btn-nav" @click="nextBulan" :disabled="isBulanIni">Berikutnya ›</button>
          </div>

          <h2 class="section-title">Rekap Presensi per Bulan</h2>

          <div v-if="memuatRekap && rekap.length === 0" class="empty-state">
            <p class="empty-text">Memuat rekap bulanan...</p>
          </div>

          <div v-else-if="galatRekap" class="empty-state">
            <div class="empty-icon">⚠️</div>
            <p class="empty-text">{{ galatRekap }}</p>
          </div>

          <div v-else-if="rekap.length === 0" class="empty-state">
            <div class="empty-icon">📋</div>
            <p class="empty-text">Belum ada presensi pada bulan ini</p>
          </div>

          <div v-else class="presensi-list">
            <div v-for="item in rekap" :key="item.kodeTentor" class="presensi-card">
              <div class="presensi-left">
                <div class="tentor-avatar">{{ item.namaTentor.charAt(0).toUpperCase() }}</div>
                <div class="tentor-info">
                  <p class="tentor-nama">{{ item.namaTentor }}</p>
                  <p class="tentor-kode">Kode: {{ item.kodeTentor }}</p>
                  <span v-if="!item.masihTerdaftar" class="badge-tidak-aktif">
                    Sudah tidak terdaftar
                  </span>
                </div>
              </div>

              <div class="presensi-right">
                <p class="presensi-waktu">
                  📅 Hadir <strong>{{ item.jumlahHari }} hari</strong> ·
                  <strong>{{ item.jumlahPertemuan }} pertemuan</strong>
                </p>
                <p class="presensi-materi">📝 Total {{ item.jumlahEntri }} kali presensi dikirim</p>
                <ul class="rincian-siswa">
                  <li v-for="s in item.siswa" :key="s.lesId ?? 'lama'">
                    <span class="rincian-nama">
                      <template v-if="s.namaSiswa">
                        {{ s.namaSiswa }}
                        <small>Kelas {{ s.kelas }} · Wali: {{ s.namaWalimurid }}</small>
                      </template>
                      <template v-else>
                        Tanpa data siswa <small>(presensi sebelum fitur Les Siswa)</small>
                      </template>
                    </span>
                    <strong class="rincian-jumlah">{{ s.jumlahPertemuan }} pertemuan</strong>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import Navbar from '@/components/Navbar.vue'
import { api, ApiError } from '@/api/http'

// ============================================
// TANGGAL — zona waktu Jakarta (sama seperti server)
// ============================================
const hariIniKey = () =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta' }).format(new Date())

const geserHari = (key, n) => {
  const d = new Date(key + 'T00:00:00Z')
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}

const geserBulan = (bulan, n) => {
  const [y, m] = bulan.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1 + n, 1)).toISOString().slice(0, 7)
}

const formatTanggal = (key) =>
  new Date(key + 'T00:00:00').toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

const formatBulan = (bulan) =>
  new Date(bulan + '-01T00:00:00').toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })

const today = hariIniKey()
const tampilan = ref('harian') // 'harian' | 'bulanan'

// ============================================
// LAPORAN HARIAN — navigasi per hari
// ============================================
const selectedDate = ref(today)
const isToday = computed(() => selectedDate.value === today)
const formattedToday = computed(() => `Hari ini: ${formatTanggal(today)}`)
const formattedSelectedDate = computed(() => formatTanggal(selectedDate.value))

const prevDay = () => {
  selectedDate.value = geserHari(selectedDate.value, -1)
}
const nextDay = () => {
  if (isToday.value) return
  selectedDate.value = geserHari(selectedDate.value, 1)
}

const laporan = ref({
  ringkasan: { sudahPresensi: 0, belumPresensi: 0, totalTentor: 0 },
  data: [],
})

// ============================================
// Pembaruan otomatis (polling) hanya saat melihat HARI INI
// ============================================
const POLLING_MS = 20_000 // periksa data baru tiap 20 detik (hanya saat tab terlihat)
const FOTO_SEGAR_MS = 3 * 60 * 1000 // link foto dipakai ulang sampai 3 menit (aslinya berlaku 5 menit)
const TANDA_BARU_MS = 60 * 1000 // tanda "Baru" tampil 1 menit

const memuat = ref(false)
const galat = ref('')
const galatLive = ref(false) // pemeriksaan otomatis gagal sesaat
const terakhirDiperbarui = ref(null)
const baru = ref({}) // { idPresensi: waktuKedaluwarsaTanda }
let permintaanHarian = 0
let sedangMemeriksa = false
let linkFoto = new Map() // idPresensi -> { link, waktu }

const jamDiperbarui = computed(() =>
  terakhirDiperbarui.value
    ? terakhirDiperbarui.value.toLocaleTimeString('id-ID', {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    : '',
)

// Pasang data baru: link foto yang masih segar dipakai ulang (foto tidak berkedip),
// dan entri yang baru muncul ditandai "Baru" (hanya untuk pemeriksaan otomatis).
const terapkan = (hasil, tandaiBaru) => {
  const sekarang = Date.now()
  const idLama = new Set(laporan.value.data.map((p) => p.id))
  const data = hasil.data.map((p) => {
    const simpan = linkFoto.get(p.id)
    if (simpan && p.fotoLink && simpan.link && sekarang - simpan.waktu < FOTO_SEGAR_MS) {
      return { ...p, fotoLink: simpan.link }
    }
    linkFoto.set(p.id, { link: p.fotoLink, waktu: sekarang })
    return p
  })
  const tanda = {}
  for (const [id, batas] of Object.entries(baru.value)) {
    if (batas > sekarang) tanda[id] = batas
  }
  if (tandaiBaru) {
    for (const p of data) if (!idLama.has(p.id)) tanda[p.id] = sekarang + TANDA_BARU_MS
  }
  baru.value = tanda
  laporan.value = { ...hasil, data }
}

// senyap = pemeriksaan otomatis: tanpa tulisan "memuat", dan gangguan sesaat tidak menghapus data
const muatHarian = async ({ senyap = false } = {}) => {
  const saya = ++permintaanHarian // jawaban lama tidak boleh menimpa jawaban baru
  if (!senyap) {
    memuat.value = true
    galat.value = ''
  }
  try {
    const hasil = await api(`/api/admin/presensi?tanggal=${selectedDate.value}`, {
      loading: !senyap,
    })
    if (saya === permintaanHarian) {
      terapkan(hasil, senyap)
      terakhirDiperbarui.value = new Date()
      galatLive.value = false
    }
  } catch (err) {
    if (saya !== permintaanHarian) return
    if (err instanceof ApiError && err.status === 401) return // sesi habis, sudah dialihkan ke login
    if (senyap) {
      galatLive.value = true // data lama tetap tampil, coba lagi pada putaran berikutnya
      return
    }
    galat.value = err instanceof ApiError ? err.message : 'Gagal memuat laporan presensi.'
  } finally {
    if (!senyap && saya === permintaanHarian) memuat.value = false
  }
}

// Bentuk baris mengikuti yang dipakai template
const presensiHariIni = computed(() =>
  laporan.value.data.map((p) => ({ ...p, jamPresensi: p.jam, fotoUrl: p.fotoLink })),
)

// Dihitung server: sudah presensi per tentor (bukan per entri); tentor aktif = kontrak belum lewat
const sudahPresensi = computed(() => laporan.value.ringkasan.sudahPresensi)
const belumPresensi = computed(() => laporan.value.ringkasan.belumPresensi)
const totalTentor = computed(() => laporan.value.ringkasan.totalTentor)

// ============================================
// REKAP BULANAN — per tentor (termasuk tentor yang sudah dihapus)
// ============================================
const bulanTerpilih = ref(today.slice(0, 7))
const isBulanIni = computed(() => bulanTerpilih.value === today.slice(0, 7))
const formattedBulan = computed(() => formatBulan(bulanTerpilih.value))

const prevBulan = () => {
  bulanTerpilih.value = geserBulan(bulanTerpilih.value, -1)
}
const nextBulan = () => {
  if (isBulanIni.value) return
  bulanTerpilih.value = geserBulan(bulanTerpilih.value, 1)
}

const rekap = ref([])
const memuatRekap = ref(false)
const galatRekap = ref('')
let permintaanRekap = 0

const muatRekap = async () => {
  const saya = ++permintaanRekap
  memuatRekap.value = true
  galatRekap.value = ''
  try {
    const hasil = await api(`/api/admin/presensi/rekap?bulan=${bulanTerpilih.value}`)
    if (saya === permintaanRekap) rekap.value = hasil.data
  } catch (err) {
    if (saya !== permintaanRekap) return
    if (err instanceof ApiError && err.status === 401) return
    galatRekap.value = err instanceof ApiError ? err.message : 'Gagal memuat rekap bulanan.'
  } finally {
    if (saya === permintaanRekap) memuatRekap.value = false
  }
}

// ============================================
// MUAT DATA
// ============================================
const bolehMemeriksa = () =>
  tampilan.value === 'harian' && isToday.value && document.visibilityState === 'visible'

const periksaBerkala = async () => {
  if (!bolehMemeriksa() || memuat.value || sedangMemeriksa) return
  sedangMemeriksa = true
  try {
    await muatHarian({ senyap: true })
  } finally {
    sedangMemeriksa = false
  }
}

let timerPolling = null
const saatTabTerlihat = () => {
  if (document.visibilityState === 'visible') periksaBerkala()
}

onMounted(() => {
  muatHarian()
  timerPolling = setInterval(periksaBerkala, POLLING_MS)
  document.addEventListener('visibilitychange', saatTabTerlihat)
})
onBeforeUnmount(() => {
  clearInterval(timerPolling)
  document.removeEventListener('visibilitychange', saatTabTerlihat)
})

watch(selectedDate, () => {
  linkFoto = new Map()
  baru.value = {}
  muatHarian()
})
watch(bulanTerpilih, muatRekap)
// Setiap pindah tab data dimuat ulang (link foto hanya berlaku 5 menit)
watch(tampilan, (t) => (t === 'bulanan' ? muatRekap() : muatHarian()))
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

* {
  font-family: 'DM Sans', sans-serif;
  box-sizing: border-box;
}

.laporan-page {
  width: 100%;
  min-height: 100vh;
  background: #f7f8fa;
}

/* =====================================================
   MOBILE (default, < 641px)
   ===================================================== */

.page-content {
  padding: 1.25rem 0.875rem 2.5rem;
  max-width: 900px;
  margin: 0 auto;
}

/* ===== HEADER ===== */
.page-header {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  margin-bottom: 1.25rem;
}
.page-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.15rem;
}
.page-date {
  font-size: 0.75rem;
  color: #6b7280;
}

/* ===== NAVIGASI HARI ===== */
.date-nav {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}
.btn-nav {
  padding: 0.4rem 0.75rem;
  border-radius: 8px;
  border: 1.5px solid #2E87F6;
  background: #fff;
  color: #2E87F6;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  white-space: nowrap;
}
.btn-nav:hover:not(:disabled) {
  background: #2E87F6;
  color: #fff;
}
.btn-nav:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.date-label {
  font-size: 0.8rem;
  font-weight: 700;
  color: #1f2937;
  flex: 1;
  text-align: center;
}

/* ===== RINGKASAN CARD ===== */
.summary-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.6rem;
  margin-bottom: 1.5rem;
}
.summary-card {
  border-radius: 12px;
  padding: 0.75rem 0.5rem;
  text-align: center;
  color: #fff;
}
.summary-number {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 0.25rem;
}
.summary-label {
  font-size: 0.62rem;
  font-weight: 500;
  opacity: 0.9;
  line-height: 1.3;
}
.card-blue {
  background: linear-gradient(135deg, #2E87F6 0%, #1d6fd4 100%);
  box-shadow: 0 4px 12px rgba(46, 135, 246, 0.25);
}
.card-orange {
  background: linear-gradient(135deg, #F35C2B 0%, #d6481c 100%);
  box-shadow: 0 4px 12px rgba(243, 92, 43, 0.25);
}
.card-cream {
  background: linear-gradient(135deg, #F9ECCC 0%, #f3dfa8 100%);
  color: #5a4a1f;
  box-shadow: 0 4px 12px rgba(243, 197, 92, 0.2);
}

/* ===== SECTION DETAIL ===== */
.section-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.875rem;
}

/* ===== EMPTY STATE ===== */
.empty-state {
  text-align: center;
  padding: 2.5rem 1rem;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);
}
.empty-icon {
  font-size: 2.5rem;
  margin-bottom: 0.6rem;
}
.empty-text {
  font-size: 0.9rem;
  font-weight: 700;
  color: #374151;
  margin-bottom: 0.25rem;
}
.empty-sub {
  font-size: 0.75rem;
  color: #9ca3af;
}

/* ===== PRESENSI LIST ===== */
.presensi-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* Mobile: card vertikal (atas-bawah) */
.presensi-card {
  background: #fff;
  border-radius: 14px;
  padding: 1rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  border-left: 4px solid #2E87F6;
}

/* Kiri: avatar + nama tentor */
.presensi-left {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}
.tentor-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2E87F6, #1d6fd4);
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.tentor-nama {
  font-size: 0.88rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}
.tentor-kode {
  font-size: 0.7rem;
  color: #6b7280;
  margin: 0;
}

/* Kanan: detail waktu & foto */
.presensi-right {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}
.presensi-waktu {
  font-size: 0.8rem;
  color: #374151;
  margin: 0;
  line-height: 1.4;
}
.presensi-materi {
  line-height: 1.5;
  white-space: pre-wrap;
  max-height: 7.5rem;
  overflow-y: auto;
  overflow-wrap: anywhere;
}

/* Foto bukti presensi */
.foto-wrapper {
  margin-top: 0.4rem;
}
.foto-presensi {
  width: 100%;
  max-width: 200px;
  height: 130px;
  object-fit: cover;
  border-radius: 10px;
  border: 2px solid #e5e7eb;
}
.foto-placeholder {
  font-size: 0.74rem;
  color: #9ca3af;
  margin-top: 0.35rem;
}

/* ===== TAB HARIAN / REKAP BULANAN ===== */
.tab-row {
  display: flex;
  gap: 0.5rem;
}
.tab-btn {
  flex: 1;
  padding: 0.6rem 1rem;
  border-radius: 999px;
  border: 1.5px solid #e5e7eb;
  background: #fff;
  font-size: 0.85rem;
  font-weight: 600;
  color: #6b7280;
  cursor: pointer;
  transition:
    background 0.2s,
    color 0.2s,
    border-color 0.2s;
}
.tab-btn.aktif {
  background: #2e87f6;
  border-color: #2e87f6;
  color: #fff;
}
.bulan-nav {
  margin-bottom: 1rem;
}
.badge-tidak-aktif {
  display: inline-block;
  margin-top: 0.25rem;
  padding: 0.15rem 0.55rem;
  border-radius: 999px;
  background: #fee2e2;
  color: #b91c1c;
  font-size: 0.7rem;
  font-weight: 600;
}

/* ===== PEMBARUAN OTOMATIS ===== */
.live-info {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin: 0 0 0.75rem;
  font-size: 0.78rem;
  color: #16a34a;
}
.live-info.live-gagal {
  color: #b8400f;
}
.live-titik {
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 50%;
  background: currentColor;
  animation: live-denyut 1.6s ease-in-out infinite;
}
@keyframes live-denyut {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}
.badge-baru {
  margin-left: 0.4rem;
  padding: 0.1rem 0.45rem;
  border-radius: 999px;
  background: #f35c2b;
  color: #fff;
  font-size: 0.66rem;
  font-weight: 700;
  vertical-align: middle;
}

/* ===== RINCIAN PER SISWA (rekap bulanan) ===== */
.rincian-siswa {
  list-style: none;
  margin: 0.6rem 0 0;
  padding: 0.6rem 0 0;
  border-top: 1px dashed #e5e7eb;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.rincian-siswa li {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem;
  font-size: 0.8rem;
  color: #1f2937;
}
.rincian-nama small {
  display: block;
  font-size: 0.72rem;
  color: #6b7280;
}
.rincian-jumlah {
  white-space: nowrap;
  color: #2e87f6;
}

/* =====================================================
   BREAKPOINTS (sama seperti file-file lain)
   @media 641px  : tablet
   @media 768px  : desktop
   @media 1024px : large desktop
   ===================================================== */

/* ===== TABLET (≥ 641px) ===== */
@media (min-width: 641px) {

  .page-content {
    padding: 1.4rem 1.1rem 2.75rem;
  }

  .page-header {
    gap: 0.95rem;
    margin-bottom: 1.35rem;
  }
  .page-title {
    font-size: 1.15rem;
  }
  .page-date {
    font-size: 0.77rem;
  }

  .btn-nav {
    padding: 0.42rem 0.85rem;
    font-size: 0.8rem;
  }
  .date-label {
    font-size: 0.84rem;
  }

  .summary-row {
    gap: 0.7rem;
    margin-bottom: 1.6rem;
  }
  .summary-card {
    padding: 0.85rem 0.6rem;
    border-radius: 13px;
  }
  .summary-number {
    font-size: 1.65rem;
  }
  .summary-label {
    font-size: 0.65rem;
  }

  .section-title {
    font-size: 0.97rem;
    margin-bottom: 0.9rem;
  }

  .empty-state {
    padding: 2.75rem 1rem;
  }

  /* Presensi card: masih vertikal di tablet, tapi lebih lega */
  .presensi-card {
    padding: 1.05rem 1.1rem;
    gap: 0.8rem;
  }
  .tentor-avatar {
    width: 40px;
    height: 40px;
    font-size: 1.02rem;
  }
  .tentor-nama {
    font-size: 0.9rem;
  }
  .tentor-kode {
    font-size: 0.71rem;
  }
  .presensi-waktu {
    font-size: 0.81rem;
  }
  .presensi-materi {
    font-size: 0.79rem;
  }
  .foto-presensi {
    max-width: 210px;
    height: 140px;
  }
}

/* ===== DESKTOP (≥ 768px) ===== */
@media (min-width: 768px) {

  .page-content {
    padding: 1.5rem 1.5rem 3rem;
  }

  /* Header: horizontal */
  .page-header {
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
  .page-title {
    font-size: 1.2rem;
  }
  .page-date {
    font-size: 0.78rem;
  }

  /* Navigasi hari */
  .btn-nav {
    padding: 0.45rem 1rem;
    font-size: 0.82rem;
  }
  .date-label {
    font-size: 0.88rem;
    flex: unset;
  }

  /* Summary cards */
  .summary-row {
    gap: 0.85rem;
    margin-bottom: 1.75rem;
  }
  .summary-card {
    padding: 1rem;
    border-radius: 14px;
  }
  .summary-number {
    font-size: 1.8rem;
  }
  .summary-label {
    font-size: 0.68rem;
  }

  /* Section title */
  .section-title {
    font-size: 1rem;
  }

  /* Presensi card: horizontal di desktop */
  .presensi-card {
    flex-direction: row;
    align-items: flex-start;
    padding: 1.1rem 1.25rem;
    gap: 1rem;
  }
  .presensi-left {
    min-width: 180px;
    flex-shrink: 0;
  }
  .tentor-avatar {
    width: 42px;
    height: 42px;
    font-size: 1.05rem;
  }
  .tentor-nama {
    font-size: 0.92rem;
  }
  .tentor-kode {
    font-size: 0.72rem;
  }
  .presensi-waktu {
    font-size: 0.83rem;
  }
  .presensi-materi {
    font-size: 0.8rem;
  }
  .foto-presensi {
    max-width: 220px;
    height: 150px;
  }
}

/* ===== LARGE DESKTOP (≥ 1024px) ===== */
@media (min-width: 1024px) {

  .page-content {
    padding: 2rem 2rem 4rem;
  }

  .page-title {
    font-size: 1.4rem;
  }
  .page-date {
    font-size: 0.82rem;
  }

  /* Summary */
  .summary-row {
    gap: 1.1rem;
    margin-bottom: 2rem;
  }
  .summary-card {
    padding: 1.25rem 1rem;
    border-radius: 16px;
  }
  .summary-number {
    font-size: 2.2rem;
    margin-bottom: 0.3rem;
  }
  .summary-label {
    font-size: 0.72rem;
  }

  /* Section title */
  .section-title {
    font-size: 1.05rem;
    margin-bottom: 1rem;
  }

  /* Presensi card */
  .presensi-card {
    padding: 1.25rem 1.5rem;
    border-radius: 16px;
    gap: 1.25rem;
  }
  .presensi-left {
    min-width: 200px;
  }
  .tentor-avatar {
    width: 44px;
    height: 44px;
    font-size: 1.1rem;
  }
  .tentor-nama {
    font-size: 0.95rem;
  }
  .tentor-kode {
    font-size: 0.75rem;
  }
  .presensi-waktu {
    font-size: 0.85rem;
  }
  .presensi-materi {
    font-size: 0.82rem;
  }
  .foto-presensi {
    max-width: 240px;
    height: 160px;
  }

  /* Empty state */
  .empty-state {
    padding: 3rem 1rem;
  }
  .empty-icon {
    font-size: 3rem;
  }
  .empty-text {
    font-size: 1rem;
  }
  .empty-sub {
    font-size: 0.8rem;
  }
}
</style>