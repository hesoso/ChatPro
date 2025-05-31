<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeName = ref('tab1')
const tabMap = {
  'tab1': {
    path: '/workbench/settings/monitor',
  },
  'tab2': {
    path: '/workbench/settings/ignore-group',
  },
  'tab3': {
    path: '/workbench/settings/ignore-people',
  },
  'tab4': {
    path: '/workbench/settings/other-settings',
  }
}

const handleTabChange = (tabName: String) => {
  router.push(tabMap[tabName].path)
}

</script>

<template>
<div>
  <el-tabs v-model="activeName" @tab-change="handleTabChange">
    <el-tab-pane label="指定监控" name="tab1">
    </el-tab-pane>
    <el-tab-pane label="屏蔽群" name="tab2">
    </el-tab-pane>
    <el-tab-pane label="屏蔽人" name="tab3">
    </el-tab-pane>
    <el-tab-pane label="其他设置" name="tab4">
    </el-tab-pane>
  </el-tabs>
  <router-view/>
</div>
</template>

<style scoped lang="scss">
:deep(.el-tabs__nav) {
  padding: 0 15px;
}
</style>
