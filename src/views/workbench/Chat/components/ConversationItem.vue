<script setup lang="ts">
import { ref } from 'vue'
import { MenuOptions } from '@imengyu/vue3-context-menu'

const props = defineProps({
  conversation: [Number, String]
})

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
  <div class="conversation-item" :class="[{active: conversation === 0}]" @contextmenu="onContextMenu">
    <div class="img-wrap">
      <img src="@/assets/images/chat.png" alt="" />
      <svg-icon class="label" name="label_friend" />
    </div>
    <div class="conversation-content">
      <div class="layout-slide">
        <div class="title-wrap">
          <svg-icon name="mute"></svg-icon>
          <span>标题</span></div>
        <span class="time">11:30</span>
      </div>
      <div class="layout-slide">
        <span class="message-text">[消息内容]</span>
        <span class="count">90</span>
      </div>
    </div>
  </div>

  <context-menu
    v-model:show="show"
    :options="options"
  >
    <context-menu-item @click="onMenuClick(0)"><p class="menu-text">置顶会话</p></context-menu-item>
    <context-menu-item @click="onMenuClick(1)"><p class="menu-text">开启免打扰</p></context-menu-item>
    <context-menu-item @click="onMenuClick(2)"><p class="menu-text">清空所有未读</p></context-menu-item>
    <context-menu-item @click="onMenuClick(2)"><p class="menu-text red">删除当前会话</p></context-menu-item>
    <context-menu-item @click="onMenuClick(2)"><p class="menu-text red">删除所有会话</p></context-menu-item>
  </context-menu>
</template>

<style scoped lang="scss">
.conversation-item {
  height: 53px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;

  &.active {
    background: #E1EDFF;
  }

  .img-wrap {
    width: 34px;
    height: 34px;
    position: relative;

    img {
      border-radius: 50%;
      width: 100%;
      height: 100%;
    }

    .label {
      position: absolute;
      left: -10px;
      top: -10px;
      font-size: 24px;
    }
  }

  .conversation-content {
    flex: 1;
    margin-left: 4px;

    .title-wrap {
      font-weight: 400;
      font-size: 14px;
      color: #212121;

      .svg-icon {
        font-size: 15px;
      }
    }

    .time {
      font-weight: 400;
      font-size: 11px;
      color: #999999;
    }

    .message-text {
      font-weight: 400;
      font-size: 12px;
      color: #999999;
    }

    .count {
      display: inline-block;
      font-weight: 500;
      font-size: 10px;
      color: #FFFFFF;
      padding: 2px 6px;
      min-width: 20px;
      border-radius: 20px;
      background: rgba(146, 189, 255, 0.502);
      text-align: center;

      &.active {
        background: #F54A45;
      }
    }
  }
}

.menu-text {
  font-weight: 400;
  font-size: 14px;
  color: #333333;
}

</style>
