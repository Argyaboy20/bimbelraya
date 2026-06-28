<template>
  <div class="landing-page">

    <!-- ===== NAVBAR ===== -->
    <nav class="navbar">
      <div class="navbar-brand">
        <img src="/assets/logobimbel.png" alt="Logo Bimbel Raya" class="navbar-logo" />
      </div>
      <button class="btn-daftar" @click="openModal">Daftar Sekarang</button>
    </nav>

    <!-- ===== HERO ===== -->
    <header class="hero">
      <h1 class="hero-title">Bimbel Raya</h1>
      <h2 class="hero-slogan">Raya-kan Prestasi Bersama Bimbel Raya</h2>
      <p class="hero-subtitle">
        Metode belajar modern, home visit dan privat untuk TK, SD, SMP & SMA. Raih prestasi terbaik bersama tutor berpengalaman.
      </p>

      <!-- Carousel 3D -->
      <div class="carousel-container">
        <div class="carousel-track">
          <div
            v-for="(img, index) in carouselImages"
            :key="index"
            class="carousel-card"
            :style="getCardStyle(index)"
          >
            <img :src="img.src" :alt="img.alt" />
          </div>
        </div>
      </div>

      <!-- Tombol Carousel -->
      <div class="carousel-controls">
        <button class="carousel-btn" @click="prevSlide">
          &#8249;
        </button>
        <button class="carousel-btn" @click="nextSlide">
          &#8250;
        </button>
      </div>
    </header>

    <!-- ===== PROGRAM ===== -->
    <section class="programs animate-section" ref="sectionPrograms">
      <h2 class="section-title">Program Unggulan Kami</h2>
      <p class="section-subtitle">
        Kurikulum disesuaikan untuk setiap jenjang pendidikan dengan pendekatan personal.
      </p>
      <div class="programs-grid">
        <div v-for="program in programs" :key="program.id" class="program-card">
          <div class="program-icon">{{ program.icon }}</div>
          <h3 class="program-title">{{ program.title }}</h3>
          <p class="program-desc">{{ program.desc }}</p>
        </div>
      </div>
    </section>

    <!-- ===== KENAPA KAMI ===== -->
    <!-- Ref="sectionWhy" untuk scroll animation dari kanan -->
    <section class="why-us animate-section animate-from-right" ref="sectionWhy">
      <h2 class="section-title white">Kenapa Pilih Bimbel Raya?</h2>
      <div class="why-grid">
        <div v-for="item in whyUs" :key="item.id" class="why-card">
          <div class="why-icon">{{ item.icon }}</div>
          <h3 class="why-title">{{ item.title }}</h3>
          <p class="why-desc">{{ item.desc }}</p>
        </div>
      </div>
    </section>

    <!-- ===== TESTIMONIAL ===== -->
    <section class="testimonial animate-section" ref="sectionTestimonial">
      <h2 class="section-title">Apa Kata Walimurid?</h2>
      <p class="section-subtitle">
        Sudah ada puluhan walimurid yang mencoba jasa les privat kami. Apa kata mereka?
      </p>

      <!-- Carousel belt: infinite scroll ke kiri, highlight di tengah -->
      <div class="testi-viewport">
        <div class="testi-belt" ref="testiBelt">
          <div
            v-for="(item, index) in testiLoop"
            :key="index"
            class="testi-card"
            :class="{ 'testi-active': getTestiActive(index) }"
          >
            <!-- Sisi kiri: avatar + nama -->
            <div class="testi-left">
              <div class="testi-avatar">{{ item.avatar }}</div>
              <p class="testi-name">{{ item.name }}</p>
            </div>
            <!-- Garis pemisah -->
            <div class="testi-divider"></div>
            <!-- Sisi kanan: ulasan -->
            <div class="testi-right">
              <p class="testi-quote">"{{ item.review }}"</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== CTA ===== -->
    <!-- Ref="sectionCta" untuk scroll animation dari kiri -->
    <section class="cta animate-section" ref="sectionCta">
      <h2 class="cta-title">Siap Bergabung Bersama Kami?</h2>
      <p class="cta-desc">
        Daftarkan diri sekarang dan mulai perjalanan belajar yang menyenangkan
        bersama tentor-tentor terbaik Bimbel Raya.
      </p>
      <button class="btn-cta" @click="openModal">Daftar Sekarang</button>
    </section>

    <!-- ===== FOOTER ===== -->
    <footer class="footer">
      <p>Bimbel Raya © 2026. Semua hak dilindungi.</p>
    </footer>

    <!-- ===== FLOATING HELP BUTTON ===== -->
    <!-- Animasi pill → circle transform, cursor pointer konsisten -->
    <div
      class="help-float"
      :class="{ 'is-pill': showTooltip, 'is-btn': !showTooltip }"
      @click="goToHelp"
      role="button"
      aria-label="Bantuan"
    >
      <span class="help-text" :class="{ visible: showTooltip }">Butuh Bantuan? Bisa ke sini ya</span>
      <span class="help-icon" :class="{ visible: !showTooltip }">💬</span>
    </div>

    <!-- ===== CHAT BANTUAN ===== -->
    <div v-if="showChat" class="chat-window">
      <div class="chat-header">
        <span>💬 Asisten Bimbel Raya</span>
        <button class="chat-close" @click="showChat = false">✕</button>
      </div>
      <div class="chat-body" ref="chatBody">
        <div v-for="(msg, i) in chatMessages" :key="i" class="chat-msg" :class="msg.from">
          <div class="chat-bubble">{{ msg.text }}</div>
        </div>
        <div v-if="chatLoading" class="chat-msg bot">
          <div class="chat-bubble loading">●●●</div>
        </div>
      </div>
      <div class="chat-input-area">
        <input
          v-model="chatInput"
          class="chat-input"
          placeholder="Ketik pesan..."
          @keyup.enter="sendChat"
        />
        <button class="chat-send" @click="sendChat">➤</button>
      </div>
    </div>

    <!-- ===== MODAL DAFTAR ===== -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-box">
        <h3 class="modal-title">Mau daftar sebagai apa?</h3>
        <div class="modal-actions">
          <button class="btn-modal primary" @click="goToSignIn">Daftar Tentor</button>
          <button class="btn-modal secondary" @click="goToWA">Pendaftaran Anak</button>
        </div>
        <button class="btn-close" @click="closeModal">Tutup</button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// ===== MODAL =====
