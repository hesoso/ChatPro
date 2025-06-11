<script setup lang="ts">

</script>

<template>
  <div class="chat-input-enter">
    <el-checkbox size="small"><span class="text">@回复</span></el-checkbox>
    <el-button type="primary">发送(Enter)</el-button>
  </div>
</template>

<style scoped lang="scss">
.chat-input-enter {
  margin-bottom: 20px;
  margin-top: 10px;
  margin-right: 20px;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
}
.text {
  font-weight: 400;
  font-size: 14px;
  color: #3686FF;
}
:deep(.el-checkbox__label) {
  padding-left: 0;
  margin-right: 10px;
}
</style>
