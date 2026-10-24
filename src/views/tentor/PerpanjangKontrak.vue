<!-- PerpanjangKontrak.vue -->
<template>
  <div class="kontrak-page">
    <!-- ===== HEADER ===== -->
    <div class="kontrak-header">
      <router-link :to="`/tentor/dashboardtentor/${kodeTentor}`" class="back-link">
        ‹ Kembali
      </router-link>
      <h1 class="header-title">Perpanjang Kontrak</h1>
      <p class="header-sub">Pantau dan ajukan perpanjangan masa kontrak mengajarmu</p>
    </div>

    <div class="kontrak-content">
      <!-- ===== STATE: MEMUAT ===== -->
      <div v-if="memuat" class="empty-card">
        <p class="empty-text">Memuat data kontrak...</p>
      </div>

      <!-- ===== STATE: DATA TENTOR TIDAK DITEMUKAN ===== -->
      <div v-else-if="!dataTentor" class="empty-card">
        <div class="empty-icon"><TriangleAlert size="1em" /></div>
        <p class="empty-text">Data kontrak kamu belum tersedia</p>
        <p class="empty-sub">
          Kamu belum terdaftar di data tentor admin, atau kontrak sudah tidak aktif. Hubungi admin
          Bimbel Raya.
        </p>
      </div>

      <template v-else>
        <!-- ===== SECTION: KONTRAK BIMBEL RAYA (readonly) ===== -->
        <section class="kontrak-section">
          <h2 class="section-title">Kontrak Bimbel Raya</h2>
          <div class="kontrak-card">
            <p class="kontrak-label">Kontrak berlaku hingga</p>
            <p class="kontrak-tanggal">{{ formattedKontrakSekarang }}</p>
            <div class="countdown-box" :class="countdownClass">
              {{ countdownText }}
            </div>
          </div>
        </section>

        <!-- ===== SECTION: SURAT KONTRAK TENTOR ===== -->
        <section class="kontrak-section">
          <h2 class="section-title">Surat Kontrak Tentor</h2>
          <p class="section-desc">
            Baca seluruh pasal di bawah ini. Kamu perlu menyetujuinya sebelum bisa mengajukan
            kontrak baru.
          </p>

          <div class="surat-card">
            <h3 class="surat-judul">SURAT KONTRAK KERJA TENTOR</h3>

            <SuratTerlindungi :nama="tentorStore.profil?.nama ?? ''" :kode="kodeTentor">
              <div class="surat-isi" tabindex="0" aria-label="Isi Surat Kontrak Tentor">
                <article v-for="(pasal, i) in SURAT_KONTRAK" :key="i" class="pasal">
                  <h4 class="pasal-nomor">PASAL {{ pasal.nomor }}</h4>
                  <p class="pasal-judul">{{ pasal.judul }}</p>

                  <template v-for="(blok, j) in pasal.blok" :key="j">
                    <p
                      v-if="blok.tipe === 'paragraf'"
                      class="pasal-paragraf"
                      v-html="formatTeks(blok.teks)"
                    ></p>

                    <div v-else-if="blok.tipe === 'ayat'" class="ayat">
                      <span class="ayat-no">{{ blok.no }}.</span>
                      <div class="ayat-isi">
                        <p class="pasal-paragraf" v-html="formatTeks(blok.teks)"></p>
                        <div v-for="s in blok.sub" :key="s.huruf" class="sub">
                          <span class="sub-huruf">{{ s.huruf }}.</span>
                          <p class="pasal-paragraf" v-html="formatTeks(s.teks)"></p>
                        </div>
                      </div>
                    </div>

                    <div v-else-if="blok.tipe === 'daftar'" class="daftar">
                      <div v-for="s in blok.sub" :key="s.huruf" class="sub">
                        <span class="sub-huruf">{{ s.huruf }}.</span>
                        <p class="pasal-paragraf" v-html="formatTeks(s.teks)"></p>
                      </div>
                    </div>
                  </template>
                </article>
              </div>
            </SuratTerlindungi>
            <label class="setuju-baris" :class="{ 'is-terkunci': suratDisetujui || terkunciMenunggu }">
              <input
                type="checkbox"
                class="setuju-kotak"
                v-model="centangSurat"
                :disabled="suratDisetujui || sedangMenyetujui || terkunciMenunggu"
              />
              <span class="setuju-teks">
                Saya menyetujui segala peraturan dan ketentuan yang berlaku
              </span>
            </label>
            <p class="setuju-catatan" :class="{ 'is-ok': suratDisetujui }">{{ catatanSurat }}</p>
          </div>
        </section>

        <!-- ===== SECTION: AJUKAN KONTRAK BARU ===== -->
        <section class="kontrak-section">
          <h2 class="section-title">Ajukan Kontrak Baru</h2>
          <p class="section-desc">
            Pilih tanggal kontrak baru. Minimal 1 bulan dan maksimal 3 bulan terhitung dari hari
            ini. Boleh lebih pendek dari kontrak sekarang.
          </p>

          <p v-if="terkunciMenunggu" class="kunci-info">
            <Lock size="1.15em" class="ikon-inline" /> Perpanjangan kontrak baru dibuka mulai
            {{ bukaPerpanjang }}, yaitu 3 hari sebelum kontrak berakhir.
          </p>
          <p v-else-if="!suratDisetujui" class="kunci-info">
            <Lock size="1.15em" class="ikon-inline" /> Centang persetujuan Surat Kontrak Tentor di atas untuk membuka form ini.
          </p>
          
          <form class="ajukan-form" @submit.prevent="requestSubmit">
            <div class="field-group">
              <label class="field-label">Tanggal Kontrak Baru</label>
              <input
                type="date"
                class="field-input"
                :class="{ 'is-error': touched && tanggalError }"
                v-model="form.tanggalBaru"
                :min="minTanggal"
                :max="maxTanggal"
                @change="touched = true"
                :disabled="!formTerbuka"
              />
              <p v-if="touched && tanggalError" class="field-alert">{{ tanggalError }}</p>
              <p class="field-hint">
                Rentang yang diperbolehkan: {{ formattedMin }} — {{ formattedMax }}
              </p>
            </div>
            <button type="submit" class="btn-submit" :disabled="!formTerbuka || !isFormValid">
              Ajukan Kontrak
            </button>
          </form>
        </section>
      </template>
    </div>

    <!-- ===== MODAL KONFIRMASI ===== -->
    <div v-if="showConfirmModal" class="modal-overlay" @click.self="showConfirmModal = false">
      <div class="modal-box">
        <p class="modal-title">Sudah benar mau ajukan kontrak baru?</p>
        <p class="modal-sub">Kontrak akan diperbarui hingga {{ formattedTanggalBaru }}.</p>
        <div class="modal-btn-row">
          <button class="modal-btn btn-belum" @click="showConfirmModal = false">Belum</button>
          <button class="modal-btn btn-sudah" :disabled="isSaving" @click="submitKontrak">Sudah</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useTentorStore } from '@/stores/tentor'
import { ApiError } from '@/api/http'
import { SURAT_KONTRAK, formatTeks } from '@/data/suratKontrak'
import { TriangleAlert, Lock } from 'lucide-vue-next'
import SuratTerlindungi from '@/components/SuratTerlindungi.vue'

defineOptions({ name: 'PerpanjangKontrak' })

const route = useRoute()
const tentorStore = useTentorStore()
const kodeTentor = route.params.id

// ===== HELPER TANGGAL (zona waktu Jakarta, sama seperti server) =====
const hariIniJakarta = () =>
  new Date(`${new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta' }).format(new Date())}T00:00:00Z`)

const tanggalPlusBulan = (n) => {
  const d = hariIniJakarta()
  d.setUTCMonth(d.getUTCMonth() + n)
  return d.toISOString().slice(0, 10)
}

const formatTanggal = (key) => {
  if (!key) return '-'
  return new Date(key + 'T00:00:00').toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

// ===== DATA KONTRAK dari server =====
const memuat = ref(true)

onMounted(async () => {
  try {
    await tentorStore.fetchProfil()
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) return // sesi habis atau akun sudah dihapus, sudah dialihkan ke login
    alert(err instanceof ApiError ? err.message : 'Gagal memuat data kontrak. Coba muat ulang halaman.')
  } finally {
    memuat.value = false
  }
})

// Profil dipakai hanya kalau milik kode di alamat ini
const dataTentor = computed(() => {
  const p = tentorStore.profil
  return p && p.kodeTentor === kodeTentor && p.habisKontrak ? p : null
})
const kontrak = computed(() => dataTentor.value?.kontrak ?? null)

const formattedKontrakSekarang = computed(() =>
  dataTentor.value ? formatTanggal(dataTentor.value.habisKontrak) : '-',
)

// ===== COUNTDOWN (dihitung server, termasuk masa tenggang) =====
const countdownText = computed(() => {
  const k = kontrak.value
  if (!k) return '-'
  if (k.status === 'tenggang') {
    return k.sisaHari <= 1
      ? 'Masa kontrak sudah habis. Hari ini hari terakhir sebelum akun dihapus otomatis'
      : `Masa kontrak sudah habis. Akun dihapus otomatis dalam ${k.sisaHari} hari jika tidak diperpanjang`
  }
  if (k.sisaHari === 0) return 'Hari ini masa kontrak habis pukul 23.59'
  return `${k.sisaHari} hari lagi masa kontrak habis`
})

const countdownClass = computed(() => {
  const k = kontrak.value
  if (!k) return ''
  if (k.status === 'tenggang' || k.sisaHari <= 0) return 'text-danger'
  if (k.sisaHari <= 5) return 'text-warning'
  return 'text-safe'
})

// ===== SURAT KONTRAK TENTOR (persetujuan dicatat di server) =====
const persetujuan = computed(
  () => dataTentor.value?.persetujuan ?? { disetujui: false, pada: null },
)
const suratDisetujui = computed(() => persetujuan.value.disetujui)
const sedangMenyetujui = ref(false)
// Aturan server: perpanjangan baru dibuka saat sisa kontrak ≤ 3 hari (atau masa tenggang)
const terkunciMenunggu = computed(
  () => kontrak.value?.status === 'aktif' && kontrak.value?.bisaPerpanjang === false,
)
const bukaPerpanjang = computed(() => formatTanggal(kontrak.value?.bukaPerpanjangPada))
const formTerbuka = computed(() => suratDisetujui.value && !terkunciMenunggu.value)

// Kotak centang: hanya bisa dicentang saat belum menyetujui. Begitu dicentang langsung dicatat
// di server dan terkunci selama persetujuan masih berlaku (kontrak masih berjalan).
const centangSurat = computed({
  get: () => suratDisetujui.value || sedangMenyetujui.value,
  set: async (nilai) => {
    if (!nilai || suratDisetujui.value || sedangMenyetujui.value || terkunciMenunggu.value) return
    sedangMenyetujui.value = true
    try {
      await tentorStore.setujuSurat()
    } catch (err) {
      if (!(err instanceof ApiError && err.status === 401)) {
        alert(err instanceof ApiError ? err.message : 'Gagal menyimpan persetujuan. Coba lagi.')
      }
    } finally {
      sedangMenyetujui.value = false
    }
  },
})

const waktuSetuju = computed(() => {
  const pada = persetujuan.value.pada
  if (!pada || !suratDisetujui.value) return ''
  return new Date(pada).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta',
  })
})

const catatanSurat = computed(() => {
  if (terkunciMenunggu.value) {
    return `Persetujuan dan perpanjangan kontrak baru dibuka mulai ${bukaPerpanjang.value}, yaitu 3 hari sebelum kontrak berakhir.`
  }
  if (suratDisetujui.value) {
    return `Kamu sudah menyetujui surat ini pada ${waktuSetuju.value}. Persetujuan terkunci selama kontrak masih berjalan, dan bisa dicentang lagi setelah kontrak berakhir.`
  }
  if (kontrak.value?.status === 'tenggang') {
    return 'Kontrak kamu sudah berakhir. Centang persetujuan ini lagi untuk bisa mengajukan kontrak baru.'
  }
  return 'Centang persetujuan ini untuk bisa mengajukan kontrak baru.'
})

