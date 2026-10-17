# Bimbel Raya — Frontend

Aplikasi web **Bimbel Raya**, layanan bimbingan belajar privat dengan home visit.
Repositori ini berisi sisi tampilan (frontend): halaman publik, portal tentor, dan portal admin.
Sisi server ada di repositori terpisah: **bimbelraya-backend**.

## Fitur

**Halaman publik**
- Profil bimbel, program per jenjang (TK, SD, SMP, SMA, dan mengaji), area layanan, testimoni, dan cara bergabung
- Daftar lowongan tentor
- Asisten chat berbasis AI untuk pertanyaan umum seputar bimbel

**Portal tentor**
- Pendaftaran dan masuk akun
- Biodata dan perpanjangan kontrak (disertai persetujuan surat kontrak)
- **Les Siswa**: tentor mengelola daftar siswa yang diajar
- **Presensi per siswa** dengan foto kehadiran dan validasi foto langsung di browser
- Riwayat presensi per siswa dan unduhan **Absen Kehadiran** dalam bentuk gambar PNG

**Portal admin**
- Dashboard ringkasan dan pembuatan kode tentor
- Pengelolaan data tentor, data walimurid, dan data lowongan
- **Laporan presensi**: harian (diperbarui otomatis untuk hari ini) dan rekap bulanan per siswa

## Teknologi

| Bagian | Teknologi |
|---|---|
| Kerangka kerja | Vue 3 (Composition API, `<script setup>`) |
| Build tool | Vite |
| Routing | Vue Router |
| State | Pinia |
| Validasi foto di browser | `@vladmandic/face-api` (model disimpan di `public/models`) |
| Ekspor gambar | `html2canvas-pro` |
| Kualitas kode | ESLint, oxlint, Prettier |

## Prasyarat

- Node.js `^20.19.0` atau `>=22.12.0`
- npm
- Backend Bimbel Raya yang berjalan (lihat README repositori backend)

## Menjalankan secara lokal

```bash
# 1. Pasang dependensi
npm install

# 2. Siapkan konfigurasi
cp .env.example .env.development    # Windows: copy .env.example .env.development
#    lalu isi nilainya (lihat bagian Konfigurasi)

# 3. Jalankan server pengembangan
npm run dev
```

Aplikasi berjalan di `http://localhost:5173`. Pastikan backend juga menyala dan mengizinkan alamat tersebut.

## Konfigurasi

Variabel lingkungan dibaca oleh Vite pada saat **build**, dan semua variabel berawalan `VITE_` akan terlihat oleh pengunjung.
Karena itu, **jangan pernah menaruh rahasia** di berkas `.env` frontend.

| Variabel | Wajib | Keterangan |
|---|---|---|
| `VITE_API_URL` | Ya | Alamat dasar API backend, tanpa garis miring di akhir |
| `VITE_TURNSTILE_SITE_KEY` | Tidak | Kunci publik widget anti-bot. Jika kosong, widget tidak dipakai |

Contoh ada di `.env.example`. Berkas `.env*` yang berisi nilai asli tidak boleh di-commit.

## Skrip npm

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Server pengembangan dengan hot reload |
| `npm run build` | Build produksi ke folder `dist/` |
| `npm run preview` | Pratinjau hasil build secara lokal |
| `npm run lint` | Menjalankan oxlint dan ESLint (dengan perbaikan otomatis) |
| `npm run format` | Merapikan kode dengan Prettier |

## Struktur proyek

Ringkasan struktur utama:

```
.
├── assets/          # Aset gambar (mis. logo)
├── public/          # Berkas statis (mis. model deteksi wajah di public/models)
├── src/
│   ├── api/         # Klien HTTP tunggal untuk memanggil backend
│   ├── components/  # Komponen yang dipakai ulang
│   ├── router/      # Definisi rute dan penjaga akses halaman
│   ├── stores/      # State global (Pinia): sesi, tentor, presensi, dan lainnya
│   ├── utils/       # Utilitas pendukung (sesi, anti-bot)
│   ├── views/       # Halaman: publik, tentor, dan admin
│   ├── App.vue
│   └── main.js
├── index.html
├── vite.config.js
└── package.json
```

Prinsip yang dipakai:
- Semua pemanggilan ke backend lewat satu pintu (`src/api`), sehingga penanganan sesi dan galat seragam.
- Logika bisnis dan validasi akhir ada di backend. Validasi di frontend hanya untuk kenyamanan pengguna.

## Build dan deploy

```bash
npm run build
```

Hasilnya ada di folder `dist/`, berupa aset statis yang bisa disajikan oleh layanan hosting statis mana pun.
Karena aplikasi ini *single-page*, hosting harus mengarahkan semua alamat yang tidak ditemukan ke `index.html`.

Variabel `VITE_*` harus sudah diisi **sebelum** build dijalankan. Jika nilainya berubah, lakukan build ulang.

## Kontribusi

- Gunakan Prettier dan ESLint (`npm run format` dan `npm run lint`) sebelum commit.
- Tulis pesan commit yang singkat dan jelas, dalam Bahasa Indonesia.
- Jangan meng-commit berkas `.env`, kunci, atau data nyata pengguna.

## Keamanan

Jika menemukan celah keamanan, **jangan** membuat issue publik.
Hubungi pengelola secara langsung (lihat bagian Kontak).

## Kontak

Pengelola: _bimbelrayaid@gmail.com_

## Lisensi

Hak cipta © 2026 Bimbel Raya. Seluruh hak dilindungi. _(sesuaikan jika repositori ini ingin dilisensikan secara terbuka)_