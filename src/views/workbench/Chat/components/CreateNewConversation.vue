<script setup lang="ts">
import { ref } from 'vue'
import SearchInput from '@/components/SearchInput.vue'
import type { TableInstance } from 'element-plus'
import CreateNewConversationConfirm from '@/views/workbench/Chat/components/CreateNewConversationConfirm.vue'

defineProps({
  modelValue: Boolean
})
const emits = defineEmits(['update:modelValue'])
const curIndex = ref(1)
const showCreateNewConversationConfirm = ref(false)

const activeTabName = ref('好友')
const handleTabChange = (tabName) => {
  activeTabName.value = tabName
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

interface User {
  id: number
  date: string
  name: string
  address: string
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
  }
]

</script>

<template>
  <el-dialog :model-value="modelValue" width="654" title="新建会话" @update:modelValue="emits('update:modelValue')">
    <div class="dialog-content">
      <div class="dialog-content-left">
        <div class="search-input-wrap">
          <SearchInput></SearchInput>
        </div>
        <div class="list-wrap scroll">
          <div class="avatar-box avatar-box-full" :class="[{active: item === curIndex}]" v-for="item in 20" @click="curIndex = item">
            <img src="" alt="">
            <div class="content">
              <p class="title">名字29999000 <span class="text">企微</span></p>
              <p class="text">12488888888888888</p>
            </div>
          </div>
        </div>
      </div>
      <div class="dialog-content-right">
        <el-tabs v-model="activeTabName" @tab-change="handleTabChange" style="width:90px">
          <el-tab-pane label="好友" name="好友">
          </el-tab-pane>
          <el-tab-pane label="群" name="群">
          </el-tab-pane>
        </el-tabs>
        <div class="search-input-wrap" style="margin: 0;width: 100%;">
          <SearchInput></SearchInput>
          <el-button type="primary" style="margin-left: 20px">同步{{activeTabName}}</el-button>
        </div>
        <el-table
          ref="multipleTableRef"
          class="right-table"
          :border="true"
          :data="tableData"
          row-key="id"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column align="center" type="selection" :selectable="selectable" width="55" />
          <el-table-column align="center" label="好友信息">
            <template #default="scope">
              <div class="avatar-box">
                <img src="" alt="">
                <div class="content">
                  <p class="title">名字29999000 <span class="link">(备注)</span></p>
                  <p class="text">12488888888888888</p>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="table-bottom-btn">
          <el-button @click="emits('update:modelValue', false)">取消</el-button>
          <el-button type="primary" @click="showCreateNewConversationConfirm = true">下一页</el-button>
        </div>
      </div>
    </div>
  </el-dialog>

  <CreateNewConversationConfirm v-if="showCreateNewConversationConfirm" v-model="showCreateNewConversationConfirm"></CreateNewConversationConfirm>
</template>

<style scoped lang="scss">
.dialog-content {
  display: flex;
  padding-bottom: 20px;

  .dialog-content-left {
    width: 296px;
    border-right: 1px solid #E5E5E5;
  }

  .dialog-content-right {
    width: 357px;
    padding: 0 30px;
  }
}

.search-input-wrap {
  width: 227px;
  height: 30px;
  margin: 10px auto;
  display: flex;
  align-items: center;
}

.avatar-box-full {
  padding: 5px 36px 5px 36px;
  justify-content: flex-start;

  &.active {
    background: #E1EDFF;
  }

  .content {
    width: 100%;
  }

  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;

    .text {
      margin-top: 0;
    }
  }
}

.list-wrap {
  height: 500px;
  overflow-y: auto;
}

:deep(.el-tabs__nav-wrap::after) {
  display: none;
}

.right-table {
  margin: 15px 0;
  height: 410px;
}

.table-bottom-btn {
  text-align: center;
}

</style>
