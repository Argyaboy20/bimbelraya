<!-- PendaftaranAnakModal.vue -->
<template>
  <div v-if="tampil" class="pa-overlay" @click.self="tahap !== 'form' && tutup()">
    <div class="pa-box" :class="{ 'pa-box-form': tahap === 'form' }" role="dialog" aria-modal="true">
      <button type="button" class="pa-x" aria-label="Tutup" @click="tutup">
        <X :size="18" />
      </button>

      <!-- ===== TAHAP 1: JENJANG ===== -->
      <template v-if="tahap === 'jenjang'">
        <h3 class="pa-judul">Mau jenjang apa?</h3>
        <div class="pa-opsi-daftar">
          <button
            v-for="j in DAFTAR_JENJANG"
            :key="j"
            type="button"
            class="pa-opsi"
            @click="pilihJenjang(j)"
          >
            {{ j }}
          </button>
        </div>
      </template>

      <!-- ===== TAHAP 2: DAERAH ===== -->
      <template v-else-if="tahap === 'daerah'">
        <h3 class="pa-judul">Pilihan Daerah</h3>
        <div class="pa-opsi-daftar">
          <button
            v-for="d in DAERAH"
            :key="d"
            type="button"
            class="pa-opsi"
            @click="pilihDaerah(d)"
          >
            {{ d }}
          </button>
        </div>
        <button type="button" class="pa-kembali" @click="tahap = 'jenjang'">
          <ChevronLeft :size="16" /> Kembali
        </button>
      </template>

      <!-- ===== TAHAP 3: FORMULIR ===== -->
      <template v-else>
        <h3 class="pa-judul">Pendaftaran Les Privat</h3>
        <p class="pa-sub">{{ J.judulPesan }} &middot; {{ daerah }}</p>

        <div
          v-for="k in KOLOM"
          :key="k.key"
          class="kolom"
          :class="{ galat: tampilGalat(k.key) }"
        >
          <label :for="'pa-' + k.key" class="kolom-label">{{ labelKolom(jenjang, k.key) }}</label>

          <select
            v-if="k.pilihan"
            :id="'pa-' + k.key"
            v-model="data[k.key]"
            class="kolom-input"
            @blur="sentuh[k.key] = true"
          >
            <option value="" disabled>Pilih...</option>
            <option v-for="o in k.pilihan" :key="o" :value="o">{{ o }}</option>
          </select>

          <textarea
            v-else-if="k.key === 'alamat'"
            :id="'pa-' + k.key"
            v-model="data[k.key]"
            class="kolom-input"
            rows="3"
            :maxlength="k.maks"
            :placeholder="placeholder(k.key)"
            @blur="sentuh[k.key] = true"
          ></textarea>

          <input
            v-else
            :id="'pa-' + k.key"
            v-model="data[k.key]"
            type="text"
            class="kolom-input"
            :maxlength="k.maks"
            :placeholder="placeholder(k.key)"
            autocomplete="off"
            @blur="sentuh[k.key] = true"
          />

          <p v-if="k.key === 'alamat'" class="kolom-info">
            Tulis yang jelas dan lengkap. Alamat dijaga kerahasiaannya dan hanya dipakai untuk
            keperluan les privat.
          </p>

          <template v-if="k.key === 'mapel'">
            <p class="kolom-info">{{ J.catatanMapel }}</p>
            <p
              v-if="J.maksMapel !== null && data.mapel.trim()"
              class="kolom-hitung"
              :class="{ lewat: mapelInfo.galat }"
            >
              Mapel terbaca: {{ mapelInfo.jumlah }} dari maks {{ J.maksMapel }}
            </p>
          </template>

          <p
            v-if="tampilGalat(k.key)"
            class="kolom-galat"
            :class="{ 'kolom-galat-mapel': k.key === 'mapel' && mapelInfo.galat }"
            role="alert"
          >
            {{ galat[k.key] }}
          </p>
        </div>

        <p v-if="coba && adaGalat" class="pa-ringkas" role="alert">
          Masih ada isian yang belum benar. Periksa kolom yang bertanda merah.
        </p>

        <button type="button" class="pa-kirim" @click="kirim">
          <Send :size="16" /> Kirim ke WhatsApp
        </button>
        <button type="button" class="pa-kembali" @click="tahap = 'daerah'">
          <ChevronLeft :size="16" /> Kembali
        </button>
      </template>
    </div>
  </div>
</template>

<script setup>
defineOptions({ name: 'PendaftaranAnakModal' })
import { ref, reactive, computed, watch, onBeforeUnmount, nextTick } from 'vue'
import { X, ChevronLeft, Send } from 'lucide-vue-next'
import {
  JENJANG,
  DAERAH,
  KOLOM,
  dataKosong,
  labelKolom,
  validasiForm,
  periksaMapel,
  buatPesan,
  buatTautanWa,
} from '@/utils/pendaftaranAnak'

const props = defineProps({ tampil: { type: Boolean, default: false } })
const emit = defineEmits(['tutup'])

const DAFTAR_JENJANG = Object.keys(JENJANG)
const CONTOH_KELAS = { SD: 'mis. 4 SD', SMP: 'mis. 8 SMP/MTs', SMA: 'mis. 11 SMA/MA' }
const PLACEHOLDER = {
  namaAnak: 'Nama lengkap anak',
  namaWali: 'Nama bapak/ibu',
  asalSekolah: 'Nama sekolah',
  alamat: 'Jalan, nomor, RT/RW, desa/kelurahan, patokan',
  hari: 'mis. Senin dan Kamis',
  jam: 'mis. 16.00 atau ikut guru',
}

const tahap = ref('jenjang') // 'jenjang' | 'daerah' | 'form'
const jenjang = ref('SD')
const daerah = ref('')
const data = reactive(dataKosong())
const sentuh = reactive({})
const coba = ref(false)

const J = computed(() => JENJANG[jenjang.value])
const galat = computed(() => validasiForm(jenjang.value, data))
const adaGalat = computed(() => Object.keys(galat.value).length > 0)
const mapelInfo = computed(() => periksaMapel(jenjang.value, data.mapel))

const placeholder = (key) => {
  if (key === 'kelas') return CONTOH_KELAS[jenjang.value]
  if (key === 'mapel') return J.value.contohMapel
  return PLACEHOLDER[key] ?? ''
}

// Galat Request Mapel tampil seketika (live); kolom lain setelah disentuh atau saat kirim
const tampilGalat = (key) => {
  if (!galat.value[key]) return false
  if (key === 'mapel' && mapelInfo.value.galat) return true
  return Boolean(sentuh[key]) || coba.value
}

function pilihJenjang(j) {
  if (j !== jenjang.value) {
    data.mapel = '' // aturan mapel berbeda tiap jenjang
    sentuh.mapel = false
  }
  jenjang.value = j
  tahap.value = 'daerah'
}

function pilihDaerah(d) {
  daerah.value = d
  tahap.value = 'form'
}

function reset() {
  tahap.value = 'jenjang'
  jenjang.value = 'SD'
  daerah.value = ''
  Object.assign(data, dataKosong())
  Object.keys(sentuh).forEach((k) => delete sentuh[k])
  coba.value = false
}

const tutup = () => emit('tutup')

function kirim() {
  coba.value = true
  const pertama = KOLOM.find((k) => galat.value[k.key])
  if (pertama) {
    nextTick(() => document.getElementById('pa-' + pertama.key)?.focus())
    return
  }
  const pesan = buatPesan(jenjang.value, daerah.value, data)
  window.open(buatTautanWa(pesan), '_blank', 'noopener')
  tutup()
}

// Kunci scroll halaman di belakang selama modal terbuka
const kunciScroll = (kunci) => {
  const nilai = kunci ? 'hidden' : ''
  document.documentElement.style.overflow = nilai
  document.body.style.overflow = nilai
}

watch(
  () => props.tampil,
  (terbuka) => {
    if (terbuka) reset()
    kunciScroll(terbuka)
  },
)
onBeforeUnmount(() => kunciScroll(false))
</script>

<style scoped>
/* =============================================================
   BASE STYLES (MOBILE FIRST)
   Default di bawah ini = tampilan MOBILE (<= 640px).
   Breakpoint override secara berurutan:
   1) @media (min-width: 641px)  -> Tablet
   2) @media (min-width: 768px)  -> Desktop
   3) @media (min-width: 1024px) -> Large Desktop
   ============================================================= */
.pa-overlay {
  position: fixed;
  inset: 0;
  z-index: 110;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.5);
  overflow-y: auto;
  overscroll-behavior: contain;
  box-sizing: border-box;
  font-family: 'DM Sans', sans-serif;
}
.pa-overlay *,
.pa-overlay *::before,
.pa-overlay *::after {
  box-sizing: border-box;
}
.pa-overlay input,
.pa-overlay select,
.pa-overlay textarea,
.pa-overlay button {
  font-family: inherit;
}

.pa-box {
  position: relative;
  width: 100%;
  max-width: 420px;
  margin: auto;
  padding: 1.5rem 1.25rem;
  border-radius: 12px;
  background: #fff;
}

.pa-x {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  display: inline-flex;
  align-items: center;
  padding: 0.25rem;
  border: none;
  background: none;
  color: #6b7280;
  cursor: pointer;
}
.pa-x:hover {
  color: #374151;
}

.pa-judul {
  margin: 0 1.5rem 1rem;
  text-align: center;
  font-size: 1.125rem;
  font-weight: 700;
  color: #024baa;
}
.pa-sub {
  margin: -0.5rem 0 1.25rem;
  text-align: center;
  font-size: 0.8rem;
  font-weight: 600;
  color: #6b7280;
}

/* ----- tahap 1 dan 2: daftar pilihan ----- */
.pa-opsi-daftar {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}
.pa-opsi {
  width: 100%;
  padding: 0.8rem 1rem;
  border: 2px solid #024baa;
  border-radius: 8px;
  background: #fff;
  color: #024baa;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition:
    background 0.2s,
    color 0.2s;
}
.pa-opsi:hover {
  background: #024baa;
  color: #fff;
}

.pa-kembali {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  width: 100%;
  margin-top: 0.9rem;
  padding: 0.4rem;
  border: none;
  background: none;
  color: #6b7280;
  font-size: 0.875rem;
  cursor: pointer;
}
.pa-kembali:hover {
  color: #374151;
}

/* ----- tahap 3: formulir ----- */
.kolom {
  margin-bottom: 0.9rem;
}
.kolom-label {
  display: block;
  margin-bottom: 0.3rem;
  font-size: 0.78rem;
  font-weight: 700;
  color: #374151;
}
.kolom-input {
  width: 100%;
  padding: 0.6rem 0.7rem;
  border: 1.5px solid #d1d5db;
  border-radius: 8px;
  background: #fff;
  font-size: 1rem;
  color: #1f2937;
  outline: none;
}
.kolom-input:focus {
  border-color: #024baa;
}
textarea.kolom-input {
  resize: vertical;
}
.kolom.galat .kolom-input {
  border-color: #dc2626;
  background: #fef2f2;
}
.kolom-info {
  margin: 0.3rem 0 0;
  font-size: 0.74rem;
  color: #6b7280;
  line-height: 1.4;
}
.kolom-hitung {
  margin: 0.3rem 0 0;
  font-size: 0.76rem;
  font-weight: 700;
  color: #15803d;
}
.kolom-hitung.lewat {
  color: #b91c1c;
}
.kolom-galat {
  margin: 0.3rem 0 0;
  font-size: 0.78rem;
  font-weight: 600;
  color: #b91c1c;
}
.kolom-galat-mapel {
  padding: 0.5rem 0.65rem;
  border: 1px solid #fecaca;
  border-radius: 8px;
  background: #fef2f2;
}

.pa-ringkas {
  margin: 0.25rem 0 0.75rem;
  font-size: 0.8rem;
  font-weight: 700;
  text-align: center;
  color: #b91c1c;
}
.pa-kirim {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  width: 100%;
  padding: 0.8rem 1rem;
  border: none;
  border-radius: 8px;
  background: #024baa;
  color: #fff;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}
.pa-kirim:hover {
  background: #013a85;
}

/* ===== TABLET (>= 641px) ===== */
@media (min-width: 641px) {
  .pa-box {
    padding: 1.75rem;
  }
  .pa-box-form {
    max-width: 560px;
  }
}

/* ===== DESKTOP (>= 768px) ===== */
@media (min-width: 768px) {
  .pa-overlay {
    padding: 2rem 1rem;
  }
}
</style>