<script setup lang="ts">
const handleInsertMeesage = () => {
	window.db.addMessage({
		id: '1008611',
		senderId: '123',
		message: 'this is a message!'
	})
}

const handleQueryMeesage = () => {
	window.db.fetchChatData({
		messageId: '172'
	})
}
</script>

<template>
	<router-view />
	<!-- <div style="margin: 10px 200px;">
		<el-button type="success" @click="handleInsertMeesage">数据库测试消息插入</el-button>
		<el-button type="success" @click="handleQueryMeesage">数据库测试消息查询</el-button>
	</div> -->
</template>

<style lang="scss">
@use "@/styles/common.scss";
@use '@/styles/reset.scss';
@use '@/styles/normalize.scss';
@use '@/styles/qqface.scss';
@use '@/assets/iconfont/iconfont.css';
@use '@/assets/font-awesome/css/font-awesome.css';

#app {
	height: 100%;
}
</style>