const showModal = ref(false)
const openModal = () => (showModal.value = true)
const closeModal = () => (showModal.value = false)
const goToSignIn = () => {
  closeModal()
  router.push('/daftar')
}

const goToWA = () => {
  const pesan = encodeURIComponent('Halo min. Saya tertarik untuk mendaftarkan anak saya. Mohon info selanjutnya min')
  window.open(`https://wa.me/6282164794445?text=${pesan}`, '_blank')
}

// ===== TOOLTIP HELP =====
const showTooltip = ref(true)
const showChat = ref(false)
const chatInput = ref('')
const chatLoading = ref(false)
const chatBody = ref(null)
const chatMessages = ref([
  { from: 'bot', text: 'Halo! Ada yang bisa kami bantu?' }
])

const goToHelp = () => {
  showChat.value = !showChat.value
}

const scrollChatToBottom = () => {
  nextTick(() => {
    if (chatBody.value) {
      chatBody.value.scrollTop = chatBody.value.scrollHeight
    }
  })
}

const sendChat = async () => {
  const text = chatInput.value.trim()
  if (!text) return

  chatMessages.value.push({ from: 'user', text })
  chatInput.value = ''
  chatLoading.value = true
  scrollChatToBottom()

  // TODO: Ganti bagian ini dengan API AI sungguhan
  // Contoh: const res = await fetch('/api/chat', { method: 'POST', body: JSON.stringify({ message: text }) })
  // const data = await res.json()
  // chatMessages.value.push({ from: 'bot', text: data.reply })
  await new Promise(r => setTimeout(r, 1000)) // simulasi delay
  chatMessages.value.push({ from: 'bot', text: 'Terima kasih pesannya! Fitur AI sedang dalam pengembangan. Untuk info lebih lanjut, silakan hubungi kami via WhatsApp ya 😊' })
  chatLoading.value = false
  scrollChatToBottom()
}

// ===== DATA PROGRAM =====
const programs = ref([
  {
    id: 1,
    icon: '📖',
    title: 'Program Mengaji',
    desc: 'Belajar mengaji baik iqro ataupun Al-Quran agar jadi lancar'
  },
  {
    id: 2,
    icon: '🎨',
    title: 'Program TK',
    desc: 'Belajar sambil bermain, mengenal huruf, angka, dan kreativitas.'
  },
  {
    id: 3,
    icon: '📚',
    title: 'Program SD',
    desc: 'Pemahaman konsep dasar untuk semua mapel dan TKA.'
  },
  {
    id: 4,
    icon: '🔬',
    title: 'Program SMP',
    desc: 'Tersedia mata pelajaran MTK, IPA, B.Ing dan B.Indo serta fokus TKA.'
  },
  {
    id: 5,
    icon: '🎓',
    title: 'Program SMA',
    desc: 'Tersedia MTK, B.Ing, B.Indo Biologi, Fisika, Kimia serta TKA.'
  }
])

