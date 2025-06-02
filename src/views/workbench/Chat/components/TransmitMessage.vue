<script setup lang="ts">
import { ref } from 'vue'
import SearchInput from '@/components/SearchInput.vue'
import { ElMessageBox } from 'element-plus'

defineProps({
  modelValue: Boolean
})
const emits = defineEmits(['update:modelValue'])

const showHistoryMessage = ref(false)


const handleTransmit = () => {
  ElMessageBox.confirm(
    '是否确认转发？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    }
  )
    .then(() => {
      emits('update:modelValue', false)
    })
    .catch(() => {

    })
}

</script>

<template>
  <el-dialog :model-value="modelValue" width="590" title="请选择转发对象"
             @update:modelValue="emits('update:modelValue')">
    <div class="dialog-content">
      <div class="dialog-content-left flex-col">
        <div class="search-input-wrap">
          <SearchInput placeholder="请输入机器人WXID或昵称"></SearchInput>
        </div>
        <ul class="list-wrap scroll">
          <li class="list-item" v-for="item in 30">
            <div class="layout-lc">
              <el-checkbox></el-checkbox>
              <img class="avatar" src="" alt="">
              <span class="title">青春没有售价</span>
            </div>
          </li>
        </ul>
      </div>
      <div class="dialog-content-right flex-col">
        <div class="flex-col">
          <span class="link">分别转发给</span>
          <ul class="list-wrap scroll">
            <li class="list-item" v-for="item in 5">
              <div class="layout-slide">
                <div class="layout-lc">
                  <img class="avatar" src="" alt="">
                  <span class="title">青春没有售价</span>
                </div>
                <svg-icon name="close"/>
              </div>
            </li>
          </ul>
        </div>
        <div class="bottom-wrap">
          <el-tag @click="showHistoryMessage = true">[逐条转发]杨过和百灵鸟的聊天记录</el-tag>
          <div class="layout-slide mt10">
            <el-button @click="emits('update:modelValue', false)"><span class="btn-text-margin">取消</span></el-button>
            <el-button type="primary" @click="handleTransmit"><span class="btn-text-margin">转发</span></el-button>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>

  <el-dialog v-model="showHistoryMessage" title="全部消息的聊天记录" width="496">
    <div class="flex-col h600">
      <p class="time-text">2024-11-28 ~ 2025-11-28</p>
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
</style>
