<template>
  <div>
    <Breadcrumb title="学术成果" />

    <div class="portfolio-area">
      <div class="Section-title">
        <h2>学术成果</h2>
      </div>
      <div class="section-menu">
        <ul>
          <li :class="{ active: filterType === '' }" @click="filterType = ''">全部成果</li>
          <li :class="{ active: filterType === 'publication' }" @click="filterType = 'publication'">论文发表</li>
          <li :class="{ active: filterType === 'project' }" @click="filterType = 'project'">科研项目</li>
          <li :class="{ active: filterType === 'teaching' }" @click="filterType = 'teaching'">教学成果</li>
        </ul>
      </div>
      <div class="item-details">
        <div class="item" v-for="project in projects" :key="project.id">
          <div class="portfolio-thumb">
            <img :src="getProjectImage(project)" :alt="project.title" />
          </div>
          <div class="portfolio-content">
            <div class="wrapper">
              <div class="icons">
                <i class="far fa-file-image"></i>
                <i class="fas fa-link"></i>
              </div>
              <h3>
                <router-link :to="`/projects/${project.id}`">{{ project.title }}</router-link>
              </h3>
              <h6>{{ formatProjectType(project.type) }}</h6>
            </div>
          </div>
        </div>
      </div>

      <div class="row mt-4" v-if="totalPages > 1">
        <div class="col-lg-12">
          <div class="pagination">
            <ul class="list-unstyled d-flex justify-content-center">
              <li class="me-1" v-if="currentPage > 1">
                <a href="#" @click.prevent="goPage(currentPage - 1)">上一页</a>
              </li>
              <li v-for="p in totalPages" :key="p" class="me-1">
                <a href="#" @click.prevent="goPage(p)" :class="{ active: p === currentPage }">{{ p }}</a>
              </li>
              <li class="me-1" v-if="currentPage < totalPages">
                <a href="#" @click.prevent="goPage(currentPage + 1)">下一页</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import Breadcrumb from '@/components/common/Breadcrumb.vue'
import { projectsAPI } from '@/services/api'

const projects = ref([])
const filterType = ref('')
const currentPage = ref(1)
const totalPages = ref(1)
const pageSize = 9

function formatProjectType(type) {
  if (type === 'publication') return '论文发表'
  if (type === 'project') return '科研项目'
  if (type === 'teaching') return '教学成果'
  return type || '成果'
}

function getProjectImage(project) {
  if (!project) return ''
  const url = project.figure_url
  if (!url) return new URL('@/assets/images/1.jpg', import.meta.url).href
  try {
    const urls = JSON.parse(url)
    return Array.isArray(urls) && urls.length ? urls[0] : url
  } catch {
    return url
  }
}

async function fetchProjects(type, page) {
  try {
    const res = await projectsAPI.getList(type, page, pageSize)
    const data = res.data
    projects.value = data.projects || data.data || []
    totalPages.value = data.pages || data.total_pages || Math.ceil((data.total || projects.value.length) / pageSize) || 1
    currentPage.value = page
  } catch { /* ignore */ }
}

function goPage(page) {
  if (page < 1 || page > totalPages.value) return
  fetchProjects(filterType.value, page)
}

watch(filterType, () => fetchProjects(filterType.value, 1))

onMounted(() => fetchProjects('', 1))
</script>
