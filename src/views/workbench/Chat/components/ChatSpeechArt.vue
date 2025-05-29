<script setup lang="ts">
import { ref } from 'vue'
import SearchInput from '@/components/SearchInput.vue'
import { MenuOptions } from '@imengyu/vue3-context-menu'

interface Tree {
  label: string
  children?: Tree[]
}

const handleNodeClick = (data: Tree) => {
  console.log(data)
}

const treeData: Tree[] = [
  {
    label: '一级分组',
    children: [
      {
        label: '一级分组',
        children: [
          {
            label: '一级分组',
          },
        ],
      },
    ],
  },
  {
    label: '一级分组2',
    children: [
      {
        label: '一级分组2',
        children: [
          {
            label: '一级分组2',
          },
        ],
      },
      {
        label: '一级分组2',
        children: [
          {
            label: '一级分组2',
          },
        ],
      },
    ],
  },
  {
    label: '一级分组3',
    children: [
      {
        label: '一级分组3',
        children: [
          {
            label: '一级分组3',
          },
        ],
      },
      {
        label: '一级分组3',
        children: [
          {
            label: '一级分组3',
          },
        ],
      },
    ],
  },
]

const defaultProps = {
  children: 'children',
  label: 'label',
}


const show = ref(false);
const options = ref<MenuOptions>({
  zIndex: 3,
  minWidth: 0,
  x: 500,
  y: 200
});

function onMenuClick() {
  alert('You clicked menu item')
}
function onContextMenu(e : MouseEvent) {
  e.preventDefault();
  //Show component mode menu
  show.value = true;
  options.value.x = e.x;
  options.value.y = e.y;
}



const renderContent = (h, { node, data }) => {
  return h(
    'div',
    {
      class: 'custom-tree-node',
      dataTree: JSON.stringify(data),
      onContextmenu: onContextMenu
    },
    node.label
  )
}

</script>

<template>
  <div class="tab-wrap">
    <div style="height: 27px">
      <SearchInput></SearchInput>
    </div>
    <div class="tag-wrap">
      <el-tag type="primary" style="margin-right: 10px"><span style="margin: 0 10px">新增话术</span></el-tag>
      <el-tag type="primary" style="margin-right: 10px"><span style="margin: 0 10px">新增话术分组</span></el-tag>
      <el-dropdown placement="bottom-end">
        <svg-icon style="font-size: 30px" name="down-blue"></svg-icon>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>共享码</el-dropdown-item>
            <el-dropdown-item>生成共享码</el-dropdown-item>
            <el-dropdown-item>导入共享码</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <div class="tree-wrap">
      <el-tree
        style="max-width: 600px"
        :data="treeData"
        :props="defaultProps"
        :render-content="renderContent"
        @node-click="handleNodeClick"
      />
    </div>
  </div>
  <context-menu
    v-model:show="show"
    :options="options"
  >
    <context-menu-item @click="onMenuClick(0)"><p class="menu-text">编辑话术</p></context-menu-item>
    <context-menu-item @click="onMenuClick(1)"><p class="menu-text red">删除话术</p></context-menu-item>
  </context-menu>
</template>

<style scoped lang="scss">
.tab-wrap {
  padding: 0 16px;
}
.tag-wrap {
  display: flex;
  align-items: center;
  margin-top: 10px;
}
:deep(.el-tag){
  cursor: pointer;
}

</style>
