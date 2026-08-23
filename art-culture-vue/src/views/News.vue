<template>
  <div>
    <Breadcrumb title="新闻动态" />

    <div class="blog-area">
      <div class="container">
        <div class="row">
          <div class="col-lg-8">
            <div class="row">
              <div class="col-lg-6 col-md-6" v-for="item in newsList" :key="item.id">
                <div class="blog-single-box">
                  <div class="blog-tumb">
                    <img :src="getNewsImage(item)" :alt="item.title" />
                  </div>
                  <div class="button-1">
                    <a href="#">{{ item.type || '动态' }}</a>
                    <span>{{ formatDate(item.date || item.created_at) }}</span>
                  </div>
                  <div class="blog-content">
                    <div class="blog-title">
                      <h3>
                        <router-link :to="`/news/${item.id}`">{{ item.title }}</router-link>
                      </h3>
                      <p>{{ truncateText(item.content, 60) }}</p>
                    </div>
                    <div class="blog-button">
                      <router-link :to="`/news/${item.id}`">阅读更多</router-link>
                    </div>
                    <div class="blog-icon">
                      <i class="fas fa-arrow-right"></i>
                    </div>
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

          <!-- Sidebar -->
          <div class="col-lg-4">
            <div class="sideber-box">
              <div class="sideber-title">
                <h3>通知公告</h3>
              </div>
              <div class="catagories-body" v-if="notices.length">
                <ul>
                  <li v-for="notice in notices" :key="notice.id">
                    <a :href="notice.link || '#'"><span><i class="fas fa-volume-up me-2"></i>{{ notice.title }}</span></a>
                  </li>
                </ul>
              </div>
              <p v-else style="color:#626262;">暂无通知</p>
            </div>

            <div class="sideber-box">
              <div class="sideber-title">
                <h3>学术活动</h3>
              </div>
              <div class="catagories-body" v-if="events.length">
                <ul>
                  <li v-for="event in events" :key="event.id">
                    <a href="#"><span><i class="fas fa-calendar-alt me-2"></i>{{ event.title }}</span></a>
                    <small style="color:#999;">{{ formatDate(event.date) }} {{ event.location || '' }}</small>
                  </li>
                </ul>
              </div>
              <p v-else style="color:#626262;">暂无活动</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Breadcrumb from '@/components/common/Breadcrumb.vue'
import { newsAPI, noticesAPI, eventsAPI } from '@/services/api'

const newsList = ref([])
const notices = ref([])
const events = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const pageSize = 6

function getNewsImage(item) {
  if (!item) return ''
  const url = item.image_url
  if (!url) return new URL('@/assets/images/1-.jpg', import.meta.url).href
  try {
    const urls = JSON.parse(url)
    return Array.isArray(urls) && urls.length ? urls[0] : url
  } catch {
    return url
  }
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
}

function truncateText(text, maxLen) {
  if (!text) return ''
  const plain = text.replace(/<[^>]+>/g, '')
  return plain.length > maxLen ? plain.slice(0, maxLen) + '...' : plain
}

async function fetchNews(page) {
  try {
    const res = await newsAPI.getList(page, pageSize)
    const data = res.data
    newsList.value = data.news || data.data || []
    totalPages.value = data.pages || data.total_pages || Math.ceil((data.total || newsList.value.length) / pageSize) || 1
    currentPage.value = page
  } catch { /* ignore */ }
}

function goPage(page) {
  if (page < 1 || page > totalPages.value) return
  fetchNews(page)
}

onMounted(async () => {
  await fetchNews(1)
  try {
    const [nRes, eRes] = await Promise.all([
      noticesAPI.getList(),
      eventsAPI.getList()
    ])
    notices.value = (nRes.data?.notices || nRes.data?.data || nRes.data || []).slice(0, 5)
    events.value = (eRes.data?.events || eRes.data?.data || eRes.data || []).slice(0, 5)
  } catch { /* ignore */ }
})
</script>
