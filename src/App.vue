<script setup lang="ts">

window.databaseApi.onMessage({
	"draft": '213',
            "guid": "6f4e4607-defc-339d-8d4f-180a24bbd5c8",
            "sender": "7881302256961285",
            "receiver": "10737336402983720",
            "senderNickname": "那年十八",
            "msgId": "6038979939951729151",
            "msgTime": "1751506557",
            "room": true,
            "contentType": 3,
            "content": {
                "type_url": "type.googleapis.com/protobuf.common.TextNotice",
                "value": {
                    "content": "hello bee"
                }
            }
					}
)

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
