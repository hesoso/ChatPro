<script setup lang="ts">
import { computed, ref } from 'vue'
import { showContextMenu } from '@/components/ContextMenu'

const props = defineProps({
  index: {
    type: Number,
    required: true
  }
})

const fromMe = computed(() => props.index % 7 === 0)

// const show = ref(false);

function onContextMenuMessage(e: MouseEvent) {
  e.preventDefault()
  showContextMenu({
    event: e,
    menuList: [{
      label: '复制',
      onClick: () => {
      }
    }, {
      label: '复制消息',
      onClick: () => {
      }
    }, {
      label: '多选',
      onClick: () => {
      }
    }, {
      label: '转发',
      onClick: () => {
      }
    }
    ]
  })
}

function onContextMenuAvatar(e: MouseEvent) {
  e.preventDefault()
  showContextMenu({
    event: e,
    menuList: [{
      label: '@',
      onClick: () => {
      }
    }, {
      label: '屏蔽',
      onClick: () => {
      }
    }, {
      label: '踢出',
      onClick: () => {
      }
    }]
  })
}


</script>

<template>
  <div class="message-item" :class="[{'from-me': fromMe}]">
    <div class="avatar-wrap" @contextmenu="onContextMenuAvatar">
      <img src="" alt="">
    </div>
    <div class="message-content" @contextmenu="onContextMenuMessage">
      <div class="title-wrap">
        <span class="title">小七</span>
      </div>
      <div class="message-text">你好，在吗？</div>
    </div>
    <div class="status-wrap">
      <svg-icon name="error"></svg-icon>
    </div>
  </div>


  <!--  <context-menu-->
  <!--    v-model:show="show"-->
  <!--    :options="options"-->
  <!--  >-->
  <!--    <context-menu-item @click="onMenuClick(0)"><p class="menu-text">复制</p></context-menu-item>-->
  <!--    <context-menu-item @click="onMenuClick(1)"><p class="menu-text">复制消息</p></context-menu-item>-->
  <!--    <context-menu-item @click="onMenuClick(2)"><p class="menu-text">多选</p></context-menu-item>-->
  <!--    <context-menu-item @click="onMenuClick(2)"><p class="menu-text">转发</p></context-menu-item>-->
  <!--  </context-menu>-->
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

  .title-wrap {
    text-align: right;
  }
}

</style>
