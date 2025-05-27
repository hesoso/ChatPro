<script setup lang="ts">
import ConversationMode from './components/ConversationMode.vue'
import Robot from './components/Robot.vue'
import ConversationList from './components/ConversationList.vue'
import ChatInput from '@/views/workbench/Chat/components/ChatInput.vue'
import ChatView from '@/views/workbench/Chat/components/ChatView.vue'
import ConversationItem from '@/views/workbench/Chat/components/ConversationItem.vue'
import { ref } from 'vue'

const messageList = ref(new Array(30000).fill({
  id: Symbol(),
}))
</script>

<template>
  <div class="chat-wrap">
    <div class="left-wrap">
      <!-- 选择会话模式 -->
      <ConversationMode></ConversationMode>
      <div class="layout-qz">
        <Robot></Robot>
        <ConversationList></ConversationList>
      </div>
    </div>
    <div class="right-wrap">
      <div class="layout-qz">
        <ChatView></ChatView>
      </div>
      <ChatInput></ChatInput>
    </div>
  </div>
</template>

<style scoped lang="scss">
.chat-wrap {
  display: flex;
  height: 100%;
  .left-wrap {
    width: 300px;
    height: 100%;
    flex-shrink: 0;
    background: #EAEAEA;
    display: flex;
    flex-direction: column;
  }
  .right-wrap {
    flex: 1;
    height: 100%;
    border-left: 1px solid #EDEDED;
    display: flex;
    flex-direction: column;
    background: #F7F7F7;
  }
}
.layout-qz {
  flex: 1;
  min-height: 0;
}
.scroller {
  height: 400px;
}
</style>
