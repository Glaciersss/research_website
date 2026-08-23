<template>
  <div>
    <Breadcrumb title="研究方向" />

    <div class="service-area">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <div class="Section-title">
              <h2>研究方向</h2>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-4 col-md-6">
            <div class="single-service-box">
              <div class="service-content">
                <div class="service-icon">
                  <i class="fas fa-brain"></i>
                </div>
                <div class="service-title">
                  <h4>人工智能</h4>
                  <p>深度学习理论与方法研究，包括神经网络架构设计、自监督学习、迁移学习等前沿课题。</p>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6">
            <div class="single-service-box">
              <div class="service-content">
                <div class="service-icon">
                  <i class="fas fa-eye"></i>
                </div>
                <div class="service-title">
                  <h4>计算机视觉</h4>
                  <p>图像分类、目标检测、语义分割、图像生成等视觉任务的算法研究与应用。</p>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6">
            <div class="single-service-box">
              <div class="service-content">
                <div class="service-icon">
                  <i class="fas fa-language"></i>
                </div>
                <div class="service-title">
                  <h4>自然语言处理</h4>
                  <p>大语言模型训练与优化、文本生成、情感分析、机器翻译等NLP核心技术研究。</p>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6">
            <div class="single-service-box">
              <div class="service-content">
                <div class="service-icon">
                  <i class="fas fa-robot"></i>
                </div>
                <div class="service-title">
                  <h4>具身智能</h4>
                  <p>机器人与环境的智能交互，包括视觉导航、操控规划和多模态感知研究。</p>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6">
            <div class="single-service-box">
              <div class="service-content">
                <div class="service-icon">
                  <i class="fas fa-database"></i>
                </div>
                <div class="service-title">
                  <h4>数据科学</h4>
                  <p>大规模数据分析方法、图神经网络、推荐系统和知识图谱构建技术。</p>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6">
            <div class="single-service-box">
              <div class="service-content">
                <div class="service-icon">
                  <i class="fas fa-shield-alt"></i>
                </div>
                <div class="service-title">
                  <h4>AI安全</h4>
                  <p>对抗攻击与防御、模型鲁棒性、隐私保护机器学习、AI可解释性研究。</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Related Publications -->
    <div class="blog-area">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <div class="section-title">
              <h2>相关成果</h2>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-4 col-md-6" v-for="project in relatedProjects" :key="project.id">
            <div class="blog-single-box">
              <div class="blog-tumb">
                <img :src="getProjectImage(project)" :alt="project.title" />
              </div>
              <div class="button-1">
                <a href="#">{{ formatProjectType(project.type) }}</a>
                <span>{{ project.year || '' }}</span>
              </div>
              <div class="blog-content">
                <div class="blog-title">
                  <h3>
                    <router-link :to="`/projects/${project.id}`">{{ project.title }}</router-link>
                  </h3>
                  <p>{{ truncateText(project.description || project.abstract, 80) }}</p>
                </div>
                <div class="blog-button">
                  <router-link :to="`/projects/${project.id}`">查看详情</router-link>
                </div>
                <div class="blog-icon">
                  <i class="fas fa-arrow-right"></i>
                </div>
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
import Breadcrumb from '@/components/common/Breadcrumb.vue'
import { projectsAPI } from '@/services/api'

const relatedProjects = ref([])

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

function truncateText(text, maxLen) {
  if (!text) return ''
  const plain = text.replace(/<[^>]+>/g, '')
  return plain.length > maxLen ? plain.slice(0, maxLen) + '...' : plain
}

onMounted(async () => {
  try {
    const res = await projectsAPI.getList('', 1, 6)
    relatedProjects.value = res.data?.projects || res.data?.data || res.data || []
  } catch { /* ignore */ }
})
</script>
