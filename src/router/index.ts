import History from '@/views/History.vue'
import Main from '@/views/Main.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: Main,
  },
  {
    path: '/history',
    component: History,
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
