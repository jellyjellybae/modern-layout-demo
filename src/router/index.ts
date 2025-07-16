import { createRouter, createWebHistory } from 'vue-router'
import LayoutBuilder from '@/views/LayoutBuilder.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'layout-builder',
      component: LayoutBuilder
    }
  ]
})

export default router