// ===== DATA KENAPA KAMI =====
const whyUs = ref([
  {
    id: 1,
    icon: '✅',
    title: 'Tentor Berpengalaman',
    desc: 'Pengajar dari universitas terkemuka dengan pengalaman mengajar profesional.'
  },
  {
    id: 2,
    icon: '🕐',
    title: 'Jadwal Fleksibel',
    desc: 'Belajar kapan saja sesuai waktu luang siswa dan keluarga.'
  },
  {
    id: 3,
    icon: '🎯',
    title: 'Kurikulum Personal',
    desc: 'Materi disesuaikan dengan kebutuhan dan kecepatan belajar tiap siswa.'
  }
])

// ===== CAROUSEL =====
const carouselImages = ref([
  { src: 'https://placehold.co/260x320/024baa/ffffff?text=Foto+1', alt: 'Dokumentasi 1' },
  { src: 'https://placehold.co/260x320/0367d4/ffffff?text=Foto+2', alt: 'Dokumentasi 2' },
  { src: 'https://placehold.co/260x320/024baa/ffffff?text=Foto+3', alt: 'Dokumentasi 3' },
  { src: 'https://placehold.co/260x320/0367d4/ffffff?text=Foto+4', alt: 'Dokumentasi 4' },
  { src: 'https://placehold.co/260x320/024baa/ffffff?text=Foto+5', alt: 'Dokumentasi 5' },
  { src: 'https://placehold.co/260x320/0367d4/ffffff?text=Foto+6', alt: 'Dokumentasi 6' }
])

const current = ref(0)
const total = carouselImages.value.length

const getCardStyle = (index) => {
  let offset = ((index - current.value) % total + total) % total
  if (offset > total / 2) offset -= total
  const z = -Math.abs(offset) * 80
  const x = offset * 140
  const scale = 1 - Math.abs(offset) * 0.12
  const opacity = Math.abs(offset) > 2 ? 0 : 1 - Math.abs(offset) * 0.25
  return {
    transform: `translate(-50%, -50%) translateX(${x}px) translateZ(${z}px) scale(${scale})`,
    opacity,
    zIndex: 10 - Math.abs(offset)
  }
}

const nextSlide = () => { current.value = (current.value + 1) % total }
const prevSlide = () => { current.value = (current.value - 1 + total) % total }

// ===== DATA TESTIMONIAL =====
const testimonials = ref([
  {
    id: 1,
    avatar: '👩',
    name: 'Ibu Sari',
    review: 'Anak saya yang tadinya takut matematika sekarang malah suka. Tentor sangat sabar dan bisa menyesuaikan cara belajar anak saya.'
  },
  {
    id: 2,
    avatar: '👨',
    name: 'Bapak Andi',
    review: 'Jadwal fleksibel banget, sangat membantu karena kesibukan kerja kami. Nilai rapor anak meningkat signifikan hanya dalam 2 bulan.'
  },
  {
    id: 3,
    avatar: '👩‍💼',
    name: 'Ibu Dewi',
    review: 'Pelayanannya profesional, tentor datang tepat waktu dan selalu siap dengan materi. Anak saya senang belajar bersama Bimbel Raya.'
  },
  {
    id: 4,
    avatar: '👨‍💼',
    name: 'Bapak Rudi',
    review: 'Sudah 6 bulan pakai jasa ini, hasilnya nyata. Anak lulus seleksi masuk SMP favorit. Mantap!'
  },
  {
    id: 5,
    avatar: '👩',
    name: 'Ibu Lina',
    review: 'Cara tentor menjelaskan materi sangat mudah dipahami anak saya yang masih SD. Highly recommended untuk para orang tua!'
  },
  {
    id: 6,
    avatar: '👨',
    name: 'Bapak Hendra',
    review: 'Pengajaran materi TKA-nya sangat membantu persiapan anak saya. Materi terstruktur dan fokus sesuai kebutuhan ujian.'
  }
])

// Duplikasi 3x untuk seamless infinite loop
const testiLoop = computed(() => [
  ...testimonials.value,
  ...testimonials.value,
  ...testimonials.value
])

// Index card aktif (modulo dari seluruh loop)
const testiActiveIndex = ref(0)

const getTestiActive = (loopIndex) => loopIndex === testiActiveIndex.value

