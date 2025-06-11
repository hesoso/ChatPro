<script setup lang="ts">
import { ref } from 'vue'

const fileType = ref('img')
</script>

<template>
  <div v-if="fileType === 'img'" class="img-wrap">
    <el-image style="width: 100px; height: 100px" src="" fit="fit" />
  </div>
  <div v-else class="file-wrap">
    <svg-icon style="font-size: 35px" name="pdf"></svg-icon>
    <div class="file-content">
      <p class="file-name">文件名.ppt</p>
      <p class="file-size">100.02MB</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.file-wrap {
  height: 57px;
  background: #FFFFFF;
  border-radius: 8px 8px 8px 8px;
  padding: 12px 15px;
  display: flex;
  align-items: center;

  .file-content {
    margin-left: 10px;
    font-weight: 500;
    font-size: 16px;
    color: #3D3D3D;
  }

  .file-size {
    font-weight: 400;
    font-size: 12px;
    color: #999999
  }

}

.img-wrap {

}
</style>
