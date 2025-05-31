import { createWebHashHistory, createRouter } from 'vue-router'

import Login from '@/views/Login.vue'
import Workbench from '@/views/workbench/index.vue'
import Chat from '@/views/workbench/Chat/index.vue'
import History from '@/views/workbench/History/index.vue'
import Settings from '@/views/workbench/Settings/index.vue'
import Monitor from '@/views/workbench/Settings/Monitor.vue'
import IgnoreGroup from '@/views/workbench/Settings/IgnoreGroup.vue'
import IgnorePeople from '@/views/workbench/Settings/IgnorePeople.vue'
import OtherSettings from '@/views/workbench/Settings/OtherSettings.vue'

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
      {
        path: 'settings',
        component: Settings,
        name: 'settings',
        children: [
          {
            path: 'monitor',
            name: 'monitor',
            component: Monitor,
            meta: {
              activeIcon: 'settings'
            }
          },
          {
            path: 'ignore-group',
            name: 'ignoregroup',
            component: IgnoreGroup,
            meta: {
              activeIcon: 'settings'
            }
          },
          {
            path: 'ignore-people',
            name: 'ignorepeople',
            component: IgnorePeople,
            meta: {
              activeIcon: 'settings'
            }
          },
          {
            path: 'other-settings',
            name: 'othersettings',
            component: OtherSettings,
            meta: {
              activeIcon: 'settings'
            }
          }
        ]
      }
    ]
  }
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes
})
