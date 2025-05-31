<script lang="ts" setup>
import { ref } from 'vue'
const peopleMessage = ref(false)
const groupMessage = ref(false)
const timeoutM = ref(300)

</script>

<template>
  <div class="wrapper">
    <div class="section" style="padding-top: 0">
      <h1>规则名称：默认规则</h1>
    </div>
    <div class="section">
      <p class="title">基础设置</p>
      <div class="content">
        <el-checkbox v-model="peopleMessage">监控好友消息</el-checkbox>
        <el-checkbox v-model="groupMessage">监控群消息</el-checkbox>
      </div>
    </div>
    <div class="section">
      <p class="title">接待模式设置</p>
      <div class="content">
        超时释放时长<el-input class="i-el-input" v-model="timeoutM" /> 分钟
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.section {
  padding: 20px;
  border-bottom: 1px solid #E5ECF6;
  h1 {
    font-weight: 400;
    font-size: 20px;
    color: #212121;
  }
  .title {
    font-weight: 400;
    font-size: 18px;
    color: #212121;
    margin-bottom: 20px;
  }
  .content {
    display: flex;
    align-items: center;
    font-weight: 400;
    font-size: 14px;
    color: #212121;
    :deep(.el-input) {
      width: 70px;
      margin: 0 10px;
      .el-input__inner {
        text-align: center;
      }
    }
  }
}
</style>
