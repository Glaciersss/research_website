<template>
  <div class="footer-area">
    <div class="container">
      <div class="row">
        <div class="footer-content">
          <div class="footer-thumb">
            <img src="@/assets/images/logo2.png" alt="Logo" />
          </div>
          <div class="footer-title">
            <p>欢迎来到我们的课题组网站。我们致力于前沿科学研究，培养优秀人才，推动学术创新与社会进步。</p>
          </div>
          <div class="footer-icon">
            <ul>
              <li><a href="#"><i class="fab fa-facebook-f"></i></a></li>
              <li><a href="#"><i class="fa-brands fa-x-twitter"></i></a></li>
              <li><a href="#"><i class="fab fa-pinterest"></i></a></li>
              <li><a href="#"><i class="fab fa-linkedin-in"></i></a></li>
              <li><a href="#"><i class="fab fa-dribbble"></i></a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="copyright-area">
    <div class="container">
      <div class="row come align-items-center">
        <div class="content">
          <div class="copyright-title">
            <h4>Copyright &copy; All rights reserved {{ currentYear }}.</h4>
          </div>
          <div class="copyright-text">
            <ul>
              <li><router-link to="/about">关于我们</router-link></li>
              <li><a href="#">隐私政策</a></li>
              <li><router-link to="/contact">联系我们</router-link></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const currentYear = new Date().getFullYear()
</script>
