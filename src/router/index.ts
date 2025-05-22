import { createWebHashHistory, createRouter } from 'vue-router'

import Login from '../views/Login.vue'
import ElectronTest from '../ElectronTest.vue'

const routes = [
  { path: '/', component: ElectronTest },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes
})
