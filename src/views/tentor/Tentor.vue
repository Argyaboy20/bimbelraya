<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
const kodeTentor = route.params.id  // ambil dari URL, contoh: "1001"
</script>

<template>
  <div>Dashboard Tentor — Kode: {{ kodeTentor }}</div>
</template>