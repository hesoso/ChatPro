<script lang="ts" setup>
import { ref, reactive } from 'vue'
import type { TableInstance } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'

import AddIgnorePeople from '@/views/workbench/Settings/components/AddIgnorePeople.vue'


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

const open = () => {
  ElMessageBox.confirm(
    '是否删除所选屏蔽人？',
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
    }
  )
    .then(() => {
      ElMessage({
        type: 'success',
        message: 'Delete completed',
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Delete canceled',
      })
    })
}


const showAddGroup = ref(false)
const showImportJSON = ref(false)
</script>

<template>
  <div class="tab-wrap">
    <el-form class="el-form-inline" :inline="true" :model="formInline">
      <el-form-item>
        <el-input v-model="formInline.user" placeholder="请输入关键字" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="showAddGroup = true">添加</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" @click="open">批量删除</el-button>
      </el-form-item>
      <el-form-item>
        <el-dropdown  split-button type="primary">
          导出/导入
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>JSON导出</el-dropdown-item>
              <el-dropdown-item  @click="showImportJSON = true">JSON导入</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-form-item>
      <el-form-item>
        <el-button>指令词屏蔽</el-button>
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
      <el-table-column align="center" label="屏蔽人" width="600">
        <template #default="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column align="center" property="address" label="添加时间">
        <template #default="scope">
          <div>2024-12-13 00:12:13</div>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <!-- 添加监控群 -->
  <AddIgnorePeople v-if="showAddGroup" v-model="showAddGroup"></AddIgnorePeople>
  <!-- 导入屏蔽群 -->
  <el-dialog class="i-dialog" v-model="showImportJSON" width="378">
    <template #header>
      <div style="text-align: center">JSON导入屏蔽群</div>
    </template>
    <textarea class="JSONText" placeholder="请将本平台导出的JSON格式复制到此处"></textarea>
    <template #footer>
      <div class="dialog-footer">
        <el-button size="default"><span style="margin: 0 10px">取消</span></el-button>
        <el-button type="primary" size="default"><span style="margin: 0 10px">确定</span></el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.tab-wrap {
  padding: 0 60px;
}

.edit-input-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;

  .svg-icon {
    font-size: 20px;
  }

  .el-input {
    width: 140px;
    margin-left: 10px;
  }
}

.link {
  color: #3686FF;
  cursor: pointer;
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
.JSONText {
  width: 312px;
  height: 227px;
  border: none;
  outline: none;
  background: #F6F6F6;
  display: block;
  margin: 0 auto;
  resize: none;
  padding: 10px;
}
:deep(.i-dialog .el-dialog__header) {
  border-bottom: none !important;
}
</style>
