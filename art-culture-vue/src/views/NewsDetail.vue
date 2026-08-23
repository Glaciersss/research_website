<template>
  <div>
    <Breadcrumb :title="news.title || '新闻详情'" />

    <div class="blog-area">
      <div class="container">
        <div class="row">
          <div class="col-lg-8">
            <div v-if="news.id">
              <div class="blog-single-box p-4">
                <div class="blog-tumb mb-4">
                  <img :src="getNewsImage(news)" :alt="news.title" style="width:100%;max-height:450px;object-fit:cover;" />
                </div>
                <div class="button-1 mb-3">
                  <a href="#">{{ news.type || '动态' }}</a>
                  <span>{{ formatDate(news.date || news.created_at) }}</span>
                </div>
                <h2 style="color:#303030;margin-bottom:20px;">{{ news.title }}</h2>
                <div style="color:#626262;font-size:14px;letter-spacing:1px;line-height:2;" v-html="news.content"></div>

                <div class="mt-4" v-if="relatedMembers.length">
                  <h5 style="color:#303030;">相关成员</h5>
                  <div class="row mt-2">
                    <div class="col-md-4" v-for="m in relatedMembers" :key="m.id">
                      <router-link :to="`/team/${m.id}`" style="text-decoration:none;">
                        <div class="d-flex align-items-center p-2" style="border:1px solid #ebebeb;border-radius:3px;">
                          <img :src="getAvatar(m)" :alt="m.name" style="width:50px;height:50px;border-radius:50%;object-fit:cover;" />
                          <div class="ms-2">
                            <strong style="color:#303030;">{{ m.name }}</strong>
                            <br /><small style="color:#626262;">{{ m.role }}</small>
                          </div>
                        </div>
                      </router-link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-5">
              <p style="color:#626262;">加载中...</p>
            </div>
          </div>

          <div class="col-lg-4">
            <div class="sideber-box">
              <div class="sideber-title">
                <h3>最新动态</h3>
              </div>
              <div class="catagories-body">
                <ul>
                  <li v-for="item in recentNews" :key="item.id">
                    <router-link :to="`/news/${item.id}`">
                      <span>{{ item.title }}</span>
                    </router-link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Breadcrumb from '@/components/common/Breadcrumb.vue'
import { newsAPI, teamAPI } from '@/services/api'

const route = useRoute()
const news = ref({})
const recentNews = ref([])
const relatedMembers = ref([])

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

function getAvatar(m) {
  return m.avatar || new URL('@/assets/images/0.jpg', import.meta.url).href
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
}

onMounted(async () => {
  const id = route.params.id
  try {
    const [detailRes, listRes] = await Promise.all([
      newsAPI.getById(id),
      newsAPI.getList(1, 5)
    ])
    news.value = detailRes.data?.news || detailRes.data || {}

    const allRecent = listRes.data?.news || listRes.data?.data || []
    recentNews.value = allRecent.filter(n => String(n.id) !== String(id)).slice(0, 4)

    const memberIds = news.value.related_member_ids
    if (memberIds) {
      const ids = typeof memberIds === 'string' ? memberIds : String(memberIds)
      try {
        const mRes = await teamAPI.getBatch(ids)
        relatedMembers.value = mRes.data?.members || mRes.data?.data || mRes.data || []
      } catch { /* ignore */ }
    }
  } catch { /* ignore */ }
})
</script>
