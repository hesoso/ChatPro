<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'

const handleInsertMeesage = () => {
  window.ipcRenderer.on('main-process-message', (_event, message) => {
    console.log(message)
  })
}

const handleQueryMeesage = () => {
  window.ipcRenderer.on('main-process-message', (_event, message) => {
    console.log(message)
  })
}
</script>

<template>
  <div>
    <a href="https://electron-vite.github.io" target="_blank">
      <img src="/electron-vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" />
  <button @click="handleInsertMeesage">消息插入</button>
  <button @click="handleQueryMeesage">消息查询</button>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
