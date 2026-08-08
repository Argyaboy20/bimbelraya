import { defineStore } from 'pinia'

export const usePresensiStore = defineStore('presensi', {
  state: () => ({
    // ============================================
    // Struktur record presensi (BARU):
    // {
    //   namaTentor, kodeTentor,
    //   tanggalKey: 'YYYY-MM-DD',        // untuk pengelompokan per hari (dipakai admin)
    //   hariTanggalDisplay: 'Selasa, 17 Juni 2026',
    //   jamPresensi: '09:14',            // jam saat submit
    //   materi: '...',
    //   fotoUrl: 'data:image/...',       // foto kegiatan les (selfie)
    //   kehadiran: true                  // syarat foto & minimal wajah terpenuhi
    // }
    //
    // CATATAN PENTING: field `namaWalimurid` sudah TIDAK ADA lagi di
    // struktur baru ini (diganti `materi`). LaporanPresensi.vue (admin)
    // masih membaca item.namaWalimurid dari struktur LAMA — perlu
    // disesuaikan menyusul supaya tidak error.
    //
    // Nanti diganti fetch dari backend:
    // async fetchPresensi() {
    //   const res = await fetch('/api/admin/presensi')
    //   this.records = await res.json()
    // }
    // ============================================
    records: [],
  }),

  actions: {
    // ===== Dipanggil dari Presensi.vue saat tentor konfirmasi presensi =====
    addPresensi(data) {
      this.records.unshift(data)

      // ============================================
      // Nanti diganti dengan API call sungguhan:
      // await fetch('/api/tentor/presensi', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // })
      // ============================================
    },

    // ===== Ambil semua riwayat presensi milik satu tentor, terbaru dulu =====
    riwayatByTentor(kodeTentor) {
      return this.records
        .filter((r) => r.kodeTentor === kodeTentor)
        .slice() // salin dulu supaya tidak mutasi state asli saat di-sort
        .sort((a, b) => (a.tanggalKey < b.tanggalKey ? 1 : -1))
    },
  },
})
