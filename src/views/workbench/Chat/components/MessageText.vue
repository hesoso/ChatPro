<script setup lang="ts">
import { CpMessageProps } from '../types/message';

const props = defineProps<CpMessageProps>()
</script>

<template>
<div class="message-text">你好{{ messageData.content }}</div>
</template>

<style scoped lang="scss">
.message-text {
  height: 30px;
  background: #FFFFFF;
  border-radius: 6px 6px 6px 6px;
  color: #212121;
  font-size: 14px;
  padding: 7px 8px;
  margin-top: 5px;
}

</style>
