// Aturan, validasi, dan pembuat pesan pendaftaran anak (dikirim ke WhatsApp admin).
// Semua logika ada di sini supaya komponen modal hanya bertugas menampilkan.

export const NOMOR_WA_ADMIN = '6282164794445'

export const DAERAH = [
  'Kudus dan Sekitarnya',
  'Madiun dan Sekitarnya',
  'Semarang dan Sekitarnya',
  'Demak, Jogja dan Sekitarnya',
]

export const OPSI_PAKET = [1, 2, 3, 4, 5, 6, 7].map((n) => `${n}x seminggu`)
export const OPSI_PERIODE = ['Bulanan', 'Persiapan Ujian']
export const OPSI_GURU = ['Perempuan', 'Laki-laki']

// maksMapel: null = tidak dibatasi
export const JENJANG = {
  SD: {
    kode: 'SD',
    judulPesan: 'JENJANG TK / SD',
    maksMapel: null,
    labelMapel: 'Request Mapel (semua mapel/calistung/mengaji/pilihan)',
    contohMapel: 'Semua mapel',
    catatanMapel: 'Jenjang SD boleh memilih semua mapel, calistung, mengaji, atau mapel pilihan.',
  },
  SMP: {
    kode: 'SMP',
    judulPesan: 'JENJANG SMP/MTS',
    maksMapel: 2,
    labelMapel: 'Request Mapel (MTK/IPA/B.Inggris/B.Indo)',
    contohMapel: 'MTK dan IPA',
    catatanMapel: 'Jenjang SMP hanya bisa memilih maksimal 2 mapel (tidak bisa "semua mapel").',
  },
  SMA: {
    kode: 'SMA',
    judulPesan: 'JENJANG SMA/MA',
    maksMapel: 1,
    labelMapel: 'Request Mapel (MTK/Biologi/Fisika/Kimia/B.Inggris)',
    contohMapel: 'Fisika',
    catatanMapel: 'Jenjang SMA hanya bisa memilih 1 mapel (tidak bisa "semua mapel").',
  },
}

// Urutan sama dengan urutan baris di pesan WhatsApp. 'pilihan' = harus salah satu opsi.
export const KOLOM = [
  { key: 'namaAnak', label: 'Nama Anak', maks: 60 },
  { key: 'namaWali', label: 'Nama Walimurid', maks: 60 },
  { key: 'kelas', label: 'Kelas', maks: 20 },
  { key: 'asalSekolah', label: 'Asal Sekolah', maks: 80 },
  { key: 'alamat', label: 'Alamat Lengkap (Patokan)', maks: 250 },
  { key: 'paket', label: 'Pilihan Paket Seminggu (Berapa Kali Pertemuan)', pilihan: OPSI_PAKET },
  { key: 'hari', label: 'Hari pertemuan', maks: 60 },
  { key: 'periode', label: 'Periode (bulanan/persiapan ujian)', pilihan: OPSI_PERIODE },
  { key: 'jam', label: 'Jam (request/ikut guru)', maks: 40 },
  { key: 'guru', label: 'Guru (Perempuan/Laki-laki)', pilihan: OPSI_GURU },
  { key: 'mapel', label: '', maks: 80 }, // label mapel berbeda tiap jenjang
]

export const dataKosong = () => Object.fromEntries(KOLOM.map((k) => [k.key, '']))

export const labelKolom = (kodeJenjang, key) =>
  key === 'mapel' ? JENJANG[kodeJenjang].labelMapel : KOLOM.find((k) => k.key === key).label

