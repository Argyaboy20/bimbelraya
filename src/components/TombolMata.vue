<!-- TombolMata.vue: tombol tampil/sembunyi password -->
<template>
  <button
    type="button"
    class="toggle-eye"
    :aria-label="tampil ? 'Sembunyikan password' : 'Tampilkan password'"
    @click="$emit('toggle')"
  >
    <EyeOff v-if="tampil" :size="18" />
    <Eye v-else :size="18" />
  </button>
</template>

<script setup>
defineOptions({ name: 'TombolMata' })
import { Eye, EyeOff } from 'lucide-vue-next'

defineProps({ tampil: { type: Boolean, default: false } })
defineEmits(['toggle'])
</script>

<style scoped>
.toggle-eye {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
}
.toggle-eye:hover {
  color: #1f2937;
}
.toggle-eye:disabled {
  opacity: 0.5;
  cursor: default;
}
</style>