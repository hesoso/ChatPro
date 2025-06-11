<script setup lang="ts">
defineProps({
  modelValue: Boolean
})
const emits = defineEmits(['update:modelValue', 'new-group'])


import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

interface RuleForm {
  name: string
  region: string
  count: string
  date1: string
  date2: string
  delivery: boolean
  location: string
  type: string[]
  resource: string
  desc: string
}

const typeList = ref([{
  name: '文本'
}, {
  name: '图片'
}, {
  name: '视频'
}, {
  name: '表情'
}, {
  name: '语音'
}, {
  name: '名片'
}, {
  name: '连接'
}, {
  name: '小程序'
}, {
  name: '视频号'
}])

const curType = ref('文本')

const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
  name: '',
  region: '',
  count: '',
  date1: '',
  date2: '',
  delivery: false,
  location: '',
  type: [],
  resource: '',
  desc: ''
})


const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
    } else {
      console.log('error submit!', fields)
    }
  })
}


</script>

<template>
  <el-dialog :model-value="modelValue" title="新增话术" width="562" @update:modelValue="emits('update:modelValue')">
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      label-width="auto"
      style="margin: 20px 60px;"
    >
      <el-form-item label="消息标题：" prop="name">
        <el-input class="input" v-model="ruleForm.name" placeholder="请输入消息标题，可留空" />
      </el-form-item>
      <el-form-item label="话术分组：" prop="region">
        <div class="layout-qz" style="width: 100%">
          <el-select class="input" v-model="ruleForm.region" placeholder="请选择话术分组">
            <el-option label="Zone one" value="shanghai" />
            <el-option label="Zone two" value="beijing" />
          </el-select>
          <span class="link flex-shrink" style="margin-left: 10px" @click="emits('new-group')">新增话术分组</span>
        </div>
      </el-form-item>
      <el-form-item label="消息内容：" prop="name" label-position="top">
        <div class="message-content">
          <ul class="message-type-list">
            <li class="message-type-item" :class="{active: curType === item.name}" v-for="item in typeList"
                @click="curType = item.name">{{ item.name }}
            </li>
          </ul>
          <div class="message-inner">
            <textarea placeholder="请输入消息内容"></textarea>
          </div>
        </div>
      </el-form-item>

    </el-form>
    <template #footer>
      <div class="layout-rc" style="padding-bottom: 20px">
        <el-button @click="emits('update:modelValue', false)"><span class="btn-text-margin">取消</span></el-button>
        <el-button type="success"><span>保存并继续</span></el-button>
        <el-button type="primary"><span>保存并关闭</span></el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.flex-shrink {
  flex-shrink: 0;
}

.message-content {
  width: 100%;
  height: 140px;
  position: relative;
  padding-top: 20px;

  .message-type-list {
    display: flex;
    width: 100%;
    height: 34px;
    position: absolute;
    left: 0;
    top: 0;
    line-height: 1;

    .message-type-item {
      width: 50px;
      background: #FFFFFF;
      color: #8F959E;
      font-weight: 400;
      font-size: 13px;
      padding: 4px;
      text-align: center;
      border-radius: 7px;
      cursor: pointer;

      &.active {
        background: $cp-main-color;
        color: #fff;
      }
    }
  }

  .message-inner {
    width: 100%;
    height: 100%;
    border-radius: 7px 7px 7px 7px;
    border: 1px solid #EBEBEB;
    padding: 10px;
    position: relative;
    z-index: 1;
    background-color: #fff;

    textarea {
      border: none;
      outline: none;
      width: 100%;
      height: 100%;
      resize: none;
    }
  }
}
</style>
