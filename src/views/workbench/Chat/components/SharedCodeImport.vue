<script setup lang="ts">
defineProps({
  modelValue: Boolean
})
const emits = defineEmits(['update:modelValue', 'addGroup'])


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

const handlerAddGroup  = () => {
  emits('update:modelValue', false)
  emits('addGroup')
}
</script>

<template>
  <el-dialog :model-value="modelValue" title="导入共享码" width="360" @update:modelValue="emits('update:modelValue')">
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      label-width="auto"
      style="margin: 20px 60px;"
    >
      <el-form-item label="输入共享码" prop="name">
        <el-input class="input" v-model="ruleForm.name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="选择分组" prop="region">
        <div style="width: 100%">
          <el-select class="input" v-model="ruleForm.region" placeholder="请选择归属分组">
            <el-option label="Zone one" value="shanghai" />
            <el-option label="Zone two" value="beijing" />
          </el-select>
          <p class="link" @click="handlerAddGroup">添加分组</p>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="layout-rc" style="padding-bottom: 20px">
        <el-button @click="emits('update:modelValue', false)"><span class="btn-text-margin">取消</span></el-button>
        <el-button type="primary"><span class="btn-text-margin">确定</span></el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">

</style>