const testiBelt = ref(null)
const TESTI_SPEED = 0.5 // px per frame (~30px/s)
let testiOffset = 0
let animFrame = null
let lastTime = null

// Lebar card dinamis sesuai breakpoint
const getCardWidth = () => {
  const w = window.innerWidth
  if (w >= 768) return 420   // desktop: 396px card + 24px gap
  if (w >= 640) return 364   // tablet: 340px card + 24px gap
  return 304                  // mobile: 280px card + 24px gap
}

const tickTesti = (timestamp) => {
  if (!lastTime) lastTime = timestamp
  const delta = timestamp - lastTime
  lastTime = timestamp

  const CARD_WIDTH = getCardWidth()
  testiOffset += TESTI_SPEED * (delta / 16.67)

  const totalOneSet = CARD_WIDTH * testimonials.value.length

  // Reset saat offset melewati 1 set penuh (seamless karena 3 duplikat)
  if (testiOffset >= totalOneSet) {
    testiOffset -= totalOneSet
  }

  if (testiBelt.value) {
    testiBelt.value.style.transform = `translateX(${-testiOffset}px)`

    // Cari card mana yang paling dekat ke tengah viewport
    const vpHalf = window.innerWidth / 2
    const beltRect = testiBelt.value.getBoundingClientRect()
    let closestIdx = 0
    let closestDist = Infinity
    const cards = testiBelt.value.children
    for (let i = 0; i < cards.length; i++) {
      const rect = cards[i].getBoundingClientRect()
      const cardCenter = rect.left + rect.width / 2
      const dist = Math.abs(cardCenter - vpHalf)
      if (dist < closestDist) {
        closestDist = dist
        closestIdx = i
      }
    }
    testiActiveIndex.value = closestIdx
  }

  animFrame = requestAnimationFrame(tickTesti)
}

// ===== SCROLL ANIMATION =====
const sectionPrograms = ref(null)
const sectionWhy = ref(null)
const sectionTestimonial = ref(null)
const sectionCta = ref(null)

let observer = null
let autoPlay = null
let tooltipTimer = null
let checkSections = null  // didefinisikan di onMounted

onMounted(() => {
  // Carousel autoplay
  autoPlay = setInterval(nextSlide, 3000)

  // Tooltip: muncul langsung, lalu transform jadi tombol setelah 4 detik
  tooltipTimer = setTimeout(() => {
    showTooltip.value = false
  }, 4000)

  // ===== SCROLL ANIMATION =====
  // Pisahkan: sections dengan animasi vs footer tanpa animasi
  const animatedSections = [
    sectionPrograms.value,
    sectionWhy.value,
    sectionTestimonial.value,
    sectionCta.value
  ]

  checkSections = () => {
    const vh = window.innerHeight

    animatedSections.forEach((el) => {
      if (!el) return
      const rect = el.getBoundingClientRect()

      // Section masuk viewport dari bawah → animate in, dan KUNCI in-view
      if (rect.top < vh * 0.88 && rect.bottom > 0) {
        el.classList.add('in-view')
        el.classList.remove('animate-out')
      }

      // Section keluar dari BAWAH layar (scroll ke atas sampai section hilang ke bawah)
      // → animate out (reset ke hidden supaya bisa animate in lagi nanti)
      if (rect.top >= vh) {
        el.classList.remove('in-view')
        el.classList.remove('animate-out')
      }
    })
  }

  checkSections()
  window.addEventListener('scroll', checkSections, { passive: true })

  // Mulai animasi testimonial
  animFrame = requestAnimationFrame(tickTesti)
})

onUnmounted(() => {
  clearInterval(autoPlay)
  clearTimeout(tooltipTimer)
  if (observer) observer.disconnect()
  if (animFrame) cancelAnimationFrame(animFrame)
  window.removeEventListener('scroll', checkSections)
})
</script>

<style scoped>
/* ===== FONT ===== */
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');

/* Reset global — hapus margin/padding bawaan browser di html & body */
:global(html),:global(body) {
  margin: 0 !important;
  padding: 0 !important;
  width: 100%;
  overflow-x: hidden;
}

