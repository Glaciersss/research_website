<template>
  <div class="loader-wrapper" ref="loaderRef">
    <div class="loader"></div>
    <div class="loder-section left-section"></div>
    <div class="loder-section right-section"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const loaderRef = ref(null)

onMounted(() => {
  setTimeout(() => {
    if (loaderRef.value) {
      loaderRef.value.classList.add('loaded')
    }
  }, 800)
})
</script>
