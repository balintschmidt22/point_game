import { createRouter, createWebHistory } from 'vue-router'
import GameView from '../views/GameView.vue'
import SolutionView from '../views/SolutionView.vue'
import StartView from '../views/StartView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: StartView
    },
    {
      path: '/game',
      name: 'game',
      component: GameView
    },
    {
      path: '/solution',
      name: 'solution',
      component: SolutionView
    }
  ]
})

export default router