* {
  font-family: 'DM Sans', sans-serif;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Pastikan root element & body tidak ada margin/padding bawaan */
.landing-page {
  width: 100%;
}
:global(body) {
  overflow-x: hidden;
}

/* ===== NAVBAR ===== */
.navbar {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  position: sticky;
  top: 0;
  z-index: 50;
  box-shadow: 0 1px 8px rgba(0,0,0,0.08);
}
.navbar-logo {
  height: 32px;
  width: auto;
}
.btn-daftar {
  padding: 0.4rem 1rem;
  border-radius: 9999px;
  background: #024baa;
  color: #fff;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: transform 0.2s;
  font-size: 0.8rem;
}
.btn-daftar:hover {
  transform: scale(1.05);
}

/* ===== HERO ===== */
.hero {
  width: 100%;
  padding: 2.5rem 1rem 2rem;
  text-align: center;
  background: linear-gradient(135deg, #024baa 0%, #0367d4 50%, #60a5fa 100%);
}
.hero-title {
  color: #fff;
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}
.hero-slogan {
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
}
.hero-subtitle {
  color: #bfdbfe;
  max-width: 42rem;
  margin: 0 auto 2rem;
  font-size: 0.875rem;
  line-height: 1.6;
}

/* ===== CAROUSEL ===== */
.carousel-container {
 perspective: 700px;
  height: 240px;
  position: relative;
  max-width: 900px;
  margin: 0 auto;
}
.carousel-track {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
}
.carousel-card {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 160px;
  height: 200px;
  transform-origin: center center;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(2, 75, 170, 0.3);
  transition: transform 0.8s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.8s;
}
.carousel-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.carousel-controls {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}
.carousel-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}
.carousel-btn:hover {
  background: rgba(255, 255, 255, 0.4);
}

/* ===== PROGRAMS ===== */
.programs {
  width: 100%;
  padding: 3rem 1rem;
  background: linear-gradient(180deg, #f0f7ff 0%, #ffffff 100%);
  text-align: center;
}
.section-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #024baa;
  margin-bottom: 1rem;
}
.section-title.white {
  color: #fff;
}
.section-subtitle {
  color: #4b5563;
  margin-bottom: 2rem;
  font-size: 0.875rem;
  max-width: 32rem;
  margin-left: auto;
  margin-right: auto;
}
.programs-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  max-width: 900px;
  margin: 0 auto;
}
.program-card {
  background: #fff;
  border-radius: 16px;
  padding: 1.25rem 1rem;
  text-align: center;
  box-shadow: 0 4px 16px rgba(2,75,170,0.08);
  transition: transform 0.3s, box-shadow 0.3s;
}
.program-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 40px rgba(2, 75, 170, 0.2);
}
.program-icon {
  font-size: 2rem;
  margin-bottom: 0.75rem;
}
.program-title {
  font-size: 1rem;
  font-weight: 700;
  color: #024baa;
  margin-bottom: 0.5rem;
}
.program-desc {
  font-size: 0.875rem;
  color: #4b5563;
}

/* ===== WHY US ===== */
.why-us {
  width: 100%;
  padding: 3rem 1rem;
  background: #024baa;
  text-align: center;
}
.why-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  max-width: 900px;
  margin: 2rem auto 0;
}
.why-card {
  text-align: center;
  color: #fff;
}
.why-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}
.why-title {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}
.why-desc {
  font-size: 0.875rem;
  color: #bfdbfe;
}

/* ===== CTA ===== */
.cta {
  width: 100%;
  padding: 3rem 1rem;
  text-align: center;
  background: linear-gradient(135deg, #024baa, #0367d4);
}
.cta-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 1rem;
}
.cta-desc {
  color: #bfdbfe;
  max-width: 32rem;
  margin: 0 auto 1.5rem;
  font-size: 0.875rem;
  text-align: center;
}
.btn-cta {
  padding: 0.65rem 1.5rem;
  border-radius: 9999px;
  background: #fff;
  color: #024baa;
  font-weight: 700;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  transition: transform 0.2s;
}
.btn-cta:hover {
  transform: scale(1.05);
}

/* ===== FOOTER ===== */
.footer {
  width: 100%;
  padding: 1.5rem 1rem;
  text-align: center;
  background: #f9fafb;
  color: #6b7280;
  font-size: 0.8rem;
}

/* ===== TESTIMONIAL ===== */
.testimonial {
  width: 100%;
  padding: 3rem 0;
  background: #ffffff;
  text-align: center;
  overflow: hidden;
}
.testimonial .section-title {
  margin-bottom: 1rem;
  padding: 0 1rem;
}
.testimonial .section-subtitle {
  padding: 0 1rem;
  margin-bottom: 2rem;
}

/* Viewport: full lebar layar, clip overflow */
.testi-viewport {
  width: 100%;
  overflow: hidden;
  position: relative;
  /* Fade edge kiri & kanan supaya efek seamless */
  mask-image: linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%);
  -webkit-mask-image: linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%);
}

