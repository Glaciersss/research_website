<template>
  <div>
    <Breadcrumb title="团队成员" />

    <div class="portfolio-area">
      <div class="section-menu">
        <ul>
          <li :class="{ active: activeCategory === '' }" @click="activeCategory = ''">全部成员</li>
          <li :class="{ active: activeCategory === 'faculty' }" @click="activeCategory = 'faculty'">指导教师</li>
          <li :class="{ active: activeCategory === '在读生' }" @click="activeCategory = '在读生'">在读学生</li>
          <li :class="{ active: activeCategory === '毕业生' }" @click="activeCategory = '毕业生'">毕业学生</li>
        </ul>
      </div>
    </div>

    <div class="service-area">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <div class="Section-title">
              <h2>{{ categoryTitle }}</h2>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-3 col-md-6" v-for="member in filteredMembers" :key="member.id">
            <router-link :to="`/team/${member.id}`" style="text-decoration:none;">
              <div class="single-service-box">
                <div class="service-content">
                  <div class="service-icon">
                    <img :src="getAvatar(member)" :alt="member.name"
                      style="width:100px;height:100px;border-radius:50%;object-fit:cover;" />
                  </div>
                  <div class="service-title">
                    <h4>{{ member.name }}</h4>
                    <p>{{ member.role }}</p>
                    <p v-if="member.research" style="font-size:12px;color:#999;">{{ truncateText(member.research, 30) }}</p>
                  </div>
                </div>
              </div>
            </router-link>
          </div>
        </div>
        <div v-if="filteredMembers.length === 0" class="text-center py-5">
          <p style="color:#626262;">暂无成员数据</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Breadcrumb from '@/components/common/Breadcrumb.vue'
import { teamAPI } from '@/services/api'

const allMembers = ref([])
const activeCategory = ref('')

const filteredMembers = computed(() => {
  if (!activeCategory.value) return allMembers.value
  return allMembers.value.filter(m => m.category === activeCategory.value)
})

const categoryTitle = computed(() => {
  const map = { '': '全部成员', faculty: '指导教师', '在读生': '在读学生', '毕业生': '毕业学生' }
  return map[activeCategory.value] || '全部成员'
})

function getAvatar(member) {
  return member.avatar || new URL('@/assets/images/0.jpg', import.meta.url).href
}

function truncateText(text, maxLen) {
  if (!text) return ''
  return text.length > maxLen ? text.slice(0, maxLen) + '...' : text
}

onMounted(async () => {
  try {
    const res = await teamAPI.getList()
    allMembers.value = res.data?.members || res.data?.data || res.data || []
  } catch { /* ignore */ }
})
</script>
