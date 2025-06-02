<script setup lang="ts">
import { ElMessageBox } from 'element-plus'
import { ref } from 'vue'
import SearchInput from '@/components/SearchInput.vue'
import ChatSpeechArtTree from '@/views/workbench/Chat/components/ChatSpeechArtTree.vue'

defineProps({
  modelValue: Boolean
})
const emits = defineEmits(['update:modelValue'])

const showSuccess = ref(false)

</script>

<template>
  <el-dialog :model-value="modelValue" title="共享码" width="497" @update:modelValue="emits('update:modelValue')">
    <div class="layout-sc" style="margin: 14px 60px">
      <div class="search-input-wrap">
        <SearchInput></SearchInput>
      </div>
      <div class="tree-wrap scroll">
        <ChatSpeechArtTree selectmode></ChatSpeechArtTree>
      </div>
    </div>
    <div class="dialog-footer">
      <el-button @click="emits('update:modelValue', false)"><span class="btn-text-margin">取消</span></el-button>
      <el-button type="primary" @click="showSuccess = true">生成共享码</el-button>
    </div>
  </el-dialog>
  <!-- 生成成功 -->
  <el-dialog v-model="showSuccess" title="成功生成" width="558">
    <p class="font14-6" style="margin: 20px auto 8px">请复制以下共享码，即可使用该共享码进行克隆</p>
    <div class="code-wrap layout-cc">
      <p class="code">4glx6x</p>
      <p class="font14-6" style="margin: 10px auto">点击设备吗进行复制</p>
    </div>
    <div class="dialog-footer">
      <el-button @click="showSuccess = false"><span class="btn-text-margin">取消</span></el-button>
      <el-button type="primary" @click="emits('update:modelValue', false)"><span class="btn-text-margin">确定</span></el-button>
    </div>
  </el-dialog>
</template>

<style scoped lang="scss">
.search-input-wrap {
  height: 30px;
  width: 100%;
}

.tree-wrap {
  width: 100%;
  height: 400px;
  overflow: auto;
  margin-top: 14px;
}

.dialog-footer {
  border-top: 1px solid #E5E5E5;
}
.font14-6 {
  font-weight: 400;
  font-size: 14px;
  color: #666666;
  text-align: center;
}
.code-wrap {
  width: 348px;
  height: 138px;
  background: #F5F5F5;
  border-radius: 4px 4px 4px 4px;
  margin: 0 auto 20px;
  .code {
    font-weight: 500;
    font-size: 32px;
    color: #3686FF;
  }
}
</style>
