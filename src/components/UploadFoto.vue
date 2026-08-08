<!-- UploadFoto.vue -->
<template>
  <div class="upload-foto-wrap">
    <label class="upload-label">{{ label }}</label>
    <p v-if="description" class="upload-desc">{{ description }}</p>

    <div class="camera-box">
      <!-- ===== STATE: SUDAH ADA FOTO (preview hasil) ===== -->
      <img v-if="modelValue" :src="modelValue" alt="Hasil foto" class="preview-img" />

      <!-- ===== STATE: KAMERA LIVE ===== -->
      <template v-else>
        <video ref="videoEl" class="video-live" autoplay playsinline muted></video>

        <!-- Overlay status deteksi wajah -->
        <div class="face-status" :class="faceStatusClass">
          <span v-if="!cameraReady">📷 Meminta akses kamera...</span>
          <span v-else-if="loadingModel">🔎 Memuat deteksi wajah...</span>
          <span v-else-if="!detectionAvailable">
            ⚠️ Deteksi wajah tidak tersedia, foto tetap bisa diambil manual
          </span>
          <span v-else-if="faceCount < minFaces">
            👤 Terdeteksi {{ faceCount }} wajah — minimal {{ minFaces }} orang diperlukan
          </span>
          <span v-else> ✅ Terdeteksi {{ faceCount }} wajah — siap diambil </span>
        </div>

        <!-- Pesan error kamera (misal akses ditolak) -->
        <div v-if="cameraError" class="camera-error">❌ {{ cameraError }}</div>
      </template>

      <canvas ref="canvasEl" class="hidden-canvas"></canvas>
    </div>

    <!-- ===== TOMBOL AKSI ===== -->
    <button
      v-if="!modelValue"
      type="button"
      class="btn-shutter"
      :disabled="!canCapture"
      @click="ambilFoto"
    >
      📸 Ambil Foto
    </button>
    <button v-else type="button" class="btn-retake" @click="ambilUlang">🔄 Ambil Ulang Foto</button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  label: { type: String, default: 'Upload Foto' },
  description: { type: String, default: '' },
  modelValue: { type: String, default: '' },
  // Minimal jumlah wajah yang harus terdeteksi sebelum tombol capture aktif.
  // Set 1 (default) kalau tidak butuh syarat jumlah orang.
  minFaces: { type: Number, default: 1 },
  cameraFacing: { type: String, default: 'user' },
})

const emit = defineEmits(['update:modelValue'])

const videoEl = ref(null)
const canvasEl = ref(null)
let mediaStream = null

const cameraReady = ref(false)
const cameraError = ref('')

// ===== FACE DETECTION STATE =====
const loadingModel = ref(true)
const detectionAvailable = ref(false)
const faceCount = ref(0)
let detectInterval = null
let faceapi = null

const faceStatusClass = computed(() => {
  if (!cameraReady.value || loadingModel.value) return 'status-info'
  if (!detectionAvailable.value) return 'status-warning'
  return faceCount.value >= props.minFaces ? 'status-ok' : 'status-warning'
})

// Tombol capture aktif kalau: kamera siap, DAN (deteksi tidak tersedia [fallback manual]
// ATAU jumlah wajah sudah cukup)
const canCapture = computed(() => {
  if (!cameraReady.value) return false
  if (!detectionAvailable.value) return true // fallback: izinkan capture manual
  return faceCount.value >= props.minFaces
})

// ===== BUKA KAMERA =====
const startCamera = async () => {
  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: props.cameraFacing },
    })
    if (videoEl.value) {
      videoEl.value.srcObject = mediaStream
      cameraReady.value = true
    }
  } catch {
    cameraError.value = 'Akses kamera ditolak atau tidak tersedia di perangkat ini.'
    cameraReady.value = false
  }
}

const stopCamera = () => {
  if (mediaStream) {
    mediaStream.getTracks().forEach((track) => track.stop())
    mediaStream = null
  }
  if (detectInterval) {
    clearInterval(detectInterval)
    detectInterval = null
  }
}

