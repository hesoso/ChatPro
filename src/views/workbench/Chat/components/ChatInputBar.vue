<script setup lang="ts">
import { ref } from 'vue'
import SvgIcon from '@/components/SvgIcon.vue'

const options = ref([{
  iconName: '表情'
},{
  iconName: '收藏'
},{
  iconName: 'gif'
},{
  iconName: '文件'
},{
  iconName: '消息记录'
}])
</script>

<template>
<div class="chat-input-bar">
  <div class="options">
    <svg-icon :name="item.iconName" v-for="(item, index) in options" :key="index"></svg-icon>
  </div>
</div>
</template>

<style scoped lang="scss">
.chat-input-bar {
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 18px;
  .options {
    font-size: 16px;
  }
  .svg-icon {
    margin-right: 20px;
    cursor: pointer;
  }
}
</style>
