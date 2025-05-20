<script setup lang="ts">
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
	<router-view />
  <button @click="handleInsertMeesage">消息插入</button>
  <button @click="handleQueryMeesage">消息查询</button>
</template>

<style lang="scss">
@import './styles/reset.scss';
@import './styles/normalize.scss';
@import './styles/common.scss';
@import './styles/my_element_ui.scss';
@import './styles/qqface.scss';
@import '@/assets/iconfont/iconfont.css';
@import '@/assets/font-awesome/css/font-awesome.css';
</style>
