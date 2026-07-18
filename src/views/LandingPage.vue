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

    <!-- ===== DAERAH LAYANAN ===== -->
    <!-- Ref="sectionServiceArea" untuk scroll animation dari kanan -->
    <section class="service-area animate-section animate-from-right" ref="sectionServiceArea">
      <h2 class="section-title white">Daerah Layanan</h2>
      <p class="section-subtitle light">
        Bimbel Raya sudah melayani berbagai kota, tersebar di 4 wilayah berikut.
      </p>
      <div class="service-grid">
        <div v-for="area in serviceAreas" :key="area.id" class="service-card">
          <div class="service-icon">{{ area.icon }}</div>
          <h3 class="service-title">{{ area.title }}</h3>
          <div class="service-cities">
            <span v-for="(city, i) in area.cities" :key="i" class="service-city-tag">{{ city }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== JAM LAYANAN ===== -->
    <section class="jam-layanan animate-section" ref="sectionJamLayanan">
      <h2 class="section-title">Jam Layanan</h2>

      <!-- Jam digital realtime -->
      <div class="jam-digital">{{ jamSekarang }}</div>

      <!-- Status BUKA / TUTUP -->
      <div class="jam-status" :class="isOpen ? 'status-buka' : 'status-tutup'">
        {{ isOpen ? 'BUKA' : 'TUTUP' }}
      </div>

      <!-- Grid jadwal -->
      <div class="jam-grid">
        <div class="jam-card">
          <div class="jam-card-icon">📅</div>
          <div class="jam-card-hari">Senin – Jumat</div>
          <div class="jam-card-waktu">08.00 – 21.00</div>
        </div>
        <div class="jam-card">
          <div class="jam-card-icon">🏖️</div>
          <div class="jam-card-hari">Sabtu & Minggu</div>
          <div class="jam-card-waktu">09.00 – 17.00</div>
        </div>
      </div>
    </section>

    <!-- ===== KONTAK KAMI ===== -->
    <section class="kontak animate-section animate-from-right" ref="sectionKontak">
      <h2 class="section-title white">Kontak Kami</h2>
      <p class="section-subtitle light">Hubungi kami lewat platform favoritmu</p>

      <div class="kontak-grid">
        <!-- Instagram -->
        <a
          href="https://www.instagram.com/bimbel_raya"
          target="_blank"
          rel="noopener"
          class="kontak-card"
        >
          <div class="kontak-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="2" width="20" height="20" rx="6" stroke="currentColor" stroke-width="2"/>
              <circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="2"/>
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
            </svg>
          </div>
          <div class="kontak-name">Instagram</div>
          <div class="kontak-handle">@bimbel_raya</div>
        </a>

        <!-- Email -->
        <a
          href="mailto:bimbelrayaid@gmail.com"
          class="kontak-card"
        >
          <div class="kontak-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="4" width="20" height="16" rx="3" stroke="currentColor" stroke-width="2"/>
              <path d="M2 7l10 7 10-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="kontak-name">Email</div>
          <div class="kontak-handle">bimbelrayaid@gmail.com</div>
        </a>

        <!-- Facebook -->
        <a
          href="https://www.facebook.com/profile.php?id=100088995355093"
          target="_blank"
          rel="noopener"
          class="kontak-card"
        >
          <div class="kontak-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="kontak-name">Facebook</div>
          <div class="kontak-handle">Bimbel Raya</div>
        </a>
      </div>
    </section>

    <!-- ===== CARA BERGABUNG ===== -->
    <!-- Ref="sectionHowItWorks" untuk scroll animation dari kiri -->
    <section class="how-it-works animate-section animate-from-left" ref="sectionHowItWorks">
      <h2 class="section-title">Bagaimana Cara Bergabung?</h2>
      <p class="section-subtitle">
        Cuma 4 langkah mudah untuk mulai belajar bersama tentor Bimbel Raya.
      </p>
      <div class="steps-grid">
        <div v-for="(step, index) in howItWorks" :key="step.id" class="step-card">
          <div class="step-number">{{ index + 1 }}</div>
          <div class="step-icon">{{ step.icon }}</div>
          <h3 class="step-title">{{ step.title }}</h3>
          <p class="step-desc">{{ step.desc }}</p>
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
    <div v-if="showChat" class="chat-overlay" @click="closeChat"></div>

    <div v-if="showChat" class="chat-window">
      <div class="chat-header">
        <span>💬 Asisten Bimbel Raya</span>
        <button class="chat-close" @click="closeChat">✕</button>
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

// ===== JAM LAYANAN =====
const jamSekarang = ref('')
const isOpen = ref(false)
let jamTimer = null

const updateJam = () => {
  const now = new Date()
  const h = now.getHours()
  const m = now.getMinutes().toString().padStart(2, '0')
  jamSekarang.value = `${h.toString().padStart(2, '0')}:${m}`

  const day = now.getDay() // 0=Minggu, 1=Senin, ..., 6=Sabtu
  const total = h * 60 + now.getMinutes()

  if (day >= 1 && day <= 5) {
    // Senin–Jumat: 08:00–21:00
    isOpen.value = total >= 480 && total < 1260
  } else {
    // Sabtu & Minggu: 09:00–17:00
    isOpen.value = total >= 540 && total < 1020
  }
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
  if (showChat.value) {
    document.body.style.overflow = 'hidden'
    document.body.style.touchAction = 'none'
  } else {
    document.body.style.overflow = ''
    document.body.style.touchAction = ''
  }
}

const closeChat = () => {
  showChat.value = false
  document.body.style.overflow = ''
  document.body.style.touchAction = ''
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
  },
  {
    id: 4,
    icon: '🏠',
    title: 'Home Visit',
    desc: 'Menerapkan home visit atau tentor datang langsung ke rumah walimurid yang buat jadi makin nyaman.'
  }
])

