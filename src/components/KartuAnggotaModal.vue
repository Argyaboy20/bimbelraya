<!-- KartuAnggotaModal.vue -->
<template>
  <Teleport to="body">
    <div class="kartu-latar" role="dialog" aria-modal="true" aria-label="Kartu Tanda Anggota">
      <!-- Hiasan latar: ikon belajar + bulatan warna Bimbel Raya -->
      <div class="hiasan" aria-hidden="true">
        <span class="blob blob-biru"></span>
        <span class="blob blob-oranye"></span>
        <span class="blob blob-krem"></span>
        <BookOpen class="ikon-hias h1" />
        <Pencil class="ikon-hias h2" />
        <GraduationCap class="ikon-hias h3" />
        <Calculator class="ikon-hias h4" />
        <Star class="ikon-hias h5" />
        <BookOpen class="ikon-hias h6" />
      </div>

      <button type="button" class="kartu-tutup" aria-label="Tutup" @click="emit('tutup')">
        <X size="1.2em" />
      </button>

      <div class="kartu-wadah">
        <div
          class="kartu-flip"
          :class="{ terbalik }"
          role="button"
          tabindex="0"
          aria-label="Kartu Tanda Anggota. Tekan untuk membalik kartu"
          @click="terbalik = !terbalik"
          @keydown.enter.prevent="terbalik = !terbalik"
          @keydown.space.prevent="terbalik = !terbalik"
        >
          <div class="kartu-dalam">
            <!-- ===== SISI DEPAN ===== -->
            <div class="sisi depan">
              <div class="header-depan"></div>
              <span class="blob-depan"></span>

              <div class="isi-depan">
                <div class="foto-bulat">
                  <img
                    v-if="fotoLink && !gagalMuat"
                    :src="fotoLink"
                    alt="Foto profil"
                    class="foto-img"
                    @error="gagalMuat = true"
                  />
                  <div v-else class="foto-avatar"><User class="avatar-ikon" /></div>

                  <div v-if="mengunggah" class="foto-loading"><span class="spinner"></span></div>

                  <button
                    type="button"
                    class="foto-ganti"
                    aria-label="Ganti foto profil"
                    :disabled="mengunggah"
                    @click.stop="pilihFoto"
                    @keydown.stop
                  >
                    <Camera size="1em" />
                  </button>
                </div>

                <h2 class="kartu-nama">{{ nama }}</h2>
                <span class="kartu-garis"></span>
                <p class="kartu-posisi">Tentor Bimbel Raya</p>
              </div>

              <span class="strip"></span>
            </div>

            <!-- ===== SISI BELAKANG ===== -->
            <div class="sisi belakang">
              <span class="blob-belakang"></span>
              <div class="isi-belakang">
                <img src="/assets/logobimbel.png" alt="Logo Bimbel Raya" class="kartu-logo" />
                <h3 class="syarat-judul">Syarat dan Ketentuan</h3>
                <ol class="syarat-daftar">
                  <li>Kartu ini berlaku selama masa kontrak masih aktif.</li>
                  <li>Kartu ini merupakan tanda keanggotaan resmi dan identitas tentor Bimbel Raya.</li>
                  <li>Kartu ini tidak boleh dipindahtangankan atau disalahgunakan oleh pihak lain.</li>
                  <li>Apabila terdapat perubahan data atau kendala pada kartu, harap menghubungi admin Bimbel Raya.</li>
                </ol>
              </div>
              <span class="strip"></span>
            </div>
          </div>
        </div>

        <p class="kartu-petunjuk">Ketuk kartu untuk membaliknya</p>
        <p v-if="pesanError" class="kartu-error" role="alert">{{ pesanError }}</p>
      </div>

      <input
        ref="inputFoto"
        type="file"
        accept="image/*"
        class="input-tersembunyi"
        @change="saatFotoDipilih"
      />
    </div>
  </Teleport>
</template>

<script setup>
defineOptions({ name: 'KartuAnggotaModal' })
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { api, ApiError } from '@/api/http'
import { X, Camera, User, BookOpen, Pencil, GraduationCap, Calculator, Star } from 'lucide-vue-next'

const props = defineProps({
  nama: { type: String, default: 'Tentor' },
  fotoLink: { type: String, default: null },
})
const emit = defineEmits(['tutup', 'fotoBaru'])

const terbalik = ref(false)
const gagalMuat = ref(false)
const mengunggah = ref(false)
const pesanError = ref('')
const inputFoto = ref(null)

// Link foto baru (setelah diunggah / diperbarui) → coba tampilkan lagi
watch(
  () => props.fotoLink,
  () => {
    gagalMuat.value = false
  },
)

const pilihFoto = () => inputFoto.value?.click()

