<template>
  <div class="breadcumb-area">
    <div class="container">
      <div class="row">
        <div class="col-lg-12">
          <div class="breacumb-content">
            <div class="breadcumb-title">
              <h1>{{ title }}</h1>
            </div>
            <div class="breadcumb-content-text">
              <router-link to="/">首页 <i class="fas fa-angle-right"></i><span>{{ title }}</span></router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true }
})
</script>
