# Riwayat Perubahan (Changelog) — Frontend

Semua perubahan penting pada frontend **Bimbel Raya** dicatat di berkas ini.
Formatnya mengacu pada [Keep a Changelog](https://keepachangelog.com/id-ID/1.1.0/).
Riwayat sisi server ada di `CHANGELOG.md` repositori **bimbelraya-backend**.

## Penomoran versi

Versi ditulis `MAJOR.MINOR` dan dipakai bersama oleh frontend dan backend.

| Jenis versi | Contoh | Kapan dipakai |
|---|---|---|
| **MAJOR** (`X.0`) | `1.0`, `2.0`, `3.0` | Perubahan **besar** pada tampilan atau pengalaman pengguna (UI/UX). Dirilis **bersamaan** di frontend dan backend: backend ikut memakai angka yang sama, walaupun perubahan di sisinya kecil atau tidak ada |
| **MINOR** (`X.1`, `X.2`, ...) | `2.1`, `2.2` | Perubahan yang bukan perubahan besar, misalnya perbaikan atau penyempurnaan di satu sisi saja (paling sering hanya backend) |

Aturan tambahan:
- Nomor MINOR berikutnya **selalu melanjutkan nomor terakhir yang pernah dipakai di repositori mana pun**, sehingga tidak ada angka kembar. Contoh: frontend `2.0` lalu backend `2.1` dan `2.2`; jika setelah itu frontend punya perbaikan kecil, nomornya `2.3`.
- Rilis yang hanya menyentuh backend **tidak dicatat di berkas ini** (lihat changelog backend). Karena itu loncatan nomor di sini, misalnya dari `2.0` ke `2.3`, adalah hal yang wajar.
- Saat perubahan besar UI/UX berikutnya, versi MAJOR naik (misalnya `3.0`) dan angka MINOR kembali ke nol.
- Setiap rilis diberi tanda (tag) di Git, misalnya `v1.0`.

Kategori yang dipakai pada setiap rilis: **Ditambahkan**, **Diubah**, **Diperbaiki**, **Dihapus**, dan **Keamanan** (hanya garis besar, tanpa rincian teknis).

## [Belum dirilis]


## [4.0] — 2026-10-25

Rilis bersama backend `4.0`: percakapan chat yang lebih hidup, jalur WhatsApp yang lebih mudah, dan pengamanan perpanjangan kontrak tentor.

### Ditambahkan
- Tombol WhatsApp pada bagian Kontak Kami di halaman utama, dengan pesan pembuka yang sudah terisi
- Kolom **Konfirmasi** pada daftar lowongan: tombol WhatsApp per baris dengan pesan berisi detail lowongan itu, dan nonaktif otomatis saat statusnya sudah diambil

### Diubah
- Asisten chat menampilkan sapaan awal dengan jeda singkat, memberi animasi masuk pada setiap pesan, dan menampilkan titik mengetik bergelombang saat asisten menjawab
- Banner kontrak di dashboard tentor tampil mulai sisa kontrak 3 hari, sama dengan saat perpanjangan dibuka
- Susunan kartu Kontak Kami menjadi dua kolom pada layar tablet ke atas

### Keamanan
- Persetujuan Surat Kontrak dan perpanjangan kontrak di halaman tentor terkunci selama sisa kontrak lebih dari 3 hari, disertai keterangan tanggal dibukanya. Kunci ini juga ditegakkan di server

## [3.1] — 2026-10-24

Rilis frontend: penyempurnaan pesan pendaftaran dan penjaga API agar tidak tertidur. Tidak ada perubahan backend.

### Ditambahkan
- Penjadwal otomatis di Cloudflare yang menghubungi API setiap 5 menit agar server tidak tertidur, sehingga pengunjung tidak lagi menunggu server bangun

### Diubah
- Pesan pendaftaran anak yang dikirim ke WhatsApp tidak lagi memuat catatan alamat (NOTE) di bagian bawah


## [3.0] — 2026-10-22

Rilis bersama backend `3.0`: pendaftaran anak lewat formulir terarah. Tidak ada perubahan backend.

### Ditambahkan
- Alur **Pendaftaran Anak** di halaman utama menggantikan tautan langsung ke WhatsApp: pilih jenjang (SD, SMP, atau SMA), pilih daerah, lalu isi formulir sesuai jenjang
- Pesan pendaftaran dikirim ke WhatsApp admin dalam format baku yang terisi otomatis dari isian formulir
- Pemeriksaan isian langsung saat mengetik, termasuk aturan Request Mapel: SD bebas, SMP maksimal 2 mapel, SMA maksimal 1 mapel, dan "semua mapel" tidak diterima untuk SMP dan SMA
- Pelindung isian: batas panjang tiap kolom dan pembuangan karakter pemformat WhatsApp agar format pesan tidak rusak

### Diubah
- Tombol **Pendaftaran Anak** tidak lagi langsung membuka WhatsApp

## [2.3] — 2026-10-22

Rilis frontend: penyempurnaan tampilan. Tidak ada perubahan backend.

### Diubah
- Seluruh emoji pada tampilan diganti dengan ikon garis yang seragam dan profesional, mencakup halaman publik, masuk, daftar, portal tentor, dan portal admin (dashboard, tabel data, laporan, kamera presensi, dan tombol aksi)
- Tombol aksi pada baris tabel Data Tentor (Edit, Reset Password, Hapus) dan Data Walimurid (Edit, Hapus) diperkecil di semua ukuran layar agar tidak memakan banyak ruang
- Tombol navigasi tanggal dan bulan memakai ikon panah, bukan karakter teks

### Diperbaiki
- Saat modal Riwayat Generate Kode Tentor terbuka, halaman dashboard admin di belakangnya tidak lagi ikut bergulir

## [2.2] — 2026-10-20

Rilis frontend: pengeditan data tentor dan walimurid, serta perlindungan Surat Kontrak. Mengikuti backend `2.1`, nomor `2.1` sendiri tidak dipakai di sini.

### Ditambahkan
- Tombol **Edit** pada baris yang sudah tersimpan di tabel Data Tentor dan Data Walimurid: admin dapat memperbaiki data yang salah input lalu menyimpannya, atau membatalkan perubahan. Kode Tentor tetap terkunci, sedangkan Kode Walimurid boleh diganti

### Keamanan
- Isi Surat Kontrak Kerja Tentor di halaman Perpanjang Kontrak kini dilindungi: teks tidak bisa diseleksi, disalin, atau dicetak, isi surat tertutup saat jendela kehilangan fokus atau ada upaya tangkap layar, dan setiap tampilan diberi watermark berisi nama, kode, serta waktu akses tentor

## [2.0] — 2026-10-19

Rilis bersama backend `2.0`: Reward Tentor bulanan dan modal loading universal.

### Ditambahkan
- Modal loading universal: tampil otomatis pada setiap proses yang berhubungan dengan server (masuk, daftar, simpan, ubah, hapus, dan memuat data), dengan pesan sesuai aksi serta keterangan bila server sedang bangun dari mode tidur
- **Reward Tentor** untuk admin: halaman penilaian performa tentor per bulan dengan 8 kriteria (nilai 1 sampai 10), total nilai otomatis, tiga peringkat teratas ditandai hijau, biru, dan kuning di tabel dan di grafik, serta navigasi bulan yang menyimpan isian tiap bulan. Tombol **UMUMKAN** muncul setelah semua nilai terisi
- Section **Reward Tentor** di dashboard admin
- Kotak keempat di dashboard admin: jumlah lowongan tentor yang masih tersedia, diperbarui otomatis
- **Reward Bulanan Tentor** untuk tentor: halaman daftar peringkat tentor bulan ini, dengan baris milik tentor yang sedang masuk ditandai hijau
- Section **Reward Bulanan Tentor** di dashboard tentor
- Notifikasi juara di dashboard tentor: kartu melayang dengan ucapan sesuai peringkat (juara 1, 2, 3, atau belum terpilih), tampil sekitar 90 menit setelah pengumuman dan bisa ditutup dengan tombol OK

### Diubah
- Batas waktu tunggu permintaan ke server diperpanjang agar server yang sedang bangun tidak memutus proses
- Kartu statistik dashboard admin kini berjumlah empat dan tersusun 2×2

## [1.1] — 2026-10-18

Rilis bersama backend `1.1`: asisten chat lebih interaktif. Perubahan utama ada di backend.

### Diubah
- Asisten chat mengirim riwayat percakapan yang lebih panjang (hingga 10 pesan terakhir) agar jawaban lebih nyambung

## [1.0] — 2026-10-18

Rilis pertama. Seluruh fitur utama sistem tersedia.

### Ditambahkan

**Halaman publik**
- Landing page: pengenalan, keunggulan, program per jenjang (Mengaji, TK, SD, SMP, SMA), cara bergabung, testimoni, area layanan, dan kontak
- Halaman lowongan tentor yang datanya diambil dari server
- Asisten chat berbasis AI: percakapan dengan riwayat singkat, catatan penggunaan, serta pengunci scroll halaman saat chat terbuka

**Akun dan sesi**
- Masuk untuk tentor dan admin, serta pendaftaran tentor memakai kode dari admin
- Kewajiban mengganti password sementara setelah password direset admin
- Perpanjangan sesi otomatis selama pengguna aktif, peringatan saat sesi hampir berakhir, dan sinkronisasi sesi antar tab
- Perlindungan anti-bot yang tidak mengganggu pada chat, masuk, dan pendaftaran

**Portal tentor**
- Dashboard, biodata (ubah profil, ganti email dan password, hapus akun), serta status masa kontrak
- Perpanjangan kontrak disertai persetujuan surat kontrak tentor
- **Les Siswa**: tentor mengelola daftar siswa yang diajar
- **Presensi per siswa**: foto kehadiran dari kamera dengan validasi foto di browser, dan riwayat per siswa
- Unduhan **Absen Kehadiran** (PNG) lengkap dengan kop berisi nama siswa, kelas, dan walimurid

**Portal admin**
- Dashboard ringkasan, pembuatan kode tentor, dan riwayat kode
- Pengelolaan data tentor (termasuk reset password), data walimurid, dan data lowongan
- **Laporan presensi**: harian dengan pembaruan otomatis untuk hari ini, serta rekap bulanan yang memisahkan jumlah hari dan jumlah pertemuan, lengkap dengan rincian per siswa

**Teknis**
- Seluruh pemanggilan ke backend lewat satu klien HTTP dengan penanganan sesi dan galat yang seragam
- Pustaka validasi foto dan ekspor gambar dipasang lewat npm (bukan CDN), dengan model deteksi wajah disajikan dari situs sendiri
- Dokumentasi sistem (`README.md`) dan contoh konfigurasi (`.env.example`)

### Keamanan
- Header keamanan HTTP pada situs
- Pemisahan jelas antara konfigurasi publik dan rahasia (variabel `VITE_*` tidak pernah berisi rahasia)