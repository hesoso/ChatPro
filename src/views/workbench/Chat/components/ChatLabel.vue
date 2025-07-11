<script setup lang="ts">
import { ElMessageBox } from 'element-plus'
import SearchInput from '@/components/SearchInput.vue'

defineProps({
  modelValue: Boolean
})
const emits = defineEmits(['update:modelValue'])

interface User {
  date: string
  name: string
  address: string
}
const tableData: User[] = [
  {
    date: '2016-05-04',
    name: 'Aleyna Kutzner',
    address: 'Lohrbergstr. 86c, Süd Lilli, Saarland',
  },
  {
    date: '2016-05-03',
    name: 'Helen Jacobi',
    address: '760 A Street, South Frankfield, Illinois',
  },
  {
    date: '2016-05-02',
    name: 'Brandon Deckert',
    address: 'Arnold-Ohletz-Str. 41a, Alt Malinascheid, Thüringen',
  },
  {
    date: '2016-05-01',
    name: 'Margie Smith',
    address: '23618 Windsor Drive, West Ricardoview, Idaho',
  },
  {
    date: '2016-05-04',
    name: 'Aleyna Kutzner',
    address: 'Lohrbergstr. 86c, Süd Lilli, Saarland',
  },
  {
    date: '2016-05-03',
    name: 'Helen Jacobi',
    address: '760 A Street, South Frankfield, Illinois',
  },
  {
    date: '2016-05-02',
    name: 'Brandon Deckert',
    address: 'Arnold-Ohletz-Str. 41a, Alt Malinascheid, Thüringen',
  },
  {
    date: '2016-05-01',
    name: 'Margie Smith',
    address: '23618 Windsor Drive, West Ricardoview, Idaho',
  },
  {
    date: '2016-05-04',
    name: 'Aleyna Kutzner',
    address: 'Lohrbergstr. 86c, Süd Lilli, Saarland',
  },
  {
    date: '2016-05-03',
    name: 'Helen Jacobi',
    address: '760 A Street, South Frankfield, Illinois',
  },
  {
    date: '2016-05-02',
    name: 'Brandon Deckert',
    address: 'Arnold-Ohletz-Str. 41a, Alt Malinascheid, Thüringen',
  },
  {
    date: '2016-05-01',
    name: 'Margie Smith',
    address: '23618 Windsor Drive, West Ricardoview, Idaho',
  },
]

const delHandler = () => {
  ElMessageBox.confirm(
    '是否删除该标签？',
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
<el-dialog :model-value="modelValue" title="编辑微信标签" width="638" @update:modelValue="emits('update:modelValue')">
  <div style="margin: 20px 50px;height: 40px">
    <SearchInput placeholder="请输入微信标签名称"></SearchInput>
  </div>
  <div class="layout-slide" style="margin: 20px 50px;">
    <span class="link">新增微信标签</span>
    <span class="link">批量设置微信标签</span>
    <span class="link">批量取消微信标签</span>
    <span class="link">批量删除微信标签</span>
  </div>
  <div style="margin: 20px 50px;max-height: 400px">
    <el-table :data="tableData" border  height="350">
      <el-table-column align="center" type="selection" width="55"  />
      <el-table-column align="center" label="微信标签ID">
        <template #default="scope">5r6zy</template>
      </el-table-column>
      <el-table-column align="center" property="name" label="微信标签名称">
        <template #default="scope">重要</template>
      </el-table-column>
      <el-table-column align="center" property="address" label="操作">
        <template #default="scope"><span class="red" @click="delHandler">删除</span></template>
      </el-table-column>
    </el-table>
  </div>
  <div class="dialog-footer">
    <el-button type="primary" @click="emits('update:modelValue', false)"><span class="btn-text-margin">关闭</span></el-button>
  </div>
</el-dialog>
</template>

<style scoped lang="scss">

</style>
