<template>
  <div>
    <Breadcrumb :title="project.title || '成果详情'" />

    <div class="blog-area">
      <div class="container">
        <div class="row">
          <div class="col-lg-8">
            <div v-if="project.id" class="blog-single-box p-4">
              <div class="blog-tumb mb-4" v-if="getProjectImage(project)">
                <img :src="getProjectImage(project)" :alt="project.title" style="width:100%;max-height:450px;object-fit:cover;" />
              </div>

              <h2 style="color:#303030;margin-bottom:15px;">{{ project.title }}</h2>

              <div class="mb-3" style="color:#626262;">
                <span class="me-3" v-if="project.authors">
                  <i class="fas fa-users me-1"></i> {{ project.authors }}
                </span>
                <span class="me-3" v-if="project.year">
                  <i class="far fa-calendar-alt me-1"></i> {{ project.year }}
                </span>
                <span v-if="project.type">
                  <i class="far fa-folder me-1"></i> {{ formatProjectType(project.type) }}
                </span>
              </div>

              <div style="color:#626262;font-size:14px;letter-spacing:1px;line-height:2;" v-if="project.abstract">
                <h5 style="color:#303030;">摘要</h5>
                <p>{{ project.abstract }}</p>
              </div>

              <div style="color:#626262;font-size:14px;letter-spacing:1px;line-height:2;" v-if="project.description" class="mb-3">
                <p>{{ project.description }}</p>
              </div>

              <div class="mb-3" v-if="project.keywords">
                <h5 style="color:#303030;">关键词</h5>
                <div>
                  <span v-for="(kw, i) in parseKeywords(project.keywords)" :key="i"
                    class="badge me-1 mb-1" style="background:#343a40;color:#fff;padding:6px 12px;">
                    {{ kw }}
                  </span>
                </div>
              </div>

              <div style="color:#626262;" class="mb-3" v-if="project.publication_info">
                <h5 style="color:#303030;">发表信息</h5>
                <p>{{ project.publication_info }}</p>
              </div>

              <div v-if="project.detail_content" class="mb-4" style="color:#626262;font-size:14px;letter-spacing:1px;line-height:2;" v-html="project.detail_content"></div>

              <div class="mb-4">
                <a v-if="project.link" :href="project.link" target="_blank" class="me-2"
                  style="display:inline-block;text-decoration:none;background:#303030;color:#fff;padding:8px 24px;font-size:13px;text-transform:uppercase;letter-spacing:2px;">
                  <i class="fas fa-external-link-alt me-1"></i> 链接
                </a>
                <a v-if="project.pdf_url" :href="project.pdf_url" target="_blank" class="me-2"
                  style="display:inline-block;text-decoration:none;border:2px solid #343a40;color:#343a40;padding:8px 24px;font-size:13px;text-transform:uppercase;letter-spacing:2px;">
                  <i class="fas fa-file-pdf me-1"></i> PDF
                </a>
                <a v-if="project.code_url" :href="project.code_url" target="_blank"
                  style="display:inline-block;text-decoration:none;border:2px solid #343a40;color:#343a40;padding:8px 24px;font-size:13px;text-transform:uppercase;letter-spacing:2px;">
                  <i class="fas fa-code me-1"></i> 代码
                </a>
              </div>

              <div class="mb-3" v-if="project.citation">
                <h5 style="color:#303030;">引用格式</h5>
                <div class="p-3" style="background:#f7f7f7;border-left:3px solid #343a40;">
                  <p class="mb-0" style="color:#626262;font-size:13px;">{{ project.citation }}</p>
                </div>
              </div>

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
            <div v-else class="text-center py-5">
              <p style="color:#626262;">加载中...</p>
            </div>
          </div>

          <div class="col-lg-4">
            <div class="sideber-box" v-if="project.figure_caption">
              <div class="sideber-title">
                <h3>图片说明</h3>
              </div>
              <p style="color:#626262;">{{ project.figure_caption }}</p>
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
import { projectsAPI, teamAPI } from '@/services/api'

const route = useRoute()
const project = ref({})
const relatedMembers = ref([])

function formatProjectType(type) {
  if (type === 'publication') return '论文发表'
  if (type === 'project') return '科研项目'
  if (type === 'teaching') return '教学成果'
  return type || '成果'
}

function getProjectImage(p) {
  if (!p) return ''
  const url = p.figure_url
  if (!url) return ''
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

function parseKeywords(kw) {
  if (!kw) return []
  if (typeof kw === 'string') return kw.split(/[,;，；]/).map(k => k.trim()).filter(Boolean)
  return Array.isArray(kw) ? kw : [kw]
}

onMounted(async () => {
  const id = route.params.id
  try {
    const res = await projectsAPI.getById(id)
    project.value = res.data?.project || res.data || {}

    const memberIds = project.value.related_member_ids
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
