<!-- Tentang.vue: Tentang Sistem (publik) -->
<template>
  <HalamanInfo judul="Tentang Sistem">
    <p>
      <strong>Bimbel Raya</strong> adalah layanan bimbingan belajar privat dengan home visit untuk jenjang
      TK, SD, SMP, SMA, dan mengaji. Sistem ini dibuat untuk membantu pengelolaan layanan: dari pencarian
      tentor, pencatatan kehadiran, sampai penilaian dan pembagian materi belajar.
    </p>

    <h2>Untuk pengunjung</h2>
    <ul>
      <li>Mengenal program dan area layanan Bimbel Raya.</li>
      <li>Melihat lowongan tentor dan menghubungi admin lewat WhatsApp.</li>
      <li>Mendaftarkan anak lewat formulir bertahap, lalu melanjutkan ke WhatsApp admin.</li>
      <li>Bertanya lebih dulu kepada asisten chat.</li>
    </ul>

    <h2>Untuk tentor</h2>
    <ul>
      <li>
        <strong>Presensi:</strong> kehadiran les dicatat dengan foto bersama siswa. Foto diperiksa otomatis
        minimal dua wajah, dan bisa diambil dari kamera atau galeri.
      </li>
      <li><strong>Les Siswa:</strong> mengelola daftar siswa yang diajar.</li>
      <li><strong>Berkas:</strong> mengunduh modul dan soal latihan dari admin.</li>
      <li><strong>Reward bulanan:</strong> melihat peringkat tentor terbaik setiap bulan.</li>
      <li><strong>Kartu Tanda Anggota:</strong> e-kartu digital dengan foto profil.</li>
      <li><strong>Kontrak:</strong> memantau masa kontrak dan memperpanjangnya secara online.</li>
    </ul>

    <h2>Untuk admin</h2>
    <p>
      Admin mengelola kode dan data tentor, data walimurid, lowongan, laporan presensi harian dan bulanan,
      penilaian reward tentor, serta berkas yang dibagikan kepada tentor.
    </p>

    <h2>Teknologi</h2>
    <p>
      Sistem ini dibangun dengan Vue untuk tampilan, Express dan PostgreSQL untuk server dan data, serta
      Cloudflare untuk situs dan penyimpanan file.
    </p>

    <h2>Hubungi kami</h2>
    <p>
      Pertanyaan atau masukan tentang sistem ini bisa dikirim ke
      <a href="mailto:bimbelrayaid@gmail.com">bimbelrayaid@gmail.com</a>. Penjelasan tentang data pribadi
      ada di halaman <router-link to="/privasi">Kebijakan Privasi</router-link>.
    </p>
  </HalamanInfo>
</template>

<script setup>
defineOptions({ name: 'TentangPage' })
import HalamanInfo from '@/components/HalamanInfo.vue'
</script>