// ===== DATA DAERAH LAYANAN =====
const serviceAreas = ref([
  {
    id: 1,
    icon: '🕌',
    title: 'Kudus dan Sekitarnya',
    cities: ['Kudus', 'Jepara', 'Rembang', 'Purwodadi', 'Gebog', 'Grobogan']
  },
  {
    id: 2,
    icon: '🚆',
    title: 'Madiun dan Sekitarnya',
    cities: ['Madiun', 'Wonosobo', 'Ngawi', 'Nganjuk', 'Kediri', 'Purwokerto']
  },
  {
    id: 3,
    icon: '🏛️',
    title: 'Semarang dan Sekitarnya',
    cities: ['Semarang', 'Kendal', 'Ungaran', 'Salatiga']
  },
  {
    id: 4,
    icon: '🏯',
    title: 'Demak, Jogja dan Sekitarnya',
    cities: ['Demak', 'Mranggen', 'Mijen', 'Yogyakarta', 'Sleman', 'Bantul', 'GunungKidul', 'KulonProgo', 'Solo', 'Boyolali', 'Sukoharjo', 'Karanganyar', 'Wonogiri', 'Sragen', 'Klaten']
  }
])

// ===== DATA CARA BERGABUNG =====
// Section usulan Claude, silakan dikoreksi kalau ada yang mau diubah
const howItWorks = ref([
  {
    id: 1,
    icon: '💬',
    title: 'Hubungi Kami',
    desc: 'Klik tombol daftar dan kirim pesan via WhatsApp ke tim Bimbel Raya.'
  },
  {
    id: 2,
    icon: '📝',
    title: 'Konsultasi Kebutuhan',
    desc: 'Ceritakan jenjang, mata pelajaran, dan jadwal belajar yang diinginkan.'
  },
  {
    id: 3,
    icon: '🧑‍🏫',
    title: 'Tentor Dijadwalkan',
    desc: 'Kami carikan tentor yang sesuai dan atur jadwal home visit ke rumah.'
  },
  {
    id: 4,
    icon: '🚀',
    title: 'Mulai Belajar',
    desc: 'Anak mulai belajar rutin dan perkembangannya dipantau bersama.'
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
const sectionServiceArea = ref(null)
const sectionHowItWorks = ref(null)
const sectionCta = ref(null)
const sectionJamLayanan = ref(null)
const sectionKontak = ref(null)

let observer = null
let autoPlay = null
let tooltipTimer = null
let checkSections = null  // didefinisikan di onMounted

onMounted(() => {
  // Carousel autoplay
  autoPlay = setInterval(nextSlide, 3000)
  updateJam()
  jamTimer = setInterval(updateJam, 1000)

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
    sectionServiceArea.value,
    sectionJamLayanan.value,
    sectionKontak.value,
    sectionHowItWorks.value,
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
  document.body.style.overflow = ''
  document.body.style.touchAction = ''
  clearInterval(autoPlay)
  clearTimeout(tooltipTimer)
  if (jamTimer) clearInterval(jamTimer)
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
.section-subtitle.light {
  color: #bfdbfe;
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

/* ===== DAERAH LAYANAN ===== */
.service-area {
  width: 100%;
  padding: 3rem 1rem;
  background: #024baa;
  text-align: center;
}
.service-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
  max-width: 900px;
  margin: 0 auto;
}
.service-card {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 16px;
  padding: 1.5rem;
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s, background 0.3s;
}
.service-card:hover,
.service-card:active {
  transform: translateY(-8px);
  background: rgba(255, 255, 255, 0.16);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.25);
}
.service-icon {
  font-size: 2rem;
  margin-bottom: 0.75rem;
}
.service-title {
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.75rem;
}
.service-cities {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
}
.service-city-tag {
  font-size: 0.75rem;
  color: #eaf2ff;
  background: rgba(255, 255, 255, 0.12);
  padding: 0.3rem 0.7rem;
  border-radius: 9999px;
}

/* ===== CARA BERGABUNG ===== */
.how-it-works {
  width: 100%;
  padding: 3rem 1rem;
  background: #ffffff;
  text-align: center;
}
.steps-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  max-width: 900px;
  margin: 2rem auto 0;
}
.step-card {
  position: relative;
  text-align: center;
  background: #f8faff;
  border-radius: 16px;
  padding: 1.75rem 1.25rem 1.5rem;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}
.step-card:hover,
.step-card:active {
  transform: translateY(-8px);
  box-shadow: 0 16px 40px rgba(2, 75, 170, 0.2);
}
.step-number {
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translateX(-50%);
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #024baa;
  color: #fff;
  font-size: 0.8rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}
.step-icon {
  font-size: 2rem;
  margin-top: 0.5rem;
  margin-bottom: 0.75rem;
}
.step-title {
  font-size: 1rem;
  font-weight: 700;
  color: #024baa;
  margin-bottom: 0.5rem;
}
.step-desc {
  font-size: 0.875rem;
  color: #4b5563;
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
/* Section yang animate masuk dari kiri */
.animate-section.animate-from-left {
  transform: translateX(-60px);
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
  width: 240px;
  padding: 0 12px 0 16px;
  height: 48px;
  overflow: hidden;
  transition:
    width 0.6s cubic-bezier(0.4, 0, 0.2, 1),
    padding 0.6s cubic-bezier(0.4, 0, 0.2, 1),
    border-radius 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  bottom: calc(16px + env(safe-area-inset-bottom));
}
.help-float.is-pill {
  width: 240px;
  padding: 0 12px 0 16px;
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
  max-width: 215px;
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
  width: calc(100vw - 32px);
  max-width: 420px;
  height: auto;
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

.chat-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
  z-index: 9997;   /* di bawah chat-window (9998) */
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

/* ===== JAM LAYANAN ===== */
.jam-layanan {
  background: #ffffff;
  padding: 3rem 1rem;
  text-align: center;
}

.jam-digital {
  font-size: 4rem;
  font-weight: 700;
  color: #024baa;
  letter-spacing: 0.1em;
  margin: 1.5rem auto 1rem;
  font-variant-numeric: tabular-nums;
  line-height: 1;
}

.jam-status {
  display: inline-block;
  padding: 0.4rem 1.5rem;
  border-radius: 9999px;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  margin-bottom: 2rem;
}
.status-buka {
  background: #dcfce7;
  color: #15803d;
}
.status-tutup {
  background: #fee2e2;
  color: #b91c1c;
}

.jam-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  max-width: 480px;
  margin: 0 auto;
}

.jam-card {
  background: #f0f6ff;
  border: 1.5px solid #d1e5ff;
  border-radius: 16px;
  padding: 1.25rem 1rem;
  text-align: center;
}
.jam-card-icon {
  font-size: 1.75rem;
  margin-bottom: 0.5rem;
}
.jam-card-hari {
  font-size: 0.8rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.3rem;
}
.jam-card-waktu {
  font-size: 1rem;
  font-weight: 700;
  color: #024baa;
}

/* ===== KONTAK KAMI ===== */
.kontak {
  background: linear-gradient(135deg, #024baa 0%, #0367d4 100%);
  padding: 3rem 1rem;
  text-align: center;
}

.kontak-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  max-width: 480px;
  margin: 0 auto;
}

.kontak-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.12);
  border: 1.5px solid rgba(255, 255, 255, 0.2);
  border-radius: 18px;
  padding: 1.5rem 1rem;
  text-decoration: none;
  color: #fff;
  transition: background 0.25s, transform 0.2s, box-shadow 0.25s;
  cursor: pointer;
}
.kontak-card:hover {
  background: rgba(255, 255, 255, 0.22);
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.18);
}
.kontak-card:active {
  transform: scale(0.97);
}

.kontak-icon {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.18);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.kontak-icon svg {
  width: 24px;
  height: 24px;
  color: #fff;
}

.kontak-name {
  font-size: 0.9rem;
  font-weight: 700;
}
.kontak-handle {
  font-size: 0.78rem;
  opacity: 0.8;
  word-break: break-all;
}

/* =====================================================
   RESPONSIVE — Mobile-first
   @media 641px  : tablet
   @media 768px  : desktop
   @media 1024px : large desktop
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
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    margin-top: 2.5rem;
  }

  /* Daerah layanan */
  .service-area {
    padding: 4rem 1.5rem;
  }
  .service-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }

  /* Cara bergabung */
  .how-it-works {
    padding: 4rem 1.5rem;
  }
  .steps-grid {
    grid-template-columns: repeat(2, 1fr);
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
    height: auto;
    max-height: 500px;
  }
  .chat-body {
    max-height: 340px;
  }

  .jam-layanan { 
    padding: 4rem 1.5rem; 
  }
  .jam-digital { 
    font-size: 5rem; 
  }
  .kontak { 
    padding: 4rem 1.5rem; 
    }
  .kontak-grid { 
    grid-template-columns: repeat(3, 1fr); max-width: 600px; 
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
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
    margin-top: 3rem;
    max-width: 960px;
  }
  .why-icon {
    font-size: 2.5rem;
  }

  /* Daerah layanan */
  .service-area {
    padding: 3.5rem 2rem;
  }
  .service-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
    max-width: 1100px;
  }
  .service-icon {
    font-size: 2.5rem;
  }

  /* Cara bergabung */
  .how-it-works {
    padding: 3.5rem 2rem;
  }
  .steps-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
    margin-top: 3rem;
    max-width: 1100px;
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
    height: auto;
    max-height: 500px;
  }
  .chat-body {
    max-height: 340px;
  }

  .jam-layanan { 
    padding: 4rem 2rem; 
  }
  .jam-digital { 
    font-size: 5.5rem; 
  }
  .jam-grid { 
    max-width: 520px; gap: 1.25rem; 
  }
  .jam-card { 
    padding: 1.5rem 1.25rem; 
  }
  .jam-card-waktu { 
    font-size: 1.1rem; 
  }
  .kontak { 
    padding: 4rem 2rem; 
  }
  .kontak-grid { 
    max-width: 700px; 
  }
  .kontak-icon { 
    width: 56px; height: 56px; 
  }
  .kontak-icon svg { 
    width: 28px; height: 28px; 
  }
  .kontak-name { 
    font-size: 1rem; 
  }
  .kontak-handle { 
    font-size: 0.82rem; 
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

  .service-area {
    padding: 4rem 2rem;
  }
  .service-grid {
    max-width: 1200px;
  }

  .how-it-works {
    padding: 4rem 2rem;
  }
  .steps-grid {
    max-width: 1200px;
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

  .jam-digital { 
    font-size: 6rem; 
  }
  .kontak-grid { 
    max-width: 780px; 
  }
}
</style>