// ===== FORM AJUKAN KONTRAK BARU =====
const form = reactive({ tanggalBaru: '' })
const touched = ref(false)

// Rentang: hari ini + 1 bulan sampai hari ini + 3 bulan. Server tetap penentu akhir.
const minTanggal = computed(() => tanggalPlusBulan(1))
const maxTanggal = computed(() => tanggalPlusBulan(3))
const formattedMin = computed(() => formatTanggal(minTanggal.value))
const formattedMax = computed(() => formatTanggal(maxTanggal.value))
const formattedTanggalBaru = computed(() => formatTanggal(form.tanggalBaru))

const tanggalError = computed(() => {
  if (!form.tanggalBaru) return 'Tanggal kontrak baru wajib diisi'
  if (form.tanggalBaru < minTanggal.value) return 'Minimal perpanjangan 1 bulan dari hari ini'
  if (form.tanggalBaru > maxTanggal.value) return 'Maksimal perpanjangan 3 bulan dari hari ini'
  return ''
})

const isFormValid = computed(() => !tanggalError.value)

// ===== SUBMIT =====
const showConfirmModal = ref(false)
const isSaving = ref(false)

const requestSubmit = () => {
  if (!formTerbuka.value) return // form terkunci sampai waktunya dan Surat Kontrak disetujui
  touched.value = true
  if (!isFormValid.value) return
  showConfirmModal.value = true
}

const submitKontrak = async () => {
  if (isSaving.value) return
  isSaving.value = true
  try {
    await tentorStore.perpanjangKontrak(form.tanggalBaru)
    form.tanggalBaru = ''
    touched.value = false
    showConfirmModal.value = false
  } catch (err) {
    showConfirmModal.value = false
    if (err instanceof ApiError && err.status === 401) return
    let pesan = err instanceof ApiError ? err.message : 'Gagal mengajukan kontrak. Coba lagi.'
    if (err instanceof ApiError && err.data?.min) {
      pesan += ` (${formatTanggal(err.data.min)} sampai ${formatTanggal(err.data.max)})`
    }
    alert(pesan)
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

* {
  font-family: 'DM Sans', sans-serif;
  box-sizing: border-box;
}

.kontrak-page {
  width: 100%;
  min-height: 100vh;
  background-color: #fdfaf3;
  background-image:
    radial-gradient(circle at 12% 18%, rgba(46, 135, 246, 0.14) 0%, transparent 42%),
    radial-gradient(circle at 88% 12%, rgba(243, 92, 43, 0.12) 0%, transparent 40%),
    radial-gradient(circle at 50% 92%, rgba(249, 236, 204, 0.5) 0%, transparent 58%);
}

/* ===== HEADER ===== */
.kontrak-header {
  padding: 1.25rem 1rem 0.5rem;
  max-width: 640px;
  margin: 0 auto;
}
.back-link {
  display: inline-block;
  font-size: 0.8rem;
  font-weight: 600;
  color: #2e87f6;
  text-decoration: none;
  margin-bottom: 0.5rem;
}
.back-link:hover {
  text-decoration: underline;
}
.header-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.15rem;
}
.header-sub {
  font-size: 0.78rem;
  color: #6b7280;
  margin: 0;
}

/* ===== CONTENT ===== */
.kontrak-content {
  max-width: 640px;
  margin: 0 auto;
  padding: 1rem 1rem 3rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* ===== EMPTY STATE ===== */
.empty-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  padding: 2.5rem 1.5rem;
  text-align: center;
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.06);
}
.empty-icon {
  font-size: 2.5rem;
  margin-bottom: 0.75rem;
  display: flex;
  justify-content: center;
  color: #9ca3af;
}
.empty-text {
  font-size: 1rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.4rem;
}
.empty-sub {
  font-size: 0.82rem;
  color: #6b7280;
  line-height: 1.5;
  margin: 0;
}

