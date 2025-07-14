<script setup lang="ts">
import { computed, h, ref } from 'vue'
import { showContextMenu } from '@/components/ContextMenu'
import { useConversationStore } from '@/store/useConversationStore.ts'
import { ElMessage } from 'element-plus'
import  { MessageContent } from '../utils/messageContentRender.ts'
import { CpMessage } from '../types/message.ts'

const props = defineProps<{
  index: number,
  message: CpMessage
}>()
const emits = defineEmits(['transmit'])

const conversationStore = useConversationStore()

const fromMe = computed(() => props.index % 7 === 0)

const messageContent = '你好，在吗？'

// const show = ref(false);

function onContextMenuMessage(e: MouseEvent) {
  e.preventDefault()
  if (fromMe.value || conversationStore.multipleMessageStatus) return
  showContextMenu({
    event: e,
    menuList: [{
      label: '复制',
      onClick: () => {
        ElMessage.success({
          message: '复制',
          showClose: true
        })
      },
      textType: ''
    }, {
      label: '复制消息',
      onClick: () => {
        ElMessage.success({
          message: '复制消息',
          showClose: true
        })
      },
      textType: ''
    }, {
      label: '多选',
      onClick: () => {
        conversationStore.setMultipleMessageStatus(true)
      },
      textType: ''
    }, {
      label: '转发',
      onClick: () => {
        emits('transmit')
      },
      textType: ''
    }
    ]
  })
}

function onContextMenuAvatar(e: MouseEvent) {
  e.preventDefault()
  if (fromMe.value || conversationStore.multipleMessageStatus) return
  showContextMenu({
    event: e,
    menuList: [{
      label: '@',
      onClick: () => {
        conversationStore.setAt(true)
      },
      textType: ''
    }, {
      label: '屏蔽',
      onClick: () => {
      },
      textType: ''
    }, {
      label: '踢出',
      onClick: () => {
      },
      textType: ''
    }]
  })
}

</script>

<template>
  <div class="message-item-wrap">
    <el-checkbox v-if="conversationStore.multipleMessageStatus" class="checkbox"></el-checkbox>
    <div class="message-item" :class="[{'from-me': message.isSelf}]">
      <div class="avatar-wrap" @contextmenu="onContextMenuAvatar">
        <img :src="message.avatar" alt="">
      </div>
      <div class="message-content" @contextmenu="onContextMenuMessage">
        <div class="title-wrap">
          <span class="title">{{ message.nickname }}</span>
        </div>
        <MessageContent :messageData="message" />
      </div>
      <div class="status-wrap">
        <svg-icon name="error"></svg-icon>
      </div>
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
.message-item-wrap {
  display: flex;
  .checkbox {
    margin-left: 8px;
  }
}

.message-item {
  display: flex;
  flex: 1;

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
