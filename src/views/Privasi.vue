<!-- Privasi.vue: Kebijakan Privasi (publik) -->
<template>
  <HalamanInfo judul="Kebijakan Privasi" pembaruan="5 November 2026">
    <p>
      Kebijakan ini menjelaskan data apa saja yang dikumpulkan sistem Bimbel Raya, untuk apa data itu
      dipakai, di mana disimpan, berapa lama disimpan, dan hak kamu atas data tersebut. Kebijakan ini
      berlaku untuk situs Bimbel Raya, portal tentor, portal admin, dan asisten chat.
    </p>

    <h2>1. Data yang kami kumpulkan</h2>
    <ul>
      <li>
        <strong>Tentor:</strong> nama, nomor WhatsApp, email, kode tentor, dan password (disimpan hanya
        dalam bentuk sandi acak satu arah, sehingga tidak bisa dibaca siapa pun, termasuk admin).
      </li>
      <li>
        <strong>Data kepegawaian dan kontrak</strong> yang diisi admin, seperti pendidikan, alamat, kontak
        darurat, masa kontrak, serta catatan persetujuan surat kontrak.
      </li>
      <li>
        <strong>Aktivitas di sistem:</strong> jumlah login, riwayat presensi, daftar siswa yang diajar, dan
        nilai reward bulanan.
      </li>
      <li>
        <strong>Foto:</strong> foto presensi (memuat tentor dan siswa) dan foto profil untuk e-kartu
        anggota.
      </li>
      <li>
        <strong>Data siswa dan walimurid:</strong> nama siswa, kelas, nama walimurid, dan data yang dicatat
        admin untuk keperluan penugasan dan laporan.
      </li>
      <li>
        <strong>Pengunjung:</strong> isi pesan yang kamu ketik di asisten chat. Formulir Pendaftaran Anak
        dikirim ke WhatsApp admin dan tidak disimpan di server sistem.
      </li>
    </ul>

    <h2>2. Untuk apa data dipakai</h2>
    <p>
      Data dipakai untuk menjalankan layanan bimbingan belajar: membuat dan mengamankan akun, mencatat
      kehadiran sebagai bukti pelaksanaan les, mengelola kontrak, menyusun laporan dan penilaian tentor,
      membagikan berkas belajar, serta menjaga keamanan sistem. Data tidak dijual dan tidak dipakai untuk
      iklan.
    </p>

    <h2>3. Foto dan deteksi wajah</h2>
    <p>
      Saat mengambil foto presensi, sistem memeriksa di browser perangkatmu apakah ada minimal dua wajah.
      Pemeriksaan ini hanya menghitung jumlah wajah. Sistem tidak membuat, menyimpan, atau mencocokkan data
      pengenalan wajah. Foto yang diterima server diperkecil dan dibersihkan dari data tersembunyi (termasuk
      lokasi), lalu disimpan secara privat. Foto presensi dapat dilihat oleh admin dan oleh tentor yang
      bersangkutan, melalui tautan sementara.
    </p>

    <h2>4. Tempat penyimpanan dan pihak yang membantu kami</h2>
    <ul>
      <li>Database (PostgreSQL) di layanan Neon.</li>
      <li>Penyimpanan foto dan berkas di Cloudflare R2.</li>
      <li>Server aplikasi di Render.</li>
      <li>Situs dan perlindungan anti-bot (Cloudflare Turnstile) di Cloudflare.</li>
      <li>Asisten chat dijalankan oleh Cloudflare Workers AI.</li>
    </ul>
    <p>
      Sebagian layanan ini dapat berlokasi di luar Indonesia. Kami hanya memakainya untuk menjalankan
      sistem ini.
    </p>

    <h2>5. Penyimpanan di perangkatmu</h2>
    <p>
      Setelah login, sistem menyimpan token sesi di penyimpanan browser (localStorage). Token berlaku satu
      jam, diperpanjang otomatis selama kamu aktif, dengan batas maksimal delapan jam sejak login.
      Notifikasi reward yang sudah ditutup juga dicatat di browser. Kami tidak memasang pelacak iklan.
      Layanan anti-bot dapat memakai data teknis browser untuk membedakan manusia dan robot.
    </p>

    <h2>6. Berapa lama data disimpan</h2>
    <ul>
      <li>
        Akun dan data tentor dihapus otomatis setelah masa kontrak berakhir dan masa tenggang lima hari
        lewat.
      </li>
      <li>
        Foto presensi dan foto profil dihapus dari penyimpanan setelah akun tentor terhapus. Rekap presensi
        (nama, tanggal, dan materi) tetap disimpan tanpa foto untuk keperluan laporan.
      </li>
      <li>Riwayat percakapan chat tidak disimpan di database sistem.</li>
    </ul>

    <h2>7. Keamanan</h2>
    <p>
      Kami memakai koneksi aman (HTTPS), password yang disandikan satu arah, sesi login yang singkat,
      pembatasan percobaan masuk, pembagian akses sesuai peran, dan tautan sementara untuk membuka foto dan
      berkas. Tidak ada sistem yang sepenuhnya bebas risiko, tetapi kami terus berusaha menjaga datamu
      tetap aman.
    </p>

    <h2>8. Data anak</h2>
    <p>
      Data siswa yang kami catat terbatas pada nama, kelas, nama walimurid, dan foto kegiatan les, dan
      hanya dipakai untuk keperluan belajar dan laporan. Walimurid dapat meminta penjelasan atau penghapusan
      data anaknya melalui kontak di bawah.
    </p>

    <h2>9. Hak kamu</h2>
    <p>
      Kamu berhak mengetahui data yang kami simpan, meminta perbaikan, dan meminta penghapusan. Tentor dapat
      mengubah biodata dan menghapus akunnya sendiri di halaman Biodata. Untuk permintaan lain, hubungi
      kami di
      <a href="mailto:bimbelrayaid@gmail.com">bimbelrayaid@gmail.com</a>.
    </p>

    <h2>10. Perubahan kebijakan</h2>
    <p>
      Kebijakan ini dapat diperbarui sewaktu-waktu. Tanggal pembaruan terakhir tertera di bagian atas
      halaman ini.
    </p>
  </HalamanInfo>
</template>

<script setup>
defineOptions({ name: 'PrivasiPage' })
import HalamanInfo from '@/components/HalamanInfo.vue'
</script>