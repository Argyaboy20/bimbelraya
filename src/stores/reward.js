import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/api/http'

// 8 kriteria penilaian: urutan dan key sama dengan kolom di backend
export const KRITERIA = [
  { key: 'tepatWaktu', label: 'Tepat Waktu' },
  { key: 'konfirmasiHadir', label: 'Konfirmasi Jika Berhalangan Hadir' },
  { key: 'bersikapSopan', label: 'Bersikap Sopan' },
  { key: 'sabarMengajar', label: 'Sabar Ketika Mengajar' },
  { key: 'tidakKasar', label: 'Tidak Kasar Saat Mengajar' },
  { key: 'menguasaiMateri', label: 'Menguasai Materi' },
  { key: 'penjelasanMudah', label: 'Penjelasan Mudah Dipahami' },
  { key: 'mengulangiPenjelasan', label: 'Mengulangi Penjelasan Jika Tak Paham' },
]

// ===== Bantuan bulan (format "YYYY-MM", zona Jakarta) =====
export const bulanSekarang = () =>
  new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' }).slice(0, 7)

export function geserBulan(bulan, selisih) {
  const [tahun, bln] = bulan.split('-').map(Number)
  return new Date(Date.UTC(tahun, bln - 1 + selisih, 1)).toISOString().slice(0, 7)
}

export const namaBulan = (bulan) =>
  new Date(bulan + '-01T00:00:00Z')
    .toLocaleDateString('id-ID', { month: 'long', year: 'numeric', timeZone: 'UTC' })
    .toUpperCase()

// ===== Aturan nilai (sama dengan backend: bilangan bulat 1 sampai 10) =====
export const nilaiValid = (v) => v !== '' && v !== null && Number.isInteger(Number(v)) && Number(v) >= 1 && Number(v) <= 10

export const barisLengkap = (baris) => KRITERIA.every((k) => nilaiValid(baris[k.key]))

export const totalBaris = (baris) =>
  KRITERIA.reduce((jumlah, k) => jumlah + (nilaiValid(baris[k.key]) ? Number(baris[k.key]) : 0), 0)

const barisKosong = () => Object.fromEntries(KRITERIA.map((k) => [k.key, '']))

export const useRewardStore = defineStore('reward', () => {
  // Draf isian per bulan: { '2026-08': { '0026': { tepatWaktu: 8, ... } } }
  // Disimpan di memori selama aplikasi terbuka (refresh halaman = draf yang belum diumumkan hilang)
  const draf = ref({})
  // Status pengumuman per bulan: { '2026-08': { sudahDiumumkan, diumumkanPada } }
  const status = ref({})

  // Peringkat hanya untuk tentor yang kedelapan nilainya sudah terisi.
  // Nilai sama = peringkat sama, berikutnya loncat (70, 70, 65 → 1, 1, 3). Hasil: { kodeTentor: peringkat }
  function peringkatBulan(bulan, daftarKode) {
    const lengkap = daftarKode
      .filter((kode) => draf.value[bulan]?.[kode] && barisLengkap(draf.value[bulan][kode]))
      .map((kode) => ({ kode, total: totalBaris(draf.value[bulan][kode]) }))
      .sort((a, b) => b.total - a.total)
    const peta = {}
    lengkap.forEach((r, i) => {
      peta[r.kode] = i > 0 && r.total === lengkap[i - 1].total ? peta[lengkap[i - 1].kode] : i + 1
    })
    return peta
  }

  // Semua tentor di daftar sudah terisi lengkap → tombol UMUMKAN boleh muncul
  function semuaTerisi(bulan, daftarKode) {
    return (
      daftarKode.length > 0 &&
      daftarKode.every((kode) => draf.value[bulan]?.[kode] && barisLengkap(draf.value[bulan][kode]))
    )
  }

  // Ambil status bulan dari server dan siapkan draf-nya.
  // Bulan yang belum punya draf dan sudah pernah diumumkan: draf diisi dari hasil yang tersimpan.
  // Bulan yang sudah punya draf: isian admin dipertahankan, hanya tentor baru yang ditambah barisnya.
  async function muatBulan(bulan, daftarKode) {
    const data = await api(`/api/admin/reward?bulan=${bulan}`)
    status.value[bulan] = { sudahDiumumkan: data.sudahDiumumkan, diumumkanPada: data.diumumkanPada }

    const dariServer = new Map(data.data.map((d) => [d.kodeTentor, d.nilai]))
    const baru = draf.value[bulan] ? { ...draf.value[bulan] } : {}
    for (const kode of daftarKode) {
      if (!baru[kode]) baru[kode] = dariServer.has(kode) ? { ...dariServer.get(kode) } : barisKosong()
    }
    draf.value[bulan] = baru
  }

  // Tombol UMUMKAN: kirim nilai semua tentor di daftar. Melempar ApiError kalau ditolak server.
  async function umumkan(bulan, daftarKode) {
    const data = daftarKode.map((kode) => ({
      kodeTentor: kode,
      nilai: Object.fromEntries(KRITERIA.map((k) => [k.key, Number(draf.value[bulan][kode][k.key])])),
    }))
    const hasil = await api('/api/admin/reward/umumkan', {
      method: 'POST',
      body: { bulan, data },
      pesan: 'Mengumumkan reward…',
    })
    status.value[bulan] = { sudahDiumumkan: true, diumumkanPada: hasil.diumumkanPada }
  }

  return { draf, status, peringkatBulan, semuaTerisi, muatBulan, umumkan }
})