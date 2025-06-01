<script setup lang="ts">
import ChatInputBar from '@/views/workbench/Chat/components/ChatInputBar.vue'
import ChatInputEnter from '@/views/workbench/Chat/components/ChatInputEnter.vue'
</script>

<template>
  <ChatInputBar></ChatInputBar>
  <textarea class="scroll"></textarea>
  <ChatInputEnter></ChatInputEnter>
</template>

<style scoped lang="scss">

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

</style>