// ============================================
// LOAD MODEL DETEKSI WAJAH (face-api.js dari CDN)
// Best-effort: kalau gagal load (offline / CDN diblokir), fitur
// capture tetap bisa dipakai secara manual tanpa validasi jumlah wajah.
// ============================================
const loadFaceDetection = async () => {
  try {
    faceapi = await import(
      /* @vite-ignore */ 'https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/+esm'
    )
    const MODEL_URL =
      'https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/tiny_face_detector'
    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL)

    detectionAvailable.value = true
    loadingModel.value = false

    // Deteksi berulang tiap 700ms selama kamera masih live
    detectInterval = setInterval(async () => {
      if (!videoEl.value || props.modelValue) return
      const detections = await faceapi.detectAllFaces(
        videoEl.value,
        new faceapi.TinyFaceDetectorOptions(),
      )
      faceCount.value = detections.length
    }, 700)
  } catch {
    // Model gagal dimuat (offline/CDN bermasalah) → fallback manual
    detectionAvailable.value = false
    loadingModel.value = false
  }
}

// ===== AMBIL FOTO (capture frame video ke canvas) =====
const ambilFoto = () => {
  const video = videoEl.value
  const canvas = canvasEl.value
  if (!video || !canvas) return

  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
  const ctx = canvas.getContext('2d')
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

  const dataUrl = canvas.toDataURL('image/jpeg', 0.9)
  emit('update:modelValue', dataUrl)

  stopCamera()
}

const ambilUlang = () => {
  emit('update:modelValue', '')
  faceCount.value = 0
  cameraReady.value = false
  startCamera()
  if (detectionAvailable.value) {
    detectInterval = setInterval(async () => {
      if (!videoEl.value || props.modelValue) return
      const detections = await faceapi.detectAllFaces(
        videoEl.value,
        new faceapi.TinyFaceDetectorOptions(),
      )
      faceCount.value = detections.length
    }, 700)
  }
}

onMounted(async () => {
  await startCamera()
  await loadFaceDetection()
})

onUnmounted(() => {
  stopCamera()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

* {
  font-family: 'DM Sans', sans-serif;
  box-sizing: border-box;
}

.upload-foto-wrap {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}

.upload-label {
  font-size: 0.82rem;
  font-weight: 700;
  color: #374151;
}
.upload-desc {
  font-size: 0.72rem;
  color: #6b7280;
  margin: -0.3rem 0 0;
  line-height: 1.4;
}

/* ===== KOTAK KAMERA ===== */
.camera-box {
  position: relative;
  width: 100%;
  height: 260px;
  border-radius: 16px;
  overflow: hidden;
  background: #000;
  border: 2px solid #2e87f6;
}

.video-live,
.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
/* Efek cermin supaya selfie terasa natural */
.video-live {
  transform: scaleX(-1);
}

.hidden-canvas {
  display: none;
}

/* ===== OVERLAY STATUS DETEKSI ===== */
.face-status {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0.6rem 0.75rem;
  font-size: 0.74rem;
  font-weight: 600;
  text-align: center;
  color: #fff;
  backdrop-filter: blur(4px);
}
.status-info {
  background: rgba(46, 135, 246, 0.75);
}
.status-warning {
  background: rgba(243, 92, 43, 0.8);
}
.status-ok {
  background: rgba(22, 163, 74, 0.82);
}

.camera-error {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 0.6rem 0.75rem;
  font-size: 0.74rem;
  font-weight: 600;
  text-align: center;
  color: #fff;
  background: rgba(185, 28, 28, 0.85);
}

/* ===== TOMBOL ===== */
.btn-shutter {
  width: 100%;
  padding: 0.75rem;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #2e87f6, #1d6fd4);
  color: #fff;
  font-weight: 700;
  font-size: 0.88rem;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(46, 135, 246, 0.3);
  transition:
    transform 0.2s,
    opacity 0.2s;
}
.btn-shutter:hover:not(:disabled) {
  transform: translateY(-2px);
}
.btn-shutter:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  box-shadow: none;
}

.btn-retake {
  align-self: flex-start;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  border: 1.5px solid #2e87f6;
  background: #fff;
  color: #2e87f6;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  transition:
    background 0.2s,
    color 0.2s;
}
.btn-retake:hover {
  background: #2e87f6;
  color: #fff;
}

/* =====================================================
   BREAKPOINTS
   @media 641px  : tablet
   @media 768px  : desktop
   @media 1024px : large desktop
   ===================================================== */

@media (min-width: 641px) {
  .camera-box {
    height: 300px;
  }
  .face-status,
  .camera-error {
    font-size: 0.78rem;
  }
  .btn-shutter {
    font-size: 0.9rem;
    padding: 0.8rem;
  }
}

@media (min-width: 768px) {
  .camera-box {
    height: 320px;
  }
}

@media (min-width: 1024px) {
  .camera-box {
    height: 340px;
    border-radius: 18px;
  }
}
</style>
