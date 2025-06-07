<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage, type FormInstance } from 'element-plus'
import { showContextMenu } from '@/components/ContextMenu'

const emits = defineEmits(['select'])

const navList = ref([{
  name: '暗中观察'
}, {
  name: '可爱'
}, {
  name: '柴犬'
}, {
  name: '摇一摇'
}, {
  name: '我要'
}, {
  name: '在'
}, {
  name: '点赞'
}, {
  name: '举手'
}])

const handleSelect = (item) => {
  emits('select', item)
}

</script>

<template>
  <div class="collect-box" id="mx-menu-default-container">
    <div style="padding-right: 10px; overflow: hidden;">
      <ul class="layout-qz bottom-wrap">
        <li class="tag-item" :data-index="index" v-for="(item, index) in navList">
          <el-tag :type="index === 0 ? 'primary' : 'info'">
            <span style="user-select: none">{{ item.name}}</span>
          </el-tag>
        </li>
      </ul>
    </div>
    <ul class="collect-list scroll">
      <li class="collect-item" v-for="item in 22" @click="handleSelect(item)">
        <img src="" alt="">
      </li>
    </ul>
  </div>
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
    width: 72px;
    height: 72px;
    margin: 5px 5px 0 0;
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
  overflow: auto;
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