// Buang karakter pemformat WhatsApp (* _ ~ `), rapikan spasi dan baris baru, lalu batasi panjang
export const bersihkan = (teks, maks = 200) =>
  String(teks ?? '')
    .replace(/[*_~`]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maks)

// ===== Penghitung mapel =====
const PEMISAH = /[,;/&+|\n]|\s+(?:dan|serta|dengan|atau)\s+/i
const SEMUA = /\b(semua|seluruh|semuanya|all)\b/i

// Kamus mapel umum: dipakai supaya "MTK IPA" (tanpa pemisah) tetap terhitung 2 mapel
const KAMUS = [
  { nama: 'Matematika', re: /\b(mtk|matematika|math)\b/i },
  { nama: 'IPA', re: /\bipa\b/i },
  { nama: 'IPS', re: /\bips\b/i },
  { nama: 'B.Inggris', re: /\b(b\.?\s?inggris|bahasa\s+inggris|inggris)\b/i },
  { nama: 'B.Indonesia', re: /\b(b\.?\s?indo(nesia)?|bahasa\s+indonesia)\b/i },
  { nama: 'Biologi', re: /\b(biologi|bio)\b/i },
  { nama: 'Fisika', re: /\bfisika\b/i },
  { nama: 'Kimia', re: /\bkimia\b/i },
]

export function hitungMapel(teks) {
  const potongan = String(teks ?? '')
    .split(new RegExp(PEMISAH.source, 'gi'))
    .map((s) => s.trim())
    .filter(Boolean)

  const daftar = []
  for (const p of potongan) {
    const dikenal = KAMUS.filter((k) => k.re.test(p))
    if (dikenal.length >= 2) daftar.push(...dikenal.map((k) => k.nama))
    else daftar.push(dikenal[0]?.nama ?? p)
  }
  // Penulisan ganda (mis. "MTK, Matematika") dihitung satu
  const unik = [...new Set(daftar.map((d) => d.toLowerCase()))]
  return { jumlah: unik.length, daftar: unik }
}

// Hasil: { galat: 'teks pesan' atau '', jumlah }
export function periksaMapel(kodeJenjang, teks) {
  const t = String(teks ?? '').trim()
  const j = JENJANG[kodeJenjang]
  if (!t) return { galat: '', jumlah: 0 }

  const { jumlah } = hitungMapel(t)
  if (j.maksMapel === null) return { galat: '', jumlah }

  if (SEMUA.test(t)) {
    return {
      galat: `Untuk jenjang ${j.kode}, "semua mapel" tidak bisa. Pilih maksimal ${j.maksMapel} mapel saja.`,
      jumlah,
    }
  }
  if (jumlah > j.maksMapel) {
    return {
      galat: `Jenjang ${j.kode} maksimal ${j.maksMapel} mapel. Kamu menulis ${jumlah} mapel.`,
      jumlah,
    }
  }
  return { galat: '', jumlah }
}

// ===== Validasi seluruh isian: hasilnya { key: 'pesan galat' } (kosong = semua benar) =====
export function validasiForm(kodeJenjang, data) {
  const galat = {}
  for (const k of KOLOM) {
    const nilai = String(data[k.key] ?? '').trim()
    if (!nilai) {
      galat[k.key] = 'Wajib diisi'
    } else if (k.pilihan) {
      if (!k.pilihan.includes(nilai)) galat[k.key] = 'Pilih salah satu opsi'
    } else if (bersihkan(nilai, 9999).length < 2) {
      galat[k.key] = 'Terlalu pendek'
    } else if (nilai.length > k.maks) {
      galat[k.key] = `Maksimal ${k.maks} karakter`
    }
  }
  const mapel = periksaMapel(kodeJenjang, data.mapel)
  if (mapel.galat) galat.mapel = mapel.galat
  return galat
}

// ===== Pesan WhatsApp =====
const PENUTUP =
  'Halo admin, saya mau daftarkan anak saya les. Berikut biodatanya ya. Mohon info lanjutannya'

export function buatPesan(kodeJenjang, daerah, data) {
  const j = JENJANG[kodeJenjang]
  if (!j) throw new Error('Jenjang tidak valid')
  if (!DAERAH.includes(daerah)) throw new Error('Daerah tidak valid')

  const baris = KOLOM.map(
    (k) => `- ${labelKolom(kodeJenjang, k.key)} : ${bersihkan(data[k.key], k.maks ?? 200)}`,
  )
  return [
    '*PENDAFTARAN LES PRIVAT BIMBEL RAYA*',
    '```' + j.judulPesan + '```',
    `_(${daerah})_`,
    '',
    ...baris,
    '',
    PENUTUP,
  ].join('\n')
}

export const buatTautanWa = (pesan) =>
  `https://wa.me/${NOMOR_WA_ADMIN}?text=${encodeURIComponent(pesan)}`