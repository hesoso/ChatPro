<script setup lang="ts">

import { computed, ref } from 'vue'
import { MenuOptions } from '@imengyu/vue3-context-menu'

const props = defineProps({
  index: {
    type: Number,
    required: true,
  },
})

const fromMe = computed(() => props.index % 7 === 0)



const show = ref(false);
const options = ref<MenuOptions>({
  zIndex: 3,
  minWidth: 0,
  x: 500,
  y: 200
});

function onMenuClick() {
  alert('You clicked menu item ' + props.conversation)
}
function onContextMenu(e : MouseEvent) {
  e.preventDefault();
  //Show component mode menu
  show.value = true;
  options.value.x = e.x;
  options.value.y = e.y;
}


</script>

<template>
<div class="message-item" :class="[{'from-me': fromMe}]">
  <div class="avatar-wrap">
    <img src="" alt="">
  </div>
  <div class="message-content" @contextmenu="onContextMenu">
    <div class="title-wrap">
      <span class="title">小七</span>
    </div>
    <div class="message-text">你好，在吗？</div>
  </div>
  <div class="status-wrap">
    <svg-icon name="error"></svg-icon>
  </div>
</div>


  <context-menu
    v-model:show="show"
    :options="options"
  >
    <context-menu-item @click="onMenuClick(0)"><p class="menu-text">复制</p></context-menu-item>
    <context-menu-item @click="onMenuClick(1)"><p class="menu-text">复制消息</p></context-menu-item>
    <context-menu-item @click="onMenuClick(2)"><p class="menu-text">多选</p></context-menu-item>
    <context-menu-item @click="onMenuClick(2)"><p class="menu-text">转发</p></context-menu-item>
  </context-menu>
</template>

<style scoped lang="scss">
.message-item {
  display: flex;
  .avatar-wrap {
    padding: 0 8px 0 18px;
    img {
      width: 34px;
      height: 34px;
      border-radius: 50%;
    }
  }
  .title-wrap {
    font-weight: 400;
    font-size: 11px;
    color: #212121;
  }
}
.message-text {
  height: 30px;
  background: #FFFFFF;
  border-radius: 6px 6px 6px 6px;
  color: #212121;
  font-size: 14px;
  padding: 7px 8px;
  margin-top: 5px;
}
.status-wrap {
  font-size: 15px;
  margin: 20px 10px;
}
.from-me {
  flex-flow: row-reverse;
}
.menu-text {
  font-weight: 400;
  font-size: 14px;
  color: #333333;
}
</style>
