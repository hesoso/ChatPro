<script setup lang="ts">
import { ref } from 'vue'

defineProps({
  modelValue: Boolean
})
const emits = defineEmits(['update:modelValue'])


const textareaValue = ref('')

const showMore = ref(false)


</script>

<template>
  <el-dialog :model-value="modelValue" width="477" title="确认创建会话" @update:modelValue="emits('update:modelValue')">
    <div class="dialog-content">
      <p class="title">即将创建下一会话对象</p>
      <div class="label-wrap">
        <div class="label-item ellipsis">ECO客服</div>
        <div class="label-item ellipsis">枝桠枝桠枝桠枝</div>
        <div class="label-item ellipsis">枝桠（备注）</div>
        <div class="label-item" style="padding: 8px" @mouseover="showMore = true">...</div>
      </div>
      <p class="title">创建会话时留言</p>
      <textarea class="textarea" v-model="textareaValue"></textarea>

      <!-- 查看更多 -->
      <div v-if="showMore" class="more-overlay scroll" @mouseleave="showMore = false">
        <div class="label-item ellipsis" v-for="item in 10">ECO客服</div>
      </div>
    </div>
    <template #footer>
      <div class="i-dialog-footer">
        <el-button @click="emits('update:modelValue')">取消</el-button>
        <el-button type="primary">确认创建会话</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.dialog-content {
  padding: 20px 30px;
  padding-bottom: 0;
  position: relative;
  .title {
    font-weight: 400;
    font-size: 14px;
    color: #666666;
    margin-bottom: 10px;
  }
  .label-wrap {
    display: flex;
    margin-bottom: 10px;

  }
}
.label-item {
  height: 34px;
  max-width: 134px;
  padding: 8px 18px;
  font-weight: 400;
  font-size: 14px;
  color: #333333;
  background: #E7EFFC;
  margin-right: 10px;
  border-radius: 6px;
  text-align: center;
}
.textarea {
  padding: 10px;
  height: 93px;
  border-radius: 10px;
  width: 100%;
  margin-bottom: 10px;
}
.i-dialog-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 20px;
}
.more-overlay {
  width: 338px;
  height: 138px;
  background: rgba(0,0,0,0.4);
  box-shadow: 0px 4px 10px 0px rgba(0,0,0,0.1);
  border-radius: 7px 7px 7px 7px;
  padding: 8px;
  position: absolute;
  top: 45px;
  right: 40px;
  overflow: auto;
  display: flex;
  flex-wrap: wrap;
  .label-item {
    margin-bottom: 10px;
    margin-right: 10px;
  }
}
</style>
