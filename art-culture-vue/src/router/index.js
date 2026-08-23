import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/About.vue')
  },
  {
    path: '/research',
    name: 'Research',
    component: () => import('@/views/Research.vue')
  },
  {
    path: '/news',
    name: 'News',
    component: () => import('@/views/News.vue')
  },
  {
    path: '/news/:id',
    name: 'NewsDetail',
    component: () => import('@/views/NewsDetail.vue')
  },
  {
    path: '/projects',
    name: 'Projects',
    component: () => import('@/views/Projects.vue')
  },
  {
    path: '/projects/:id',
    name: 'ProjectDetail',
    component: () => import('@/views/ProjectDetail.vue')
  },
  {
    path: '/team',
    name: 'Team',
    component: () => import('@/views/Team.vue')
  },
  {
    path: '/team/:id',
    name: 'MemberDetail',
    component: () => import('@/views/MemberDetail.vue')
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import('@/views/Contact.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
