<!-- Navbar.vue -->
<template>
  <nav class="admin-navbar">

    <!-- ===== SUDUT KIRI: Sapaan dinamis ===== -->
    <div class="greeting-area">
      <transition name="fade-swap" mode="out-in">
        <p class="greeting-text" :key="showGreeting ? 'greeting' : 'message'">
          {{ showGreeting ? greetingText : followUpText }}
        </p>
      </transition>
    </div>

    <!-- ===== TENGAH: Logo (selalu center, di semua ukuran layar) ===== -->
    <div class="logo-area">
      <img src="/assets/logobimbel.png" alt="Logo Bimbel Raya" class="navbar-logo" />
    </div>

    <!-- ===== KANAN: slot kosong untuk jaga keseimbangan layout ===== -->
    <div class="right-area">
      <!-- Nanti bisa diisi ikon notifikasi / profil admin -->
    </div>

  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// ===== WAKTU SAAT INI (update tiap menit, agar sapaan akurat) =====
const now = ref(new Date())
let clockTimer = null

const getTimePeriod = () => {
  const hour = now.value.getHours()
  if (hour >= 4 && hour < 11) return 'pagi'
  if (hour >= 11 && hour < 15) return 'siang'
  if (hour >= 15 && hour < 18) return 'sore'
  return 'malam'
}

// ===== SAPAAN UTAMA (sudut kiri) =====
const greetingText = computed(() => {
  const period = getTimePeriod()
  const labels = {
    pagi: 'Hai! Selamat Pagi MinRa',
    siang: 'Halo! Selamat Siang MinRa',
    sore: 'Hai! Selamat Sore MinRa',
    malam: 'Halo! Selamat Malam MinRa'
  }
  return labels[period]
})

// ===== PESAN LANJUTAN (gantian muncul tiap 10 detik) =====
const followUpText = computed(() => {
  const period = getTimePeriod()
  const messages = {
    pagi: 'Bagaimana kabarnya di awal hari?',
    siang: 'Sudah makan siang belum?',
    sore: 'Bagaimana kerjanya? Lancar?',
    malam: 'Udah malam nih, kamu istirahat ya'
  }
  return messages[period]
})

// ===== TOGGLE: gantian tampilkan greeting / followUp tiap 10 detik, loop terus =====
const showGreeting = ref(true)
let toggleTimer = null

onMounted(() => {
  // Update jam tiap menit, supaya sapaan otomatis berubah saat lewat batas waktu
  clockTimer = setInterval(() => {
    now.value = new Date()
  }, 60 * 1000)

  // Loop gantian teks tiap 10 detik
  toggleTimer = setInterval(() => {
    showGreeting.value = !showGreeting.value
  }, 10000)
})

onUnmounted(() => {
  clearInterval(clockTimer)
  clearInterval(toggleTimer)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

* {
  font-family: 'DM Sans', sans-serif;
  box-sizing: border-box;
}

.admin-navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: 0.85rem 1.25rem;
  background: linear-gradient(135deg, rgba(46, 135, 246, 0.92) 0%, rgba(57, 148, 255, 0.88) 50%, rgba(46, 135, 246, 0.92) 100%);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  box-shadow: 0 4px 24px rgba(46, 135, 246, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.15);
  border-bottom: 1px solid rgba(255, 255, 255, 0.18);
}

/* ===== SAPAAN KIRI ===== */
.greeting-area {
  display: flex;
  align-items: center;
  min-width: 0; /* agar teks panjang tidak mendorong layout di mobile */
}
.greeting-text {
  color: #fff;
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin: 0;
}

/* Transisi fade saat teks gantian */
.fade-swap-enter-active,
.fade-swap-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.fade-swap-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.fade-swap-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* ===== LOGO SUDUT KANAN ===== */
.logo-area {
  order: 3;
  justify-self: end;
}
.navbar-logo {
  height: 34px;
  width: auto;
  /* Ubah logo jadi putih solid agar terlihat jelas di background biru glossy */
  filter: brightness(0) invert(1);
}

/* ===== KANAN (placeholder, jaga grid seimbang) ===== */
.right-area {
  order: 2;
}

/* ===== RESPONSIVE: tablet & desktop, sedikit perbesar ===== */
@media (min-width: 768px) {
  .admin-navbar {
    padding: 1rem 2rem;
  }
  .greeting-text {
    font-size: 0.9rem;
  }
  .navbar-logo {
    height: 40px;
  }

  .logo-area {
    order: 2;
    justify-self: center;
  }
  .right-area {
    order: 3;
  }
}

@media (min-width: 1024px) {
  .admin-navbar {
    padding: 1.1rem 3rem;
  }
  .greeting-text {
    font-size: 0.95rem;
  }
  .navbar-logo {
    height: 44px;
  }
}
</style>