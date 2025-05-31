<script lang="ts" setup>
import { ref, reactive } from 'vue'
import type { TableInstance } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'

import AddMonitorRobot from '@/views/workbench/Settings/components/AddMonitorRobot.vue'
import AddMonitorGroup from '@/views/workbench/Settings/components/AddMonitorGroup.vue'

const editRow = ref(-1)
const editRowInputValue = ref('')
const editRowHandler = () => {
  editRow.value = 1
}

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
    '是否删除所选机器人？',
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


const showAddRobot = ref(false)
const showAddGroup = ref(false)
</script>

<template>
  <div class="tab-wrap">
    <el-form class="el-form-inline" :inline="true" :model="formInline">
      <el-form-item>
        <el-input v-model="formInline.user" placeholder="机器人分组" />
      </el-form-item>
      <el-form-item>
        <el-select
          style="width: 172px"
          v-model="formInline.region"
          placeholder="在选状态"
          clearable
        >
          <el-option label="Zone one" value="shanghai" />
          <el-option label="Zone two" value="beijing" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="formInline.date"
          type="date"
          placeholder="到期时间"
        />
      </el-form-item>
      <el-form-item>
        <el-input v-model="formInline.user" placeholder="请输入关键字" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="showAddRobot = true">添加</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" @click="open">批量删除</el-button>
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
      <el-table-column align="center" label="序号" width="92">
        <template #default="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column align="center" label="机器人" width="398">
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
      <el-table-column align="center" property="address" label="备注" width="294">
        <template #default="scope">
          <div class="edit-input-wrap">
            <svg-icon name="edit" @click="editRowHandler" />
            <el-input v-if="editRow === 1" v-model="editRowInputValue"></el-input>
            <span v-else>点击编辑备注</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" property="address" label="操作" width="295">
        <template #default="scope">
          <div class="link" @click="showAddGroup = true">监控全部群</div>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <!-- 添加机器人 -->
  <AddMonitorRobot v-if="showAddRobot" v-model="showAddRobot"></AddMonitorRobot>
  <!-- 添加监控群 -->
  <AddMonitorGroup v-if="showAddGroup" v-model="showAddGroup"></AddMonitorGroup>
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

</style>
