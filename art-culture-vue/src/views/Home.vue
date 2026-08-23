<template>
  <div>
    <!-- Hero Section - matches original index.html exactly -->
    <div class="hero-section align-items-center d-flex">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <div class="content">
              <div class="hero-title">
                <h4>{{ heroSubtitle }}</h4>
                <h1>{{ heroTitle }}</h1>
              </div>
              <div class="hero-button">
                <router-link to="/contact">联系我们</router-link>
              </div>
              <div class="hero-button">
                <router-link to="/about">关于我们</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="intro__bg">
        <canvas id="intro__canvas" data-colors='["#999", "#F96921", "#232323"]'></canvas>
      </div>
    </div>

    <!-- Feature Area -->
    <div class="feature-area">
      <div class="container">
        <div class="row">
          <div class="col-lg-4 col-md-6">
            <div class="single-feature-box">
              <div class="feature-content">
                <div class="feature-icon">
                  <i class="fas fa-flask"></i>
                </div>
                <div class="feature-title">
                  <h3>前沿研究</h3>
                  <p>致力于计算机科学前沿领域的研究与探索，推动学术创新与技术进步。</p>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6">
            <div class="single-feature-box">
              <div class="feature-content">
                <div class="feature-icon">
                  <i class="far fa-gem"></i>
                </div>
                <div class="feature-title">
                  <h3>卓越成果</h3>
                  <p>在高水平国际期刊和会议上发表多篇学术论文，取得重要研究突破。</p>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6">
            <div class="single-feature-box">
              <div class="feature-content">
                <div class="feature-icon">
                  <i class="fas fa-users"></i>
                </div>
                <div class="feature-title">
                  <h3>优秀团队</h3>
                  <p>汇聚了一批充满创新精神和活力的研究人员，营造协作共赢的科研氛围。</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Portfolio Area -->
    <div class="portfolio-area">
      <div class="Section-title">
        <h2>最新成果</h2>
      </div>
      <div class="section-menu">
        <ul>
          <li :class="{ active: filterKey === '' }" @click="filterKey = ''">全部成果</li>
          <li :class="{ active: filterKey === 'publication' }" @click="filterKey = 'publication'">论文发表</li>
          <li :class="{ active: filterKey === 'project' }" @click="filterKey = 'project'">科研项目</li>
        </ul>
      </div>
      <div class="item-details">
        <div class="item" v-for="project in filteredProjects" :key="project.id">
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
    </div>

    <!-- Service Area -->
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
                  <p>深度学习理论与方法研究，神经网络架构设计与优化。</p>
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
                  <p>图像识别、目标检测、语义分割与视觉理解技术研究。</p>
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
                  <p>大语言模型、文本理解与智能对话系统核心技术研究。</p>
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
                  <p>机器人与环境智能交互，视觉导航与多模态感知研究。</p>
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
                  <p>大规模数据分析方法、图神经网络与知识图谱构建。</p>
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
                  <p>对抗攻击与防御、模型鲁棒性与隐私保护机器学习研究。</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Counter Area -->
    <div class="counter-area">
      <div class="container">
        <div class="row">
          <div class="col-lg-3 col-md-6">
            <div class="single-counter-box">
              <div class="counter-content">
                <div class="counter-title">
                  <h1><span class="aa">50</span><span>+</span></h1>
                  <h5>发表论文</h5>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-3 col-md-6">
            <div class="single-counter-box">
              <div class="counter-content">
                <div class="counter-title">
                  <h1><span class="aa">20</span><span>+</span></h1>
                  <h5>科研项目</h5>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-3 col-md-6">
            <div class="single-counter-box">
              <div class="counter-content">
                <div class="counter-title">
                  <h1><span class="aa">30</span><span>+</span></h1>
                  <h5>团队成员</h5>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-3 col-md-6">
            <div class="single-counter-box">
              <div class="counter-content">
                <div class="counter-title">
                  <h1><span class="aa">15</span><span>+</span></h1>
                  <h5>获奖荣誉</h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Testimonial Area -->
    <div class="testimonial-area">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <div class="Section-title">
              <h2>学生寄语</h2>
            </div>
            <div class="testi_list1 testimonial-content owl-carousel">
              <div class="single-testimonial">
                <div class="testimonial-thumb">
                  <img src="@/assets/images/0.jpg" alt="" />
                </div>
                <div class="testimonial-icon">
                  <i class="fas fa-quote-left"></i>
                </div>
                <div class="testimonial-text">
                  <p>在这里我找到了真正热爱的研究方向，导师的悉心指导和团队的良好氛围让我快速成长。</p>
                  <h4>张同学</h4>
                  <h5>博士研究生</h5>
                </div>
              </div>
              <div class="single-testimonial">
                <div class="testimonial-thumb">
                  <img src="@/assets/images/03.jpg" alt="" />
                </div>
                <div class="testimonial-icon">
                  <i class="fas fa-quote-left"></i>
                </div>
                <div class="testimonial-text">
                  <p>课题组提供了丰富的科研资源和实践机会，让我在学术道路上不断进步与成长。</p>
                  <h4>李同学</h4>
                  <h5>硕士研究生</h5>
                </div>
              </div>
              <div class="single-testimonial">
                <div class="testimonial-thumb">
                  <img src="@/assets/images/04.jpg" alt="" />
                </div>
                <div class="testimonial-icon">
                  <i class="fas fa-quote-left"></i>
                </div>
                <div class="testimonial-text">
                  <p>导师严谨的治学态度和国际化的学术视野深深影响了我，感谢课题组的培养。</p>
                  <h4>王同学</h4>
                  <h5>博士研究生</h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Blog Area - Latest News -->
    <div class="blog-area">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <div class="section-title">
              <h2>最新动态</h2>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-4 col-md-6 col-sm-6" v-for="item in latestNews" :key="item.id">
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
                  <p>{{ truncateText(item.content, 80) }}</p>
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
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { projectsAPI, newsAPI } from '@/services/api'

const heroTitle = ref('欢迎来到课题组')
const heroSubtitle = ref('创新 · 卓越 · 协作')

const allProjects = ref([])
const allNews = ref([])
const filterKey = ref('')

const filteredProjects = computed(() => {
  if (!filterKey.value) return allProjects.value.slice(0, 6)
  return allProjects.value.filter(p => p.type === filterKey.value).slice(0, 6)
})

const latestNews = computed(() => allNews.value.slice(0, 3))

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

onMounted(async () => {
  try {
    const [projRes, newsRes] = await Promise.all([
      projectsAPI.getList('', 1, 20),
      newsAPI.getList(1, 10)
    ])
    allProjects.value = projRes.data?.projects || projRes.data?.data || []
    allNews.value = newsRes.data?.news || newsRes.data?.data || []
  } catch {
    // API not available, use empty/default data
  }
})
</script>
