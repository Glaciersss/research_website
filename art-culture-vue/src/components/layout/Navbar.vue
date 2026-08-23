<template>
  <nav id="navbar_main" class="mobile-offcanvas navbar navbar-expand-lg navbar-dark">
    <div class="container">
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#main_nav"
        aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <router-link class="navbar-brand" to="/">
        <img src="@/assets/images/logo.png" alt="Logo" />
      </router-link>
      <div class="collapse navbar-collapse justify-content-end" id="main_nav">
        <ul class="navbar-nav">
          <li class="nav-item" :class="{ active: isHome }">
            <router-link class="nav-link" to="/" exact-active-class="active">首页</router-link>
          </li>
          <li class="nav-item" :class="{ active: isActive('/about') }">
            <router-link class="nav-link" to="/about" active-class="active">关于我们</router-link>
          </li>
          <li class="nav-item" :class="{ active: isActive('/research') }">
            <router-link class="nav-link" to="/research" active-class="active">研究方向</router-link>
          </li>
          <li class="nav-item" :class="{ active: isActive('/team') }">
            <router-link class="nav-link" to="/team" active-class="active">团队成员</router-link>
          </li>
          <li class="nav-item" :class="{ active: isActive('/projects') }">
            <router-link class="nav-link" to="/projects" active-class="active">学术成果</router-link>
          </li>
          <li class="nav-item" :class="{ active: isActive('/news') }">
            <router-link class="nav-link" to="/news" active-class="active">新闻动态</router-link>
          </li>
          <li class="nav-item" :class="{ active: isActive('/contact') }">
            <router-link class="nav-link" to="/contact" active-class="active">联系我们</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const isHome = computed(() => route.path === '/')

function isActive(path) {
  return route.path.startsWith(path)
}
</script>
