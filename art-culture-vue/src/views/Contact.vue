<template>
  <div>
    <Breadcrumb title="联系我们" />

    <!-- Contact Info -->
    <div class="contact-info-area style-ten upper-2">
      <div class="container-fluid">
        <div class="row"></div>
        <div class="row">
          <div class="col-lg-4 col-md-6">
            <div class="single-contact-box">
              <div class="contact-content">
                <div class="contact-icon">
                  <i class="far fa-envelope-open"></i>
                </div>
                <div class="contact-title">
                  <h3>地址</h3>
                  <span>计算机科学与技术学院，XX大学</span>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6">
            <div class="single-contact-box">
              <div class="contact-content">
                <div class="contact-icon">
                  <i class="far fa-clock"></i>
                </div>
                <div class="contact-title">
                  <h3>工作时间</h3>
                  <span>周一至周五: 9:00 - 17:30</span>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6">
            <div class="single-contact-box">
              <div class="contact-content">
                <div class="contact-icon">
                  <i class="fas fa-phone-alt"></i>
                </div>
                <div class="contact-title">
                  <h3>联系方式</h3>
                  <span>lab@example.edu.cn</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contact Form -->
    <div class="contact-form-area">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <form @submit.prevent="handleSubmit" id="dreamit-form">
              <div class="row">
                <div class="col-lg-6">
                  <div class="form_box">
                    <input type="text" v-model="form.name" placeholder="姓名" required />
                  </div>
                </div>
                <div class="col-lg-6">
                  <div class="form_box">
                    <input type="email" v-model="form.email" placeholder="邮箱" required />
                  </div>
                </div>
                <div class="col-lg-6">
                  <div class="form_box">
                    <input type="text" v-model="form.phone" placeholder="电话" />
                  </div>
                </div>
                <div class="col-lg-6">
                  <div class="form_box">
                    <input type="text" v-model="form.subject" placeholder="主题" />
                  </div>
                </div>
                <div class="col-lg-12">
                  <div class="form_box">
                    <textarea v-model="form.message" cols="30" rows="10" placeholder="留言内容" required></textarea>
                  </div>
                  <div class="form-button">
                    <button type="submit" :disabled="submitting">
                      {{ submitting ? '提交中...' : '发送消息' }}
                    </button>
                  </div>
                </div>
              </div>
            </form>
            <div v-if="submitStatus" class="alert mt-3" :class="submitStatus.success ? 'alert-success' : 'alert-danger'">
              {{ submitStatus.message }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Map -->
    <div class="map-area">
      <div class="container">
        <div class="row same">
          <div class="col-lg-12">
            <iframe src="https://www.amap.com/" width="1920" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import Breadcrumb from '@/components/common/Breadcrumb.vue'
import { contactAPI } from '@/services/api'

const form = reactive({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: ''
})

const submitting = ref(false)
const submitStatus = ref(null)

async function handleSubmit() {
  submitting.value = true
  submitStatus.value = null
  try {
    await contactAPI.submit({
      name: form.name,
      email: form.email,
      subject: form.subject || '联系咨询',
      message: form.message
    })
    submitStatus.value = { success: true, message: '消息发送成功！我们将尽快与您联系。' }
    form.name = ''
    form.email = ''
    form.phone = ''
    form.subject = ''
    form.message = ''
  } catch {
    submitStatus.value = { success: false, message: '发送失败，请稍后重试或直接发送邮件至 lab@example.edu.cn' }
  } finally {
    submitting.value = false
  }
}
</script>