/* ===== SECTION ===== */
.kontrak-section {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}
.section-title {
  font-size: 1rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}
.section-desc {
  font-size: 0.78rem;
  color: #6b7280;
  margin: -0.3rem 0 0;
  line-height: 1.5;
}

/* ===== KONTRAK CARD (readonly) ===== */
.kontrak-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(6px);
  border-radius: 18px;
  padding: 1.25rem;
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.06);
  text-align: center;
}
.kontrak-label {
  font-size: 0.76rem;
  color: #6b7280;
  margin: 0 0 0.3rem;
}
.kontrak-tanggal {
  font-size: 1.3rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.85rem;
}
.countdown-box {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  font-size: 0.82rem;
  font-weight: 700;
}
.text-safe {
  background: #dcfce7;
  color: #15803d;
}
.text-warning {
  background: #fef9c3;
  color: #a16207;
}
.text-danger {
  background: #fee2e2;
  color: #b91c1c;
}

/* ===== FORM AJUKAN ===== */
.ajukan-form {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(6px);
  border-radius: 18px;
  padding: 1.25rem;
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.06);
}
.field-group {
  display: flex;
  flex-direction: column;
}
.field-label {
  font-size: 0.82rem;
  font-weight: 700;
  color: #374151;
  margin-bottom: 0.4rem;
}
.field-input {
  width: 100%;
  padding: 0.65rem 0.9rem;
  border-radius: 10px;
  border: 1.5px solid #e5e7eb;
  font-size: 0.86rem;
  outline: none;
  font-family: inherit;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}
.field-input:focus {
  border-color: #2e87f6;
  box-shadow: 0 0 0 3px rgba(46, 135, 246, 0.12);
}
.field-input.is-error {
  border-color: #f35c2b;
}
.field-alert {
  font-size: 0.74rem;
  color: #f35c2b;
  margin: 0.35rem 0 0;
}
.field-hint {
  font-size: 0.7rem;
  color: #9ca3af;
  margin: 0.35rem 0 0;
}

.btn-submit {
  width: 100%;
  padding: 0.85rem;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #2e87f6 0%, #1d6fd4 100%);
  color: #fff;
  font-weight: 700;
  font-size: 0.92rem;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(46, 135, 246, 0.3);
  transition:
    transform 0.2s,
    box-shadow 0.2s,
    opacity 0.2s;
}
.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
}
.btn-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
}

/* ===== MODAL ===== */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(3px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}
.modal-box {
  background: #fff;
  border-radius: 18px;
  padding: 1.75rem 1.5rem;
  width: 100%;
  max-width: 320px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.18);
}
.modal-title {
  font-size: 1rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.4rem;
}
.modal-sub {
  font-size: 0.8rem;
  color: #6b7280;
  margin: 0 0 1.25rem;
  line-height: 1.5;
}
.modal-btn-row {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.25rem;
}
.modal-btn {
  flex: 1;
  padding: 0.65rem;
  border-radius: 10px;
  border: none;
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.15s;
}
.modal-btn:hover {
  transform: translateY(-1px);
}
.btn-belum {
  background: #f3f4f6;
  color: #374151;
}
.btn-sudah {
  background: #2e87f6;
  color: #fff;
  box-shadow: 0 4px 12px rgba(46, 135, 246, 0.3);
}

/* ===== SURAT KONTRAK TENTOR ===== */
.surat-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(6px);
  border-radius: 18px;
  padding: 1.1rem;
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.06);
}
.surat-judul {
  text-align: center;
  font-size: 0.88rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #1f2937;
  margin: 0 0 0.75rem;
}
.surat-isi {
  max-height: 360px;
  overflow-y: auto;
  padding: 0.9rem 1rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 12px;
  background: #fff;
  scrollbar-width: thin;
}
.surat-isi:focus-visible {
  outline: none;
  border-color: #2e87f6;
  box-shadow: 0 0 0 3px rgba(46, 135, 246, 0.12);
}
.pasal + .pasal {
  margin-top: 1.1rem;
}
.pasal-nomor {
  text-align: center;
  font-size: 0.82rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}