async function saatFotoDipilih(e) {
  const file = e.target.files?.[0]
  e.target.value = '' // supaya foto yang sama bisa dipilih ulang
  if (!file) return
  pesanError.value = ''
  if (!file.type.startsWith('image/')) {
    pesanError.value = 'File harus berupa foto (JPG, PNG, atau WebP)'
    return
  }
  if (file.size > 5 * 1024 * 1024) {
    pesanError.value = 'Ukuran foto maksimal 5 MB'
    return
  }
  mengunggah.value = true
  try {
    const fd = new FormData()
    fd.append('foto', file)
    const data = await api('/api/tentor/foto-profil', { method: 'PUT', body: fd })
    emit('fotoBaru', data.fotoProfilLink)
  } catch (err) {
    pesanError.value = err instanceof ApiError ? err.message : 'Gagal mengunggah foto. Coba lagi.'
  } finally {
    mengunggah.value = false
  }
}

// Halaman di belakang modal tidak ikut ter-scroll
onMounted(() => {
  document.body.style.overflow = 'hidden'
})
onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

* {
  font-family: 'DM Sans', sans-serif;
  box-sizing: border-box;
}

/* ===== LATAR MODAL ===== */
.kartu-latar {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  overflow-y: auto;
  background: linear-gradient(165deg, #1d6fd4 0%, #2e87f6 38%, #7ab6fa 68%, #f9eccc 100%);
  animation: latar-masuk 0.3s ease both;
}
@keyframes latar-masuk {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Hiasan: titik-titik + bulatan + ikon belajar */
.hiasan {
  position: fixed;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  background-image: radial-gradient(rgba(255, 255, 255, 0.22) 1.5px, transparent 1.5px);
  background-size: 24px 24px;
}
.blob {
  position: absolute;
  border-radius: 50%;
}
.blob-biru {
  width: 260px;
  height: 260px;
  top: -90px;
  left: -90px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.35) 0%, transparent 70%);
}
.blob-oranye {
  width: 240px;
  height: 240px;
  right: -90px;
  top: 30%;
  background: radial-gradient(circle, rgba(243, 92, 43, 0.4) 0%, transparent 70%);
}
.blob-krem {
  width: 300px;
  height: 300px;
  left: -110px;
  bottom: -100px;
  background: radial-gradient(circle, rgba(249, 236, 204, 0.85) 0%, transparent 70%);
}
.ikon-hias {
  position: absolute;
  color: rgba(255, 255, 255, 0.3);
  animation: melayang 6s ease-in-out infinite alternate;
}
.h1 {
  width: 44px;
  height: 44px;
  top: 12%;
  left: 8%;
}
.h2 {
  width: 34px;
  height: 34px;
  top: 20%;
  right: 10%;
  animation-delay: 1s;
}
.h3 {
  width: 50px;
  height: 50px;
  bottom: 14%;
  right: 8%;
  color: rgba(243, 92, 43, 0.45);
  animation-delay: 2s;
}
.h4 {
  width: 36px;
  height: 36px;
  bottom: 22%;
  left: 7%;
  animation-delay: 0.5s;
}
.h5 {
  width: 28px;
  height: 28px;
  top: 46%;
  left: 4%;
  color: rgba(249, 236, 204, 0.7);
  animation-delay: 1.5s;
}
.h6 {
  width: 30px;
  height: 30px;
  top: 8%;
  right: 34%;
  animation-delay: 2.5s;
}
@keyframes melayang {
  from {
    transform: translateY(0) rotate(-4deg);
  }
  to {
    transform: translateY(-14px) rotate(4deg);
  }
}

/* ===== TOMBOL TUTUP ===== */
.kartu-tutup {
  position: fixed;
  top: calc(env(safe-area-inset-top, 0px) + 0.75rem);
  right: 0.75rem;
  z-index: 3;
  width: 42px;
  height: 42px;
  border: 0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  color: #1d6fd4;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  transition: transform 0.2s ease;
}
.kartu-tutup:hover {
  transform: scale(1.08);
}
.kartu-tutup:active {
  transform: scale(0.94);
}

/* ===== WADAH KARTU ===== */
.kartu-wadah {
  position: relative;
  z-index: 2;
  margin: auto;
  padding: calc(env(safe-area-inset-top, 0px) + 4rem) 1rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.9rem;
}

/* ===== KARTU (ukuran semua dalam em, mengikuti font-size) ===== */
.kartu-flip {
  font-size: 13px;
  width: 20em;
  aspect-ratio: 54 / 86;
  perspective: 1200px;
  cursor: pointer;
  outline: none;
  -webkit-tap-highlight-color: transparent;
}
.kartu-flip:focus-visible {
  outline: 3px solid #f3dfa8;
  outline-offset: 4px;
  border-radius: 1.4em;
}
.kartu-dalam {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.7s cubic-bezier(0.4, 0.2, 0.2, 1);
}
.kartu-flip.terbalik .kartu-dalam {
  transform: rotateY(180deg);
}
.sisi {
  position: absolute;
  inset: 0;
  overflow: hidden;
  border-radius: 1.4em;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.28);
  background-color: #fffdf7;
}
.belakang {
  transform: rotateY(180deg);
}

