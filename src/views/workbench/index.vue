<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { useBridge } from '../../hooks/useBridge.ts'
import { computed } from 'vue'

const bridgeHandlers = useBridge()
const route = useRoute()
const router = useRouter()


const navList = computed(() => {
  return [{
    id: Symbol(),
    path: '/workbench/chat',
    name: 'chat',
    active: route.name === 'chat',
    iconName: route.name === 'chat' ? 'message-active' : 'message',
  }, {
    id: Symbol(),
    path: '/workbench/history',
    name: 'chat',
    active: route.name === 'history',
    iconName: route.name === 'history' ? 'history-active' : 'history',
  }, {
    id: Symbol(),
    path: '/workbench/settings',
    name: 'chat',
    active: route.name === 'settings',
    iconName: route.name === 'settings' ? 'settings1-active' : 'settings1',
  }]
})

const navHandler = (item: NavItem) => {
  router.push({path: item.path})
}

</script>

<template>
<div class="workbench-container">
  <header class="layout-qz drag-area">
    <div class="icon-wrap layout-qz">
      <svg-icon class="chat-icon" name="chat"></svg-icon>
      <span>账号IDxxxxxxxxx</span>
    </div>
    <div class="options-wrap layout-qz no-drag-area">
      <svg-icon name="settings"></svg-icon>
      <svg-icon style="margin-right: 30px" name="shrink"></svg-icon>
      <svg-icon name="min" @click="bridgeHandlers.minimize"></svg-icon>
      <svg-icon name="max" @click="bridgeHandlers.toggleMaximize"></svg-icon>
      <svg-icon name="close" @click="bridgeHandlers.closeWindow"></svg-icon>
    </div>
  </header>
  <aside>
    <div
      class="aside-item layout-zy"
      :class="[{active: item.active}]"
      v-for="item in navList" :key="item.id"
      @click="navHandler(item)"
    >
      <svg-icon :name="item.iconName"></svg-icon>
    </div>
  </aside>
  <main>
    <router-view/>
  </main>
</div>
</template>

<style scoped lang="scss">
.workbench-container {
  position: relative;
  height: 100%;
  display: flex;
  padding-top: 41px;
  header {
    position: absolute;
    width: 100%;
    height: 41px;
    border-bottom: 1px solid #EDEDED;
    top: 0;
    left: 0;
    padding: 0 15px;
    justify-content: space-between;
    .icon-wrap {
      font-weight: 400;
      font-size: 14px;
      color: #666666;
      cursor: pointer;
      .chat-icon {
        font-size: 20px;
        margin-right: 8px;
      }
    }
    .options-wrap {
      font-size: 15px;
      .svg-icon {
        margin: 0 5px;
        cursor: pointer;
      }
    }
  }
  aside {
    width: 60px;
    height: 100%;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 0;
    background: #E2E2E2;
    .aside-item {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      cursor: pointer;
      .svg-icon {
        font-size: 16px;
      }
      &.active {
        background: #fff;
      }
    }
  }
  main {
    flex: 1;
  }
}
</style>
