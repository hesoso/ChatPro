<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage, type FormInstance } from 'element-plus'
import { showContextMenu } from '@/components/ContextMenu'

const emits = defineEmits(['select'])

const curEditIndex = ref(-1)
const editInputValue = ref('默认分组')
const showDialog = ref(false)

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


const onContextMenu = (e) => {
  const { index } = e.currentTarget.dataset
  const event = { x: e.x - 400, y: e.y - 350 }
  showContextMenu({
    event,
    menuList: [{
      label: '重新命名',
      onClick: (e) => {
        curEditIndex.value = Number(index)
      }
    }, {
      label: '删除分组',
      textType: 'danger',
      onClick: () => {

      }
    }]
  })
}

const handleEditInputBlur = (e) => {
  curEditIndex.value = -1
}

const handleSelect = (item) => {
  emits('select', item)
}

</script>

<template>
  <div class="collect-box" id="mx-menu-default-container">
    <ul class="collect-list scroll">
      <li class="collect-item" v-for="item in 22" @click="handleSelect(item)">
        <img src="" alt="">
      </li>
      <li class="collect-item layout-rc add">
        <el-upload>
          <div class="upload-inner">
            <svg-icon style="font-size: 30px;" name="add-gray"></svg-icon>
            <p style="font-size: 12px;">点击/拖拽上传</p>
          </div>
        </el-upload>
      </li>
    </ul>
    <div class="bottom-wrap layout-slide">
      <ul class="layout-qz">
        <li class="tag-item" :data-index="index" v-for="(item, index) in 3" @contextmenu="onContextMenu">
          <el-tag>
            <input v-if="curEditIndex === index" v-model="editInputValue" class="edit-input"
                   @blur="handleEditInputBlur" />
            <span v-else style="user-select: none">默认分组</span>
          </el-tag>
        </li>
      </ul>
      <svg-icon style="font-size: 22px;cursor: pointer" name="add-blue" @click="showDialog = true"></svg-icon>
    </div>
  </div>

  <el-dialog v-model="showDialog" title="新增话术分组" width="360" :zIndex="4000">
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      label-width="auto"
      style="margin: 20px 60px;"
    >
      <el-form-item label="表情分组名称" prop="name">
        <el-input class="input" v-model="ruleForm.name" placeholder="请输入" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="layout-rc" style="padding-bottom: 20px">
        <el-button @click="showDialog = false"><span class="btn-text-margin">取消</span></el-button>
        <el-button type="primary"><span class="btn-text-margin">确定</span></el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.collect-box {
  width: 483px;
  height: 342px;
  background: #fff;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.1);
  border-radius: 10px 10px 10px 10px;
  padding: 6px;
  padding-right: 0px;
  display: flex;
  flex-direction: column;
  position: relative;
}

.collect-list {
  display: flex;
  flex-wrap: wrap;
  flex: 1;
  min-height: 0;
  overflow: auto;

  .collect-item {
    width: 87px;
    height: 87px;
    margin: 6px 6px 0 0;
    cursor: pointer;

    &.add {
      background: #E8E8E8;
      padding: 4px;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}

.bottom-wrap {
  height: 30px;
  padding-right: 10px;
}

.tag-item {
  margin-right: 10px;
}

.edit-input {
  outline: none;
  width: 80px;
  background: transparent;
  border: none;
  text-align: center;
  font-size: 13px;
}

.upload-inner {
  text-align: center;

  p {
    color: #8c8c8c;
  }
}
</style>
