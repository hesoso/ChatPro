import { createWebHashHistory, createRouter } from 'vue-router'

import Login from '@/views/Login.vue'
import Workbench from '@/views/workbench/index.vue'
import Chat from '@/views/workbench/Chat/index.vue'
import History from '@/views/workbench/History.vue'
import Settings from '@/views/workbench/settings.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login, name: 'name' },
  {
    path: '/workbench',
    component: Workbench,
    name: 'workbench',
    children: [
      { path: 'chat', component: Chat, name: 'chat' },
      { path: 'history', component: History, name: 'history' },
      { path: 'settings', component: Settings, name: 'settings' }
    ]
  }
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes
})
