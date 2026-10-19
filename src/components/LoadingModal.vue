<script setup>
import { ref, watch, onBeforeUnmount } from 'vue'
import { useLoadingStore } from '@/stores/loading'

const loading = useLoadingStore()
const lama = ref(false)
let timer = null

watch(
  () => loading.tampil,
  (aktif) => {
    clearTimeout(timer)
    lama.value = false
    if (aktif) timer = setTimeout(() => (lama.value = true), 5000)
  },
)

onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <Transition name="loading-fade">
    <div v-if="loading.tampil" class="loading-overlay" role="status" aria-live="polite">
      <div class="loading-box">
        <div class="loading-spinner" aria-hidden="true"></div>
        <p class="loading-teks">{{ loading.pesan }}</p>
        <p v-if="lama" class="loading-sub">
          Mohon menunggu yaa...
        </p>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.loading-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.45);
}
.loading-box {
  width: min(100%, 320px);
  padding: 1.5rem 1.25rem;
  border-radius: 16px;
  background: #fff;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.25);
}
.loading-spinner {
  width: 44px;
  height: 44px;
  margin: 0 auto 0.9rem;
  border: 4px solid #f9eccc;
  border-top-color: #2e87f6;
  border-radius: 50%;
  animation: loading-putar 0.8s linear infinite;
}
.loading-teks {
  margin: 0;
  font-weight: 700;
  font-size: 0.95rem;
  color: #1f2937;
}
.loading-sub {
  margin: 0.6rem 0 0;
  font-size: 0.78rem;
  line-height: 1.4;
  color: #b8400f;
}
.loading-fade-enter-active,
.loading-fade-leave-active {
  transition: opacity 0.2s ease;
}
.loading-fade-enter-from,
.loading-fade-leave-to {
  opacity: 0;
}
@keyframes loading-putar {
  to {
    transform: rotate(360deg);
  }
}
</style>