<template>
  <div>
    <Breadcrumb title="关于我们" />

    <!-- About Intro -->
    <div class="feature-area">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <div class="Section-title">
              <h2>关于课题组</h2>
            </div>
          </div>
        </div>
        <div class="row align-items-center">
          <div class="col-lg-6">
            <div class="about-thumb mb-4">
              <img src="@/assets/images/1.jpg" alt="About" class="img-fluid" />
            </div>
          </div>
          <div class="col-lg-6">
            <div class="about-text">
              <p style="color:#626262;font-size:14px;letter-spacing:1px;line-height:2;">
                本课题组隶属于计算机科学与技术学院，致力于人工智能、计算机视觉、自然语言处理等前沿领域的研究。我们汇聚了一批充满激情和创新精神的研究人员，在国内外高水平学术期刊和会议上发表了多篇重要论文。
              </p>
              <p style="color:#626262;font-size:14px;letter-spacing:1px;line-height:2;">
                课题组注重理论与实践相结合，与多家企业和研究机构建立了紧密的合作关系，为学生提供了丰富的科研实践机会。我们欢迎对相关研究方向感兴趣的优秀学子加入我们的团队，共同探索科技前沿。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Advantages -->
    <div class="service-area">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <div class="Section-title">
              <h2>我们的优势</h2>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-4 col-md-6">
            <div class="single-service-box">
              <div class="service-content">
                <div class="service-icon">
                  <i class="fas fa-chalkboard-teacher"></i>
                </div>
                <div class="service-title">
                  <h4>优秀导师团队</h4>
                  <p>经验丰富的教授团队，国际化的学术视野和严谨的治学态度，为每位学生提供悉心指导。</p>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6">
            <div class="single-service-box">
              <div class="service-content">
                <div class="service-icon">
                  <i class="fas fa-laptop-code"></i>
                </div>
                <div class="service-title">
                  <h4>丰富科研资源</h4>
                  <p>充足的科研经费，先进的GPU计算集群和实验设备，完善的科研支撑体系。</p>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6">
            <div class="single-service-box">
              <div class="service-content">
                <div class="service-icon">
                  <i class="fas fa-globe-asia"></i>
                </div>
                <div class="service-title">
                  <h4>国际学术交流</h4>
                  <p>广泛的国际合作网络，定期举办学术研讨会，支持学生参加国际顶级会议。</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Counter -->
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

    <!-- Faculty Preview -->
    <div class="testimonial-area">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <div class="Section-title">
              <h2>指导教师</h2>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-3 col-md-6" v-for="member in facultyMembers" :key="member.id">
            <router-link :to="`/team/${member.id}`" style="text-decoration:none;">
              <div class="single-service-box">
                <div class="service-content">
                  <div class="service-icon">
                    <img :src="getAvatar(member)" :alt="member.name"
                      style="width:80px;height:80px;border-radius:50%;object-fit:cover;" />
                  </div>
                  <div class="service-title">
                    <h4>{{ member.name }}</h4>
                    <p>{{ member.role }}</p>
                  </div>
                </div>
              </div>
            </router-link>
          </div>
        </div>
        <div class="row mt-4">
          <div class="col-lg-12 text-center">
            <router-link to="/team" style="display:inline-block;text-decoration:none;border:2px solid #444;padding:8px 30px;font-size:13px;letter-spacing:3px;color:#343a40;text-transform:uppercase;">查看全部成员</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Breadcrumb from '@/components/common/Breadcrumb.vue'
import { teamAPI } from '@/services/api'

const facultyMembers = ref([])

function getAvatar(member) {
  return member.avatar || new URL('@/assets/images/0.jpg', import.meta.url).href
}

onMounted(async () => {
  try {
    const res = await teamAPI.getList('faculty')
    facultyMembers.value = (res.data?.members || res.data?.data || res.data || []).slice(0, 4)
  } catch { /* ignore */ }
})
</script>