/* Belt: semua card dalam 1 baris, tidak wrap */
.testi-belt {
  display: flex;
  gap: 24px;
  width: max-content;
  /* transform dikendalikan JS */
  will-change: transform;
}

/* Satu card testimonial */
.testi-card {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 280px;
  min-height: 130px;
  background: #f8faff;
  border: 2px solid #e2eaf8;
  border-radius: 20px;
  padding: 1rem;
  gap: 0;
  flex-shrink: 0;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1),
              box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1),
              border-color 0.4s,
              opacity 0.4s;
  opacity: 0.45;
  transform: scale(0.9);
}
/* Card yang aktif (di tengah) */
.testi-card.testi-active {
  opacity: 1;
  transform: scale(1.04);
  border-color: #024baa;
  box-shadow: 0 12px 40px rgba(2, 75, 170, 0.18);
  background: #fff;
}

/* Sisi kiri: avatar + nama */
.testi-left {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 68px;
  gap: 0.5rem;
  flex-shrink: 0;
}
.testi-avatar {
  font-size: 1.8rem;
  line-height: 1;
  width: 44px; 
  height: 44px;
  border-radius: 50%;
  background: #e8f0fe;
  display: flex;
  align-items: center;
  justify-content: center;
}
.testi-name {
  font-size: 0.7rem;
  font-weight: 700;
  color: #024baa;
  text-align: center;
  white-space: nowrap;
}

/* Garis pemisah vertikal */
.testi-divider {
  width: 1.5px;
  align-self: stretch;
  background: #d1ddf5;
  margin: 0 0.65rem;
  flex-shrink: 0;
  border-radius: 2px;
}

/* Sisi kanan: ulasan */
.testi-right {
  flex: 1;
  display: flex;
  align-items: center;
}
.testi-quote {
  font-size: 0.72rem;
  color: #374151;
  line-height: 1.5;
  text-align: left;
}
.testi-card.testi-active .testi-quote {
  color: #1f2937;
}

/* ===== SCROLL ANIMATION ===== */
/* Default: section tersembunyi (belum masuk viewport dari bawah) */
.animate-section {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}
/* Section yang animate masuk dari kanan */
.animate-section.animate-from-right {
  transform: translateX(60px);
}
/* Masuk viewport → animate in, tetap di sini meski scroll ke atas */
.animate-section.in-view {
  opacity: 1;
  transform: translateX(0) translateY(0);
}
/* Kembali ke hidden hanya saat section turun keluar dari bawah layar (scroll ke atas) */

/* ===== FLOATING HELP ===== */
.help-float {
  position: fixed;
  bottom: 16px;
  right: 16px;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background: #024baa;
  color: #fff;
  border-radius: 9999px;
  box-shadow: 0 8px 24px rgba(2, 75, 170, 0.4);
  cursor: pointer;
  width: 230px;
  padding: 0 20px;
  height: 48  px;
  overflow: hidden;
  transition:
    width 0.6s cubic-bezier(0.4, 0, 0.2, 1),
    padding 0.6s cubic-bezier(0.4, 0, 0.2, 1),
    border-radius 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  bottom: calc(16px + env(safe-area-inset-bottom));
}
.help-float.is-pill {
  width: 230px;
  padding: 0 20px;
  border-radius: 9999px;
  justify-content: flex-start;
}
.help-float.is-btn {
  width: 48px; 
  height: 48px;
  padding: 0;
  border-radius: 50%;
  justify-content: center;
  align-items: center;
}
.help-float:hover {
  transform: scale(1.07);
}
/* Teks: tampil saat pill, hilang saat circle */
.help-text {
  font-size: 11px;
  white-space: nowrap;
  font-weight: 500;
  flex: 1;
  opacity: 0;
  max-width: 0;
  transition: opacity 0.35s, max-width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
  overflow: hidden;
}
.help-text.visible {
  opacity: 1;
  max-width: 200px;
}
/* Ikon: hidden by default, animate in setelah pill → circle */
.help-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: scale(0.3) rotate(-30deg);
  transition: opacity 0.4s 0.45s, transform 0.4s 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.help-icon.visible {
  opacity: 1;
  transform: scale(1) rotate(0deg);
}

