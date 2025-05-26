<script setup lang="ts">
import ConversationMode from './components/ConversationMode.vue'
import Robot from './components/Robot.vue'
import ConversationList from './components/ConversationList.vue'


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
    <div class="right-wrap">右边</div>
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
    border-left: 1px solid #EDEDED;
  }
}
.layout-qz {
  flex: 1;
  min-height: 0;
}
</style>
