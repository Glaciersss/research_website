<template>
  <div>
    <Breadcrumb :title="member.name || '成员详情'" />

    <div class="service-area">
      <div class="container">
        <div class="row" v-if="member.id">
          <div class="col-lg-4">
            <div class="text-center mb-4">
              <img :src="getAvatar(member)" :alt="member.name"
                style="width:220px;height:220px;border-radius:50%;object-fit:cover;border:5px solid #f7f7f7;" />
              <h3 class="mt-3" style="color:#303030;">{{ member.name }}</h3>
              <p style="color:#626262;font-size:16px;">{{ member.role }}</p>
              <p v-if="member.category" style="color:#999;font-size:13px;">
                {{ member.category === 'faculty' ? '指导教师' : member.category === '在读生' ? '在读学生' : '毕业学生' }}
              </p>
            </div>

            <div class="p-4" style="background:#f7f7f7;" v-if="member.email || member.website">
              <h5 style="color:#303030;">联系信息</h5>
              <ul class="list-unstyled mt-3">
                <li v-if="member.email" class="mb-2">
                  <i class="fas fa-envelope me-2" style="color:#343a40;"></i>
                  <a :href="`mailto:${member.email}`" style="color:#626262;text-decoration:none;">{{ member.email }}</a>
                </li>
                <li v-if="member.website" class="mb-2">
                  <i class="fas fa-globe me-2" style="color:#343a40;"></i>
                  <a :href="member.website" target="_blank" style="color:#626262;text-decoration:none;">个人主页</a>
                </li>
              </ul>
            </div>
          </div>

          <div class="col-lg-8">
            <div class="mb-4" v-if="member.bio">
              <h4 style="color:#303030;">个人简介</h4>
              <p style="color:#626262;font-size:14px;letter-spacing:1px;line-height:2;">{{ member.bio }}</p>
            </div>

            <div class="mb-4" v-if="member.research">
              <h4 style="color:#303030;">研究方向</h4>
              <p style="color:#626262;font-size:14px;letter-spacing:1px;line-height:2;">{{ member.research }}</p>
            </div>

            <div class="mb-4" v-if="relatedProjects.length">
              <h4 style="color:#303030;">相关成果</h4>
              <div class="row mt-3">
                <div class="col-md-6" v-for="project in relatedProjects" :key="project.id">
                  <div class="blog-single-box">
                    <div class="blog-tumb">
                      <img :src="getProjectImage(project)" :alt="project.title" style="width:100%;height:180px;object-fit:cover;" />
                    </div>
                    <div class="blog-content">
                      <div class="blog-title p-3">
                        <h5>
                          <router-link :to="`/projects/${project.id}`">{{ project.title }}</router-link>
                        </h5>
                        <p style="font-size:13px;color:#999;">{{ project.year }} {{ project.type ? '· ' + formatProjectType(project.type) : '' }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-5">
          <p style="color:#626262;">加载中...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Breadcrumb from '@/components/common/Breadcrumb.vue'
import { teamAPI, projectsAPI } from '@/services/api'

const route = useRoute()
const member = ref({})
const relatedProjects = ref([])

function formatProjectType(type) {
  if (type === 'publication') return '论文发表'
  if (type === 'project') return '科研项目'
  if (type === 'teaching') return '教学成果'
  return type || ''
}

function getAvatar(m) {
  return m.avatar || new URL('@/assets/images/0.jpg', import.meta.url).href
}

function getProjectImage(p) {
  if (!p) return ''
  const url = p.figure_url
  if (!url) return new URL('@/assets/images/1.jpg', import.meta.url).href
  try {
    const urls = JSON.parse(url)
    return Array.isArray(urls) && urls.length ? urls[0] : url
  } catch {
    return url
  }
}

onMounted(async () => {
  const id = route.params.id
  try {
    const res = await teamAPI.getById(id)
    member.value = res.data?.member || res.data || {}

    const achievements = member.value.achievements
    if (achievements) {
      try {
        const ids = JSON.parse(typeof achievements === 'string' ? achievements : String(achievements))
        if (Array.isArray(ids) && ids.length) {
          const pRes = await projectsAPI.getBatch(ids.join(','))
          relatedProjects.value = pRes.data?.projects || pRes.data?.data || pRes.data || []
        }
      } catch {
        const ids = String(achievements)
        if (ids.trim()) {
          try {
            const pRes = await projectsAPI.getBatch(ids)
            relatedProjects.value = pRes.data?.projects || pRes.data?.data || pRes.data || []
          } catch { /* ignore */ }
        }
      }
    }
  } catch { /* ignore */ }
})
</script>
