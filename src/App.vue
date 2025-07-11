<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(async () => {
  window.databaseApi.onMessage({
      "wechatId": '1008611',
      "chatType": '1',
      "draft": '213',
      "sender": "7881302256961285",
      "receiver": "10737336402983720",
      "senderNickname": "那年十八",
      "msgId": "6038979939951729151",
      "msgTime": 1751506557,
      "room": true,
      "contentType": 3,
      "content": "hello bee"
    }
  )

  const messages = await window.databaseApi.getMessages({
    "wechatId": '1008611',
    "convoId": '7881302256961285',
    "chatType": '1',
    options: {}
  })

  console.log('从数据中取得的消息messages有：', messages.data)
})

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
@use '@/styles/normalize.scss';
@use '@/assets/iconfont/iconfont.css';
@use '@/assets/font-awesome/css/font-awesome.css';

#app {
	height: 100%;
}
</style>
