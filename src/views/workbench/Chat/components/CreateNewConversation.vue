<script setup lang="ts">
import { ref } from 'vue'
import SearchInput from '@/components/SearchInput.vue'

defineProps({
  modelValue: Boolean
})
const emits = defineEmits(['update:modelValue'])
const curIndex = ref(1)

const activeName = ref('tab1')
const handleTabChange = (tabName) => {

}
</script>

<template>
<el-dialog :model-value="modelValue" width="654" title="新建会话" @update:modelValue="emits('update:modelValue')">
  <div class="dialog-content">
    <div class="dialog-content-left">
      <div class="search-input-wrap">
        <SearchInput></SearchInput>
      </div>
      <div class="list-wrap scroll">
        <div class="avatar-box" :class="[{active: item === curIndex}]" v-for="item in 20" @click="curIndex = item">
          <img src="" alt="">
          <div class="content">
            <p class="title">名字29999000  <span class="text">企微</span></p>
            <p class="text">12488888888888888</p>
          </div>
        </div>
      </div>
    </div>
    <div class="dialog-content-right">
      <el-tabs v-model="activeName" @tab-change="handleTabChange" style="width:90px">
        <el-tab-pane label="好友" name="tab1">
        </el-tab-pane>
        <el-tab-pane label="群" name="tab2">
        </el-tab-pane>
      </el-tabs>
      <div class="search-input-wrap" style="margin: 0;width: 100%;">
        <SearchInput></SearchInput>
        <el-button type="primary" style="margin-left: 20px">同步好友</el-button>
      </div>
    </div>
  </div>
</el-dialog>
</template>

<style scoped lang="scss">
.dialog-content {
  display: flex;
  padding-bottom: 20px;
  .dialog-content-left {
    width: 296px;
    border-right: 1px solid #E5E5E5;
  }
  .dialog-content-right {
    width: 357px;
    padding: 0 30px;
  }
}
.search-input-wrap {
  width: 227px;
  height: 30px;
  margin: 10px auto;
  display: flex;
  align-items: center;
}
.avatar-box {
  padding: 5px 36px 5px 36px;
  justify-content: flex-start;
  &.active {
    background: #E1EDFF;
  }
  .content {
    width: 100%;
  }
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    .text {
      margin-top: 0;
    }
  }
}
.list-wrap {
  height: 500px;
  overflow-y: auto;
}
:deep(.el-tabs__nav-wrap::after) {
  display: none;
}
</style>