.pasal-judul {
  text-align: center;
  font-size: 0.78rem;
  font-weight: 700;
  color: #374151;
  margin: 0.1rem 0 0.55rem;
}
.pasal-paragraf {
  font-size: 0.8rem;
  line-height: 1.6;
  color: #374151;
  margin: 0 0 0.4rem;
  text-align: justify;
}
.ayat,
.sub {
  display: flex;
  gap: 0.45rem;
}
.ayat-no,
.sub-huruf {
  flex-shrink: 0;
  width: 1.1rem;
  font-size: 0.8rem;
  line-height: 1.6;
  color: #374151;
}
.ayat-isi {
  flex: 1;
  min-width: 0;
}
.sub .pasal-paragraf {
  flex: 1;
  margin-bottom: 0.3rem;
}
.daftar .sub {
  margin-left: 0.5rem;
}

.setuju-baris {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  margin-top: 0.9rem;
  padding: 0.75rem 0.85rem;
  border-radius: 12px;
  background: #f9fafb;
  border: 1.5px solid #e5e7eb;
  cursor: pointer;
  transition:
    border-color 0.2s,
    background 0.2s;
}
.setuju-baris:hover:not(.is-terkunci) {
  border-color: #2e87f6;
}
.setuju-baris.is-terkunci {
  background: #f0fdf4;
  border-color: #bbf7d0;
  cursor: not-allowed;
}
.setuju-kotak {
  width: 18px;
  height: 18px;
  margin-top: 0.1rem;
  flex-shrink: 0;
  accent-color: #2e87f6;
  cursor: inherit;
}
.setuju-teks {
  font-size: 0.82rem;
  font-weight: 600;
  color: #1f2937;
  line-height: 1.45;
}
.setuju-catatan {
  font-size: 0.72rem;
  color: #6b7280;
  margin: 0.5rem 0 0;
  line-height: 1.5;
}
.setuju-catatan.is-ok {
  color: #15803d;
}

.kunci-info {
  font-size: 0.76rem;
  color: #92400e;
  background: #fef3c7;
  border-radius: 10px;
  padding: 0.55rem 0.8rem;
  margin: 0;
  line-height: 1.5;
}
.ajukan-form.is-terkunci {
  opacity: 0.6;
}
.field-input:disabled {
  background: #f3f4f6;
  cursor: not-allowed;
}

.ikon-inline {
  display: inline-block;
  vertical-align: -0.18em;
  margin-right: 0.2rem;
}

/* =====================================================
   BREAKPOINTS
   @media 641px  : tablet
   @media 768px  : desktop
   @media 1024px : large desktop
   ===================================================== */

@media (min-width: 641px) {
  .kontrak-header {
    padding: 1.5rem 1.25rem 0.6rem;
  }
  .header-title {
    font-size: 1.25rem;
  }
  .kontrak-content {
    padding: 1.1rem 1.25rem 3.5rem;
    gap: 1.75rem;
  }
  .kontrak-card,
  .ajukan-form {
    padding: 1.5rem;
    border-radius: 20px;
  }
  .kontrak-tanggal {
    font-size: 1.5rem;
  }
  .field-input {
    font-size: 0.9rem;
  }
  .btn-submit {
    font-size: 0.95rem;
    padding: 0.9rem;
  }
}

@media (min-width: 768px) {
  .kontrak-header,
  .kontrak-content {
    max-width: 720px;
  }
  .header-title {
    font-size: 1.35rem;
  }
  .kontrak-card,
  .ajukan-form {
    padding: 1.75rem 2rem;
  }
}

@media (min-width: 1024px) {
  .kontrak-header,
  .kontrak-content {
    max-width: 780px;
  }
  .kontrak-card,
  .ajukan-form {
    padding: 2rem 2.25rem;
  }
}
</style>
