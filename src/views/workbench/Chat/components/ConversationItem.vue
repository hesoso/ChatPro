<script setup lang="ts">
import { ref, h } from 'vue'
import { MenuOptions } from '@imengyu/vue3-context-menu'
import { ElCheckbox, ElMessage, ElMessageBox } from 'element-plus'
import { showContextMenu } from '@/components/ContextMenu'

const props = defineProps({
  conversation: [Number, String],
  active: Boolean
})
const emits = defineEmits(['select'])


const show = ref(false)
const options = ref<MenuOptions>({
  zIndex: 3,
  minWidth: 0,
  x: 500,
  y: 200
})


const stickTop = () => {
  alert('置顶')
}
const notDisturb = () => {
  ElMessageBox({
      title: '温馨提醒',
      message: h('p', {class: 'layout-rc'}, [
        h(ElCheckbox, null, ''),
        h('span', null, '屏蔽群【6378377192931】')
      ]),
      showCancelButton: true,
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    }
  )
    .then(() => {
    })
    .catch(() => {
    })
}
const clearUnread = () => {
  ElMessage.success('清空所有未读成功')
}
const delCurConversation = () => {
  ElMessageBox.confirm(
    '是否删除所选群？',
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消'
    }
  )
    .then(() => {
    })
    .catch(() => {
    })
}
const delAllConversation = () => {
  ElMessageBox.confirm(
    '是否删除所选机器人？',
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消'
    }
  )
    .then(() => {
    })
    .catch(() => {
    })
}

function onContextMenu(e: MouseEvent) {
  // e.preventDefault()
  // //Show component mode menu
  // show.value = true
  // options.value.x = e.x
  // options.value.y = e.y


  e.preventDefault()
  showContextMenu({
    event: e,
    menuList: [{
      label: '置顶会话',
      onClick: () => {
      }
    }, {
      label: '开启免打扰',
      onClick: () => {
      }
    }, {
      label: '清空所有未读',
      onClick: () => {
      }
    }, {
      label: '删除当前会话',
      textType: 'danger',
      onClick: () => {
      }
    }, {
      label: '删除所有会话',
      textType: 'danger',
      onClick: () => {
      }
    }]
  })
}

</script>

<template>
  <div class="conversation-item" :class="[{active}]" @contextmenu="onContextMenu" @click="emits('select')">
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

<!--  <context-menu-->
<!--    v-model:show="show"-->
<!--    :options="options"-->
<!--  >-->
<!--    <context-menu-item @click="stickTop"><p class="menu-text">置顶会话</p></context-menu-item>-->
<!--    <context-menu-item @click="notDisturb"><p class="menu-text">开启免打扰</p></context-menu-item>-->
<!--    <context-menu-item @click="clearUnread"><p class="menu-text">清空所有未读</p></context-menu-item>-->
<!--    <context-menu-item @click="delCurConversation"><p class="menu-text red">删除当前会话</p></context-menu-item>-->
<!--    <context-menu-item @click="delAllConversation"><p class="menu-text red">删除所有会话</p></context-menu-item>-->
<!--  </context-menu>-->
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
