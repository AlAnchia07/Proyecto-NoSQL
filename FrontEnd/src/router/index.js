import NotificacionesView from '@/views/NotificacionesView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/notificaciones",
      name: "notificaciones",
      component: NotificacionesView
    }
  ],
})

export default router
