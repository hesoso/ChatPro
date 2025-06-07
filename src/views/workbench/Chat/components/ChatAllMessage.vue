<script setup lang="ts">
import { ref } from 'vue'
import { ElMessageBox } from 'element-plus'

defineProps({
  modelValue: Boolean
})
const emits = defineEmits(['update:modelValue'])

</script>

<template>

  <el-dialog :model-value="modelValue" title="全部消息"
             @update:modelValue="emits('update:modelValue')" width="496">
    <div class="flex-col h600">
      <div class="search-input-wrap">
        <SearchInput></SearchInput>
      </div>
      <ul class="list-wrap scroll">
        <li class="message-item layout-qz" v-for="item in 30">
          <img class="avatar" src="" alt="">
          <div class="flex-col">
            <div class="sub-text layout-slide"><span>青春没有售价</span><span>2025-01-11 23:46</span></div>
            <p class="text">普通的客服系统咋打不开了呢</p>
          </div>
        </li>
      </ul>
    </div>
  </el-dialog>
</template>

<style scoped lang="scss">
.dialog-content {
  display: flex;
  padding-bottom: 20px;
  height: 450px;

  .dialog-content-left {
    flex: 1;
    flex-shrink: 0;
    border-right: 1px solid #E5E5E5;
    height: 100%;
  }

  .dialog-content-right {
    flex: 1;
    flex-shrink: 0;
    height: 100%;
  }
}

.search-input-wrap {
  width: 235px;
  height: 30px;
  margin: 10px auto;
  display: flex;
  align-items: center;
}

.avatar-box-full {
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

:deep(.el-tabs__nav-wrap::after) {
  display: none;
}

.right-table {
  margin: 15px 0;
  height: 410px;
}

.table-bottom-btn {
  text-align: center;
}

.list-item {
  padding: 8px 0;
  margin: 0 28px;
  border-bottom: 1px solid #EEEEEE;

  .avatar {
    height: 30px;
    width: 30px;
    border-radius: 6px;
    margin: 0 10px;
  }

  .text {
    font-weight: 400;
    font-size: 14px;
    color: #212121;
  }
}

.flex1 {
  flex: 1;
}

.list-wrap {
  flex: 1;
  min-height: 0;
  overflow: auto;
}

.flex-col {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.link {
  padding: 10px 28px;
}

.bottom-wrap {
  border-top: 1px solid #E5E5E5;
  padding: 10px 28px 0;
}

.mt10 {
  margin-top: 10px;
}

.time-text {
  text-align: center;
  padding: 14px 0;
}

.message-item {
  margin: 0 25px;
  padding: 12px 0;
  border-bottom: 1px solid #DCDCDC;

  .avatar {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    margin-right: 8px;
  }

  .sub-text {
    font-weight: 400;
    font-size: 12px;
    color: #999999;
  }

  .text {
    margin-top: 5px;
    font-weight: 400;
    font-size: 14px;
    color: #212121;
  }
}

.h600 {
  height: 600px;
}

.search-input-wrap {
  width: 100%;
  padding: 0 25px;
}
</style>
