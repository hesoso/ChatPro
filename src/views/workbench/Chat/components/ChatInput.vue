<script setup lang="ts">

import ChatInputBar from '@/views/workbench/Chat/components/ChatInputBar.vue'
import ChatInputEnter from '@/views/workbench/Chat/components/ChatInputEnter.vue'
</script>

<template>
  <div class="chat-input">
    <ChatInputBar></ChatInputBar>
    <textarea class="scroll"></textarea>
    <ChatInputEnter></ChatInputEnter>
  </div>
</template>

<style scoped lang="scss">
.chat-input {
  height: 210px;
  border-top: 1px solid #E1E1E1;
  display: flex;
  flex-direction: column;
  textarea {
    flex: 1;
    border: none;
    padding: 0 10px;
    background: transparent;
    outline: none;
    font-weight: 400;
    font-size: 14px;
    color: #212121;
    resize: none;
  }
}
</style>