/* Motif corak: titik-titik (depan) dan garis diagonal (belakang) */
.depan {
  background-image: radial-gradient(rgba(46, 135, 246, 0.14) 1px, transparent 1.2px);
  background-size: 14px 14px;
}
.belakang {
  background-image: repeating-linear-gradient(
    45deg,
    rgba(46, 135, 246, 0.08) 0 1px,
    transparent 1px 12px
  );
}

/* Strip 3 warna Bimbel Raya di dasar kartu */
.strip {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 0.7em;
  background: linear-gradient(90deg, #2e87f6 0 40%, #f35c2b 40% 70%, #f3dfa8 70% 100%);
}

/* ----- Depan ----- */
.header-depan {
  position: absolute;
  top: 0;
  left: -10%;
  right: -10%;
  height: 40%;
  border-radius: 0 0 50% 50% / 0 0 3em 3em;
  background:
    radial-gradient(rgba(255, 255, 255, 0.3) 1.2px, transparent 1.5px) 0 0 / 12px 12px,
    linear-gradient(135deg, #2e87f6 0%, #1d6fd4 100%);
}
.blob-depan {
  position: absolute;
  top: -3.5em;
  right: -3.5em;
  width: 11em;
  height: 11em;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(243, 92, 43, 0.6) 0%, rgba(243, 92, 43, 0) 70%);
}
.isi-depan {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 6.4em 1.4em 1.6em;
}

.foto-bulat {
  position: relative;
  flex-shrink: 0;
  width: 9.4em;
  height: 9.4em;
  border-radius: 50%;
  border: 0.35em solid #fff;
  background: #fff;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.22);
}
.foto-img,
.foto-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  display: block;
}
.foto-avatar {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  overflow: hidden;
  background: linear-gradient(160deg, #7ab6fa 0%, #2e87f6 100%);
}
.avatar-ikon {
  width: 72%;
  height: 72%;
  color: #fff;
  margin-bottom: -6%;
}
.foto-loading {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.7);
}
.spinner {
  width: 2.2em;
  height: 2.2em;
  border-radius: 50%;
  border: 0.25em solid rgba(46, 135, 246, 0.25);
  border-top-color: #2e87f6;
  animation: putar 0.8s linear infinite;
}
@keyframes putar {
  to {
    transform: rotate(360deg);
  }
}
.foto-ganti {
  position: absolute;
  right: -0.1em;
  bottom: 0.2em;
  width: 2.5em;
  height: 2.5em;
  border: 0.2em solid #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1em;
  background: #f35c2b;
  color: #fff;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  transition: transform 0.2s ease;
}
.foto-ganti:hover:not(:disabled) {
  transform: scale(1.1);
}
.foto-ganti:disabled {
  opacity: 0.6;
  cursor: default;
}

.kartu-nama {
  margin: 1.1em 0 0;
  font-size: 1.3em;
  font-weight: 700;
  line-height: 1.25;
  text-align: center;
  color: #1f2937;
  word-break: break-word;
}
.kartu-garis {
  display: block;
  width: 55%;
  height: 0.22em;
  margin: 0.8em 0;
  border-radius: 999px;
  background: #2e87f6;
}
.kartu-posisi {
  margin: 0;
  font-size: 0.98em;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: #1d6fd4;
}

/* ----- Belakang ----- */
.blob-belakang {
  position: absolute;
  bottom: -4em;
  left: -4em;
  width: 12em;
  height: 12em;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(46, 135, 246, 0.25) 0%, rgba(46, 135, 246, 0) 70%);
}
.isi-belakang {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2.2em 1.6em 1.6em;
}
.kartu-logo {
  height: 4em;
  width: auto;
  margin-bottom: 1.4em;
}
.syarat-judul {
  margin: 0 0 0.7em;
  font-size: 0.95em;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #1d6fd4;
}
.syarat-daftar {
  margin: 0;
  padding-left: 1.4em;
  font-size: 0.86em;
  line-height: 1.55;
  color: #374151;
}
.syarat-daftar li {
  margin-bottom: 0.6em;
  padding-left: 0.2em;
}

/* ----- Teks di bawah kartu ----- */
.kartu-petunjuk {
  margin: 0;
  font-size: 0.78rem;
  font-weight: 600;
  color: #fff;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
}
.kartu-error {
  margin: 0;
  max-width: 20rem;
  padding: 0.5rem 0.9rem;
  border-radius: 12px;
  font-size: 0.78rem;
  font-weight: 600;
  text-align: center;
  background: #fff;
  color: #b91c1c;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18);
}

.input-tersembunyi {
  display: none;
}

@media (prefers-reduced-motion: reduce) {
  .kartu-latar,
  .ikon-hias,
  .spinner {
    animation: none;
  }
  .kartu-dalam {
    transition-duration: 0.01s;
  }
}

/* ===== BREAKPOINTS ===== */
@media (min-width: 641px) {
  .kartu-flip {
    font-size: 14.5px;
  }
  .kartu-petunjuk {
    font-size: 0.85rem;
  }
}
@media (min-width: 768px) {
  .kartu-flip {
    font-size: 15.5px;
  }
}
@media (min-width: 1024px) {
  .kartu-flip {
    font-size: 16px;
  }
}
</style>