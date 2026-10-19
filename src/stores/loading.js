import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useLoadingStore = defineStore('loading', () => {
  const jumlah = ref(0) // jumlah proses yang sedang berjalan
  const pesan = ref('Memproses…')
  const tampil = computed(() => jumlah.value > 0)

  function mulai(teks) {
    if (jumlah.value === 0) pesan.value = teks || 'Memproses…'
    jumlah.value++
  }

  function selesai() {
    if (jumlah.value > 0) jumlah.value--
  }

  return { jumlah, pesan, tampil, mulai, selesai }
})