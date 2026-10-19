<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { mulaiPemantauanSesi, sesiHampirHabis } from '@/utils/sesi'
import LoadingModal from '@/components/LoadingModal.vue'

const authStore = useAuthStore()
const router = useRouter()
let hentikanPemantauan = null

onMounted(() => {
  authStore.restoreSession()
  hentikanPemantauan = mulaiPemantauanSesi()
})

onBeforeUnmount(() => {
  if (hentikanPemantauan) hentikanPemantauan()
})

const loginUlang = () => {
  const tujuan = authStore.role === 'admin' ? '/daftar' : '/login' // sama dengan penjaga router
  authStore.logout()
  sesiHampirHabis.value = false
  router.push(tujuan)
}
</script>

<template>
  <RouterView />
  <LoadingModal />

  <div v-if="sesiHampirHabis" class="banner-sesi" role="alert">
    <span>Sesi kamu hampir berakhir. Simpan pekerjaanmu, lalu login ulang.</span>
    <button type="button" @click="loginUlang">Login ulang</button>
  </div>
</template>

<style scoped>
.banner-sesi {
  position: fixed;
  left: 50%;
  bottom: 1rem;
  transform: translateX(-50%);
  z-index: 9998;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: max-content;
  max-width: calc(100% - 2rem);
  padding: 0.65rem 0.85rem;
  border-radius: 12px;
  background: #fff4ed;
  border: 1.5px solid #f35c2b;
  color: #b8400f;
  font-size: 0.8rem;
  line-height: 1.4;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.15);
}
.banner-sesi button {
  flex-shrink: 0;
  padding: 0.4rem 0.75rem;
  border: none;
  border-radius: 8px;
  background: #f35c2b;
  color: #fff;
  font-weight: 700;
  font-size: 0.78rem;
  cursor: pointer;
}
</style>