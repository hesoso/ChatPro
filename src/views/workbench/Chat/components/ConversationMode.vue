<script setup lang="ts">
import { ref } from 'vue'
import SearchInput from '@/components/SearchInput.vue'

const showSearch = ref(false)

const handleCancel = () => {
  showSearch.value = false
}

</script>

<template>
<div class="conversation-mode">
  <template v-if="!showSearch">
    <el-tag type="primary" size="large" style="margin-right: 27px">
      <div class="mode-wrap">
        <span style="margin-right: 27px">独立[好友+群+群成员]</span>
        <svg-icon style="font-size: 20px" name="down-blue"></svg-icon>
      </div>
    </el-tag>
    <div class="options-wrap">
      <svg-icon name="search-gray" style="margin-right: 10px" @click="showSearch = true"></svg-icon>
      <svg-icon name="add-gray"></svg-icon>
    </div>
  </template>
  <template v-else>
    <div class="search-input-wrap">
      <SearchInput></SearchInput>
      <span class="cancel" @click="handleCancel">取消</span>
    </div>
  </template>
</div>
</template>

<style scoped lang="scss">
.conversation-mode {
  height: 41px;
  border-bottom: 1px solid #EDEDED;
  background: #fff;
  display: flex;
  align-items: center;
  padding: 5px 10px;
}
.options-wrap {
  font-size: 20px;
}
.mode-wrap {
  display: flex;
  align-items: center;
}
.search-input-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 27px;
  width: 100%;
}
.cancel {
  font-weight: 400;
  font-size: 12px;
  color: #3686FF;
  margin-left: 10px;
  user-select: none;
  cursor: pointer;
  flex-shrink: 0;
}
.svg-icon {
  cursor: pointer;
}
</style>
