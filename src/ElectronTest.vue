<script setup lang="ts">
const handleInsertMeesage = () => {
	window.databaseApi.addMessage({
		id: '1008611',
		senderId: '123',
		message: 'this is a message!',
        sessionId: 'session_id1008611',
        sender_id_ref: 'sender_id_ref21312312312',
        receiver_id_ref: 'receiver_id_ref21312',
        message_type: 'message_type1312',
        content: 'contentdasdas',
        timestamp: 'timestamp31232',
        is_from_me: 'is_from_me111',
        quote_message_id: 'quote_message_id2321',
        raw_data: 'raw_data3123'
	})

    //  session_id, sender_id_ref, receiver_id_ref, message_type, 
    //         content, timestamp, is_from_me, quote_message_id, raw_data
}

const handleQueryMeesage = () => {
	window.databaseApi.fetchChatData({
		messageId: '172'
	})
}
</script>

<template>
	<div style="padding: 10px;">
        <h3 class="mb10">数据库操作：</h3>
		<el-button type="success" @click="handleInsertMeesage">测试消息插入</el-button>
		<el-button type="success" @click="handleQueryMeesage">测试消息查询</el-button>
	</div>
</template>

<style lang="scss">
.mb10 { margin-bottom: 10px; }
</style>