/* ===== MODAL ===== */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}
.modal-box {
  background: #fff;
  border-radius: 12px;
  padding: 2rem;
  max-width: 360px;
  width: 90%;
  text-align: center;
}
.modal-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #024baa;
  margin-bottom: 1.5rem;
}
.modal-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.btn-modal {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-modal.primary {
  background: #024baa;
  color: #fff;
}
.btn-modal.primary:hover {
  background: #0367d4;
}
.btn-modal.secondary {
  background: #0367d4;
  color: #fff;
}
.btn-modal.secondary:hover {
  background: #024baa;
}
.btn-close {
  margin-top: 1rem;
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  font-size: 0.875rem;
}
.btn-close:hover {
  color: #374151;
}

/* ===== CHAT WINDOW ===== */
.chat-window {
  position: fixed;
  inset: 0;
  margin: auto;
  width: calc(100vw - 48px);
  max-width: 360px;
  height: fit-content;
  max-height: 75vh;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 12px 48px rgba(2, 75, 170, 0.22);
  display: flex;
  flex-direction: column;
  z-index: 9998;
  overflow: hidden;
  animation: chatFadeIn 0.25s ease-out;
}

/* Overlay gelap blur di belakang chat */
.chat-window::before {
  content: '';
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
  z-index: -1;
}

@keyframes chatFadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to   { opacity: 1; transform: scale(1); }
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #024baa;
  color: #fff;
  padding: 0.85rem 1.1rem;
  font-weight: 700;
  font-size: 0.9rem;
  flex-shrink: 0;
}
.chat-close {
  background: none;
  border: none;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  line-height: 1;
}
.chat-body {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  background: #f4f7ff;
  max-height: calc(75vh - 120px);
}
.chat-msg {
  display: flex;
}
.chat-msg.bot {
  justify-content: flex-start;
}
.chat-msg.user {
  justify-content: flex-end;
}
.chat-bubble {
  max-width: 80%;
  padding: 0.55rem 0.9rem;
  border-radius: 16px;
  font-size: 0.84rem;
  line-height: 1.5;
}
.chat-msg.bot .chat-bubble {
  background: #fff;
  color: #1f2937;
  border-bottom-left-radius: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
}
.chat-msg.user .chat-bubble {
  background: #024baa;
  color: #fff;
  border-bottom-right-radius: 4px;
}
.chat-bubble.loading {
  letter-spacing: 4px;
  color: #9ca3af;
  font-size: 1rem;
}
.chat-input-area {
  display: flex;
  border-top: 1px solid #e5e7eb;
  background: #fff;
  flex-shrink: 0;
}
.chat-input {
  flex: 1;
  padding: 0.7rem 1rem;
  border: none;
  outline: none;
  font-size: 0.85rem;
  font-family: 'DM Sans', sans-serif;
}
.chat-send {
  padding: 0 1rem;
  background: #024baa;
  color: #fff;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s;
}
.chat-send:hover {
  background: #0367d4;
}

/* =====================================================
   RESPONSIVE — Mobile-first
   @media 641px  : ditambahkan jika perlu tweak kecil
   @media 768px  : tablet
   @media 1024px : desktop
   ===================================================== */

/* ===== TABLET (≥ 641px) ===== */
@media (min-width: 641px) {

  /* Navbar */
  .navbar {
    padding: 0.5rem 1.5rem;
  }
  .navbar-logo {
    height: 36px;
  }
  .btn-daftar {
    padding: 0.45rem 1.25rem;
    font-size: 0.875rem;
  }

  /* Hero */
  .hero {
    padding: 3rem 1.5rem 2.5rem;
  }
  .hero-title {
    font-size: 2rem;
  }
  .hero-slogan {
    font-size: 1.15rem;
    margin-bottom: 1.25rem;
  }
  .hero-subtitle {
    font-size: 0.9rem;
    margin-bottom: 2.5rem;
  }

  /* Carousel foto */
  .carousel-container {
    height: 300px;
    perspective: 900px;
  }
  .carousel-card {
    width: 200px;
    height: 250px;
  }

  /* Programs */
  .programs {
    padding: 4rem 1.5rem;
  }
  .programs-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
  }
  .program-card {
    padding: 1.5rem;
  }

  /* Why us */
  .why-us {
    padding: 4rem 1.5rem;
  }
  .why-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
    margin-top: 2.5rem;
  }

  /* Testimonial */
  .testimonial {
    padding: 4rem 0;
  }
  .testi-card {
    width: 340px;
    min-height: 136px;
    padding: 1.25rem;
  }
  .testi-left {
    min-width: 78px;
  }
  .testi-avatar {
    width: 50px;
    height: 50px;
    font-size: 2.2rem;
  }
  .testi-name {
    font-size: 0.75rem;
  }
  .testi-quote {
    font-size: 0.78rem;
  }

  /* Section headings */
  .section-title {
    font-size: 1.6rem;
  }

  /* CTA */
  .cta {
    padding: 4rem 1.5rem;
  }
  .cta-title {
    font-size: 1.6rem;
  }

  /* Help float */
  .help-float {
    bottom: 20px;
    right: 20px;
    height: 52px;
    width: 248px;
    bottom: calc(20px + env(safe-area-inset-bottom));
  }
  .help-float.is-pill {
    width: 248px;
  }
  .help-float.is-btn {
    width: 52px;
    height: 52px;
  }

  .chat-window {
    width: 380px;
    max-height: 500px;
  }
  .chat-body {
    max-height: 340px;
  }
}

