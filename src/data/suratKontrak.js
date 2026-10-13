// Isi Surat Kontrak Tentor (Pasal I - VII), disalin persis dari
// "Surat Kontrak Bimbel Raya_Nama Lengkap.docx". Tanpa nomor surat, identitas pihak,
// tanggal, dan kolom tanda tangan.
//
// Penulisan teks: **tebal**  dan  *miring*
// Nomor ayat (1, 2, 3...) dan huruf sub-ayat (a, b, c...) dibuat otomatis dari urutannya.
// Penomoran "PASAL V" ganda mengikuti dokumen aslinya.

const mentah = [
  {
    nomor: 'I',
    judul: 'MASA BERLAKU PERJANJIAN',
    blok: [
      {
        tipe: 'paragraf',
        teks: 'Kedua belah pihak telah sepakat bahwa masa perjanjian ini berlaku sejak ditandatangani sampai dengan kedua belah pihak menyelesaikan kewajiban masing-masing.',
      },
    ],
  },
  {
    nomor: 'II',
    judul: '(JANGKA WAKTU KERJA)',
    blok: [
      {
        tipe: 'ayat',
        teks: '**Pihak Pertama** bersedia menerima **Pihak Kedua** untuk bekerja sebagai Tenaga Pengajar (Tentor) di Bimbel Raya untuk jangka waktu selama (3) bulan, terhitung sejak tanggal ditandatangani Surat Kontrak Kerja ini.',
      },
      {
        tipe: 'ayat',
        teks: 'Jika hasil evaluasi dan masukan dari walimurid pada bulan pertama tidak dapat memenuhi standar minimum yang ditetapkan Bimbel Raya, maka status masa kerja tidak dapat diperpanjang atau dinyatakan berakhir.',
      },
      {
        tipe: 'ayat',
        teks: 'Kerja dilaksanakan pada jadwal yang telah ditentukan walimurid. Segala perubahan jadwal wajib berkoordinasi dengan walimurid dan **Pihak Pertama** dan mencapai solusi untuk semua pihak.',
      },
    ],
  },
  {
    nomor: 'III',
    judul: '(HAK DAN KEWAJIBAN KEDUA BELAH PIHAK)',
    blok: [
      {
        tipe: 'ayat',
        teks: '**Pihak Pertama** berhak menegur, menindak, dan memberhentikan **Pihak Kedua** jika melakukan penyimpangan/penyelewengan dan atau melakukan tindakan yang merugikan bimbel ataupun walimurid serta tidak mentaati peraturan yang ada.',
      },
      {
        tipe: 'ayat',
        teks: '**Pihak Pertama** mempunyai kewajiban sebagai berikut:',
        sub: [
          'Memberikan atau memenuhi hak-hak **Pihak Kedua** sesuai pasal 3 ayat 3',
          'Melakukan evaluasi secara berkala mengenai perkembangan **Pihak Kedua** dalam hal pelaksanaan masa kerja.',
        ],
      },
      {
        tipe: 'ayat',
        teks: '**Pihak Kedua** memiliki hak-hak sebagai berikut:',
        sub: [
          'Memperoleh pengalaman bekerja secara nyata di dunia kerja.',
          'Memperoleh bimbingan atau arahan dari Bimbel Raya jika terdapat masalah dengan walimurid atau hal terkait lainnya.',
          'Diperbolehkan mengganti jadwal pertemuan dengan kesepakatan walimurid dan dikomunikasikan dengan bimbel.',
          'Gaji Tentor yang diberikan setiap akhir bulan.',
          'Surat rekomendasi dan rekomendasi linkedin (berdasarkan ketentuan tertentu).',
        ],
      },
      {
        tipe: 'ayat',
        teks: '**Pihak Kedua** mempunyai kewajiban sebagai berikut:',
        sub: [
          'Mengikuti semua peraturan yang ada.',
          'Melaksanakan seluruh tugas dengan penuh tanggung jawab.',
          'Menjaga nama baik Bimbel Raya dan profesionalitas selama periode kerja',
          'Tentor yang ingin mengundurkan diri tetapi memiliki tanggungan peserta didik, dimohon untuk konfirmasi ke **Pihak Pertama** jauh-jauh hari agar bisa dicarikan penggantinya (sesuai dengan pasal 5 ayat 2).',
          'Tentor yang mengundurkan diri dengan durasi kurang dari 1 bulan, wajib mencari penggantinya yang cocok dan bersedia.',
          'Tentor yang sudah klaim lowongan kerja yang tersedia, namun ternyata membuat walimurid dan anaknya minta pergantian tentor, wajib mencari penggantinya juga dan merekomendasikannya ke admin agar bisa dicek terlebih dahulu',
          'Jika terpaksa terlambat atau berhalangan hadir, harus konfirmasi ke walimurid maksimal 15 menit sebelum waktu les (alasan dapat diterima).',
          'Selama 1 bulan tidak boleh izin lebih dari 3x pertemuan (baik izin, sakit atau hal lainnya).',
          'Membuat suasana setiap pertemuan les yang aman dan nyaman bagi semua pihak.',
          'Fast respon ketika dihubungi dan tidak menghilang (melepas tanggung jawab secara sepihak)',
        ],
      },
    ],
  },
  {
    nomor: 'IV',
    judul: '(KERAHASIAAN PERUSAHAAN)',
    blok: [
      {
        tipe: 'paragraf',
        teks: '**Pihak Kedua** berkomitmen untuk menjaga alamat walimurid yang telah diberikan, yang selanjutnya akan disebut sebagai **DATA** yang telah diberikan, dengan cara berikut:',
      },
      {
        tipe: 'daftar',
        sub: [
          'Tidak dipergunakan selain untuk kepentingan **Pihak Pertama**',
          'Tidak memberi tahu atau memberikan ke **Pihak Lain** baik sengaja / tidak sengaja demi keuntungan tertentu',
          'Berhati - hati dan menjaga agar tidak ada **Pihak Lain** yang dapat memperoleh dan mengakses **DATA** yang telah diberikan **Pihak Pertama** yang mana keteledoran memiliki konsekuensi pelanggaran (pasal 5 ayat 5)',
          'Tidak melakukan apapun yang dapat merugikan atau merusak nama baik **Pihak Pertama**.',
        ],
      },
    ],
  },
  {
    nomor: 'V',
    judul: '(PERPANJANGAN ATAU PEMBERHENTIAN KONTRAK)',
    blok: [
      {
        tipe: 'ayat',
        teks: '**Pihak Kedua** dapat mengajukan perpanjangan masa kontrak jika dinyatakan tidak ada tersandung masalah di pasal 3 ayat 4 ke pihak bimbel minimal **H-3** sebelum masa kontrak berakhir.',
      },
      {
        tipe: 'ayat',
        teks: '**Pihak Kedua** diperkenankan mengajukan resign dengan ketentuan pengajuan pengunduran diri berupa konfirmasi ke **Pihak Pertama** minimal **H-8** sebelum tanggal masa kontrak berakhir dengan memperhatikan peraturan yang ada.',
      },
      {
        tipe: 'ayat',
        teks: '**Pihak Kedua** yang mengajukan **resign** di dalam masa kontrak (di bawah 3 bulan) maka akan dipotong total penggajiannya sebesar 20% di periode bulan saat ajukan resign.',
      },
      {
        tipe: 'ayat',
        teks: '**Pihak Kedua** yang mengajukan **resign** berhak:',
        sub: ['Mengajukan **penggajian** di akhir periode kepada **Pihak Pertama**.'],
      },
      {
        tipe: 'ayat',
        teks: '**Pihak Kedua** yang **dikenai** surat pemutusan kontrak oleh **Pihak Pertama** karena melanggar pasal 4, maka **tidak** dapat apply kerja di Bimbel Raya selama-lamanya **(blacklist)**.',
      },
    ],
  },
  {
    nomor: 'V',
    judul: '(SANKSI)',
    blok: [
      {
        tipe: 'ayat',
        teks: 'Jika **Pihak Kedua** tidak bisa menjalankan pasal 3 ayat 4 dengan baik dan terdapat laporan dari walimurid dan meminta pergantian tentor, maka masa kerjanya akan dilepas dan diganti dengan tentor lain. Hak tentor berupa gaji tetap dibayarkan sesuai jumlah pertemuan dari bukti absensi.',
      },
      {
        tipe: 'ayat',
        teks: 'Jika **Pihak Kedua** merasa keberatan dengan laporan dari walimurid dan tidak benar, **Pihak Kedua** bisa mengajukan banding dan **Pihak Pertama** akan mengevaluasi dan menyelidiki kembali terkait hal itu.',
      },
      {
        tipe: 'ayat',
        teks: 'Jika **Pihak Kedua** tidak bisa menjalankan pasal 3 ayat 4 sub ayat e, maka haknya berupa gaji ditangguhkan sampai menemukan penggantinya.',
      },
      {
        tipe: 'ayat',
        teks: 'Jika **Pihak Kedua** tidak bisa menjalankan pasal 3 ayat 4 sub ayat f, maka akan langsung dikeluarkan dari grup utama dan di *blacklist* dari perekrutan tentor Bimbel Raya karena tidak bisa bertanggung jawab atas amanah yang telah diberikan.',
      },
    ],
  },
  {
    nomor: 'VI',
    judul: '(BERAKHIRNYA PERJANJIAN)',
    blok: [
      {
        tipe: 'paragraf',
        teks: '**PARA PIHAK** sepakat bahwa Surat Kontrak Kerja ini berakhir bila mana jangka waktu Surat Kontrak Kerja ini telah berakhir dan tidak diperpanjang, salah satu pihak tidak memenuhi salah satu ketentuan dalam pasal-pasal serta ayat-ayat Surat Kontrak Kerja ini, dan *Force Majeure* yang menyebabkan tidak mungkin dilaksanakan kembali Surat Kontrak Kerja ini.',
      },
    ],
  },
  {
    nomor: 'VII',
    judul: '(PENUTUP)',
    blok: [
      {
        tipe: 'paragraf',
        teks: 'Perjanjian kerja ini dibuat dan ditandatangani oleh kedua belah pihak dalam keadaan sadar tanpa paksaan dari siapapun.',
      },
    ],
  },
]

const huruf = (i) => String.fromCharCode(97 + i) // a, b, c, ...

// Tambahkan nomor ayat (1, 2, 3...) dan huruf sub-ayat (a, b, c...) secara otomatis
export const SURAT_KONTRAK = mentah.map((pasal) => {
  let no = 0
  return {
    ...pasal,
    blok: pasal.blok.map((b) => {
      if (b.tipe === 'ayat') no += 1
      return {
        ...b,
        no: b.tipe === 'ayat' ? no : null,
        sub: (b.sub || []).map((teks, i) => ({ huruf: huruf(i), teks })),
      }
    }),
  }
})

// Ubah **tebal** dan *miring* jadi HTML. Karakter HTML di-escape dulu supaya aman dipakai di v-html.
export const formatTeks = (s) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')