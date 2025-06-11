<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { TableInstance } from 'element-plus'

defineProps({
  modelValue: Boolean
})
const emits = defineEmits(['update:modelValue'])

interface User {
  id: number
  date: string
  name: string
  address: string
}

const multipleTableRef = ref<TableInstance>()
const multipleSelection = ref<User[]>([])

const selectable = (row: User) => ![1, 2].includes(row.id)
const toggleSelection = (rows?: User[], ignoreSelectable?: boolean) => {
  if (rows) {
    rows.forEach((row) => {
      multipleTableRef.value!.toggleRowSelection(
        row,
        undefined,
        ignoreSelectable
      )
    })
  } else {
    multipleTableRef.value!.clearSelection()
  }
}
const handleSelectionChange = (val: User[]) => {
  multipleSelection.value = val
}

const tableData: User[] = [
  {
    id: 1,
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    id: 2,
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    id: 3,
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    id: 4,
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    id: 5,
    date: '2016-05-08',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    id: 6,
    date: '2016-05-06',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    id: 7,
    date: '2016-05-07',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  }
]


const formInline = reactive({
  user: '',
  region: '',
  date: ''
})


const onSubmit = () => {
  console.log('submit!')
}


</script>

<template>
  <el-dialog
    :model-value="modelValue"
    width="638"
    title="添加机器人"
    @update:modelValue="emits('update:modelValue')"
  >
    <div class="dialog-content">
      <el-form class="el-form-inline" :inline="true" :model="formInline">
        <el-form-item>
          <el-input v-model="formInline.user" placeholder="机器人分组" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="formInline.user" placeholder="请输入关键字" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit"><span style="margin: 0 15px">查询</span></el-button>
        </el-form-item>

      </el-form>
      <el-table
        ref="multipleTableRef"
        :border="true"
        :data="tableData"
        row-key="id"

        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column align="center" type="selection" :selectable="selectable" width="55" />
        <el-table-column align="center" label="机器人">
          <template #default="scope">
            <div class="avatar-box">
              <img src="" alt="">
              <div class="content">
                <p>名字29999000</p>
                <p class="text">12488888888888888</p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" property="address" label="添加状态">
          <template #default="scope">
            <div>已添加</div>
          </template>
        </el-table-column>
        <el-table-column align="center" property="address" label="在线状态">
          <template #default="scope">
            <div class="link">在线</div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button style="margin-right: 20px" @click="emits('update:modelValue', false)"><span style="margin: 0 10px">取消</span></el-button>
        <el-button type="primary" size="default"><span style="margin: 0 10px">添加</span></el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.dialog-content {
  padding: 15px;
  text-align: center;
}
.avatar-box {
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 34px;
    height: 34px;
    border-radius: 6px 6px 6px 6px;
    margin-right: 10px;
  }

  .content {
    font-size: 14px;
    color: #212121;
    line-height: 14px;

    .text {
      font-weight: 400;
      font-size: 10px;
      color: #999999;
      margin-top: 10px;
    }
  }
}
</style>