/* ===== DESKTOP (≥ 768px) ===== */
@media (min-width: 768px) {

  /* Navbar */
  .navbar {
    padding: 0.5rem 2rem;
  }
  .navbar-logo {
    height: 40px;
  }
  .btn-daftar {
    padding: 0.5rem 1.5rem;
    font-size: 0.9rem;
  }

  /* Hero */
  .hero {
    padding: 4rem 2rem 3rem;
  }
  .hero-title {
    font-size: 2.25rem;
  }
  .hero-slogan {
    font-size: 1.25rem;
    margin-bottom: 1.5rem;
  }
  .hero-subtitle {
    font-size: 1rem;
    margin-bottom: 3rem;
  }

  /* Carousel foto */
  .carousel-container {
    height: 360px;
    perspective: 1200px;
  }
  .carousel-card {
    width: 260px;
    height: 320px;
  }

  /* Programs */
  .programs {
    padding: 3.5rem 2rem;
  }
  .programs-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
    max-width: 960px;
  }
  .program-card {
    padding: 2rem;
  }
  .program-icon {
    font-size: 2.5rem;
  }

  /* Why us */
  .why-us {
    padding: 3.5rem 2rem;
  }
  .why-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    margin-top: 3rem;
    max-width: 960px;
  }
  .why-icon {
    font-size: 2.5rem;
  }

  /* Testimonial */
  .testimonial {
    padding: 3.5rem 0;
  }
  .testi-card {
    width: 396px;
    min-height: 140px;
    padding: 1.5rem;
  }
  .testi-left {
    min-width: 90px;
  }
  .testi-avatar {
    width: 58px;
    height: 58px;
    font-size: 2.6rem;
  }
  .testi-name {
    font-size: 0.78rem;
  }
  .testi-divider {
    margin: 0 1.1rem;
  }
  .testi-quote {
    font-size: 0.82rem;
    line-height: 1.6;
  }

  /* Section headings */
  .section-title {
    font-size: 1.75rem;
  }
  .section-subtitle {
    font-size: 1rem;
    margin-bottom: 3rem;
  }

  /* CTA */
  .cta {
    padding: 3.5rem 2rem;
  }
  .cta-title {
    font-size: 1.75rem;
  }
  .cta-desc {
    font-size: 1rem;
    margin-bottom: 2rem;
  }
  .btn-cta {
    font-size: 1.125rem;
    padding: 0.75rem 2rem;
  }

  /* Footer */
  .footer {
    padding: 2rem 1.5rem;
    font-size: 0.875rem;
  }

  /* Help float — ukuran penuh */
  .help-float {
    bottom: 24px;
    right: 24px;
    height: 56px;
    width: 260px;
    bottom: calc(24px + env(safe-area-inset-bottom));
  }
  .help-float.is-pill {
    width: 260px;
  }
  .help-float.is-btn {
    width: 56px;
    height: 56px;
  }
  .help-text {
    font-size: 13px;
  }

  .chat-window {
    width: 360px;
    max-height: 500px;
  }
  .chat-body {
    max-height: 340px;
  }
}

/* ===== LARGE DESKTOP (≥ 1024px) ===== */
@media (min-width: 1024px) {

  .navbar {
    padding: 0.5rem 3rem;
  }

  .hero {
    padding: 4rem 2rem 3.5rem;
  }
  .hero-title {
    font-size: 2.75rem;
  }
  .hero-slogan {
    font-size: 1.4rem;
  }

  .programs {
    padding: 4rem 2rem;
  }
  .programs-grid {
    max-width: 1100px;
  }

  .why-us {
    padding: 4rem 2rem;
  }
  .why-grid {
    max-width: 1100px;
  }

  .testimonial {
    padding: 4rem 0;
  }

  .cta {
    padding: 4rem 2rem;
  }
  .cta-title {
    font-size: 2rem;
  }
}
</style>