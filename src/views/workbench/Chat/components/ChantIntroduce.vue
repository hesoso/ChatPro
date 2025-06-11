<script setup lang="ts">
import { ref } from 'vue'
import InputEdit from '@/components/InputEdit.vue'
import SvgIcon from '@/components/SvgIcon.vue'

const switchValue = ref(false)
const switchValue1 = ref(false)

</script>

<template>
  <div class="chat-introduce">
    <div class="avatar-wrap">
      <img src="" alt="">
      <div class="title-wrap">
        <InputEdit value="发单群102"></InputEdit>
      </div>
    </div>
    <p class="title">基本信息</p>
    <div class="gray-box">
      <div class="detail-row">
        <span class="detail-row-label">机器人:</span>
        <div class="detail-row-content"><img src="@/assets/images/qw_.png" alt=""> 杨过</div>
        <div class="detail-row-end">
          <svg-icon name="copy"></svg-icon>
        </div>
      </div>
      <div class="detail-row">
        <span class="detail-row-label">所属群:</span>
        <div class="detail-row-content">1345675678</div>
        <div class="detail-row-end">
          <svg-icon name="copy"></svg-icon>
        </div>
      </div>
      <div class="detail-row">
        <span class="detail-row-label">备注:</span>
        <div class="detail-row-content">
          <InputEdit value="1345675678"></InputEdit>
        </div>
      </div>
      <div class="detail-row">
        <span class="detail-row-label">描述:</span>
        <div class="detail-row-content">
          <InputEdit value="正在输入中"></InputEdit>
        </div>
      </div>
      <div class="detail-row">
        <span class="detail-row-label">微信标签</span>
        <div class="detail-row-end">
          <svg-icon name="edit"></svg-icon>
        </div>
      </div>
      <div class="detail-row">
        <div>
          <el-tag size="small">ECO</el-tag>
          <el-tag size="small">社群宝聊天表</el-tag>
          <el-tag size="small">111111132</el-tag>
          <el-tag size="small">123i4rio23kk</el-tag>
        </div>
      </div>
      <div class="detail-row">
        <span class="detail-row-label">消息免打扰</span>
        <div class="detail-row-end">
          <el-switch v-model="switchValue"></el-switch>
        </div>
      </div>
      <div class="detail-row">
        <span class="detail-row-label">置顶聊天</span>
        <div class="detail-row-end">
          <el-switch v-model="switchValue1"></el-switch>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.title {
  font-weight: 500;
  font-size: 16px;
  color: #3D3D3D;
  margin-bottom: 10px;
}

.chat-introduce {
  padding: 0 16px;

  .avatar-wrap {
    text-align: center;

    img {
      width: 84px;
      height: 84px;
    }
  }

  .title-wrap {
    margin-top: 10px;
  }
}

.svg-icon {
  cursor: pointer;
}

.gray-box {
  padding: 12px;
  background: #F9F9F9;
  font-weight: 400;
  font-size: 12px;
  color: #3D3D3D;
}

.detail-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 32px;
  .detail-row-label {
    margin-right: 10px;
  }

  .detail-row-content {
    flex: 1;
    display: flex;
    align-items: center;

    img {
      width: 14px;
      margin-right: 5px;
    }

    :deep(.input-edit-wrap) {
      width: 100%;
      justify-content: space-between;
      font-size: 12px;
      margin-top: 0;
      .svg-icon{
        font-size: 14px;
      }
      input {
        font-size: 12px;
      }
    }
  }

  .detail-row-end {
    font-size: 14px;
  }

  :deep(.el-switch) {
    height: auto;
  }

  :deep(.el-tag) {
    margin-right: 8px;
    margin-bottom: 8px;
  }
}
</style>
