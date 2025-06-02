<script setup lang="ts">
import { ElMessageBox } from 'element-plus'

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
    '是否确认删除该共享码？',
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
<el-dialog :model-value="modelValue" title="共享码" width="702" @update:modelValue="emits('update:modelValue')">
  <div style="margin: 20px 50px;max-height: 400px">
    <el-table :data="tableData" border  height="350">
      <el-table-column align="center" type="index" width="55" label="序号" />
      <el-table-column align="center" label="共享码">
        <template #default="scope">5r6zy</template>
      </el-table-column>
      <el-table-column align="center" property="name" label="创建时间">
        <template #default="scope">2024-11-20 11:11:32</template>
      </el-table-column>
      <el-table-column align="center" property="address" label="操作">
        <template #default="scope"><span class="red" @click="delHandler">操作</span></template>
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
