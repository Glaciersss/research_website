<template>
  <div id="app-wrapper">
    <Loader />
    <Navbar />
    <router-view />
    <Footer />
  </div>
</template>

<script setup>
import Navbar from '@/components/layout/Navbar.vue'
import Footer from '@/components/layout/Footer.vue'
import Loader from '@/components/layout/Loader.vue'
</script>

<style>
#app-wrapper {
  overflow-x: hidden;
}
</style>
