<script setup lang="ts">
import { showContextMenu } from '@/components/ContextMenu'
import { ElCheckbox } from 'element-plus'

const props = defineProps({
  selectmode: Boolean
})

interface Tree {
  label: string
  children?: Tree[]
}

function onContextMenu(e: MouseEvent) {
  e.preventDefault()
  showContextMenu({
    event: e,
    menuList: [{
      label: '编辑话术',
      onClick: () => {
      }
    }, {
      label: '删除话术',
      textType: 'danger',
      onClick: () => {
      }
    }]
  })
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
            label: '一级分组'
          }
        ]
      }
    ]
  },
  {
    label: '一级分组2',
    children: [
      {
        label: '一级分组2',
        children: [
          {
            label: '一级分组2'
          }
        ]
      },
      {
        label: '一级分组2',
        children: [
          {
            label: '一级分组2'
          }
        ]
      }
    ]
  },
  {
    label: '一级分组3',
    children: [
      {
        label: '一级分组3',
        children: [
          {
            label: '一级分组3'
          }
        ]
      },
      {
        label: '一级分组3',
        children: [
          {
            label: '一级分组3'
          }
        ]
      }
    ]
  }
]

const defaultProps = {
  children: 'children',
  label: 'label'
}

const handlerTreeCheckbox = (flag, data) => {
}

const renderTreeContent = (h, node, data) => {
  const checkboxChange = (flag: boolean) => {
    handlerTreeCheckbox(flag, data)
  }
  const nodeList = [
    h('span', node.label),
  ]
  nodeList.unshift(h('span', {class: 'tree-label'}, '2核4G'))
  if (props.selectmode) {
    nodeList.unshift(h(ElCheckbox, {style: {marginRight: '6px'}, onChange: checkboxChange}, null))
  }
  return  nodeList
}

const renderContent = (h, { node, data }) => {
  return h(
    'div',
    {
      class: 'custom-tree-node layout-qz',
      dataTree: JSON.stringify(data),
      onContextmenu: onContextMenu
    },
    renderTreeContent(h, node, data)
  )
}
</script>

<template>
  <el-tree
    style="max-width: 600px"
    :data="treeData"
    :props="defaultProps"
    :render-content="renderContent"
    @node-click="handleNodeClick"
  />
</template>

<style scoped lang="scss">

</style>
