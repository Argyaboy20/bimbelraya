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

_Catat perubahan yang sedang dikerjakan di sini. Saat rilis, pindahkan ke bagian versi baru di bawah._

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