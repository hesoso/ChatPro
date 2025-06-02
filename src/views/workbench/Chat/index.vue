<script setup lang="ts">
import { ref } from 'vue'
import { useLayoutStore } from '@/store/useLayoutStore.ts'
import { useConversationStore } from '@/store/useConversationStore.ts'

import ConversationMode from './components/ConversationMode.vue'
import RobotList from './components/RobotList.vue'
import ConversationList from './components/ConversationList.vue'
import ChatInput from '@/views/workbench/Chat/components/ChatInput.vue'
import ChatView from '@/views/workbench/Chat/components/ChatView.vue'
import ChatSpeechArt from '@/views/workbench/Chat/components/ChatSpeechArt.vue'
import ChantIntroduce from '@/views/workbench/Chat/components/ChantIntroduce.vue'

import type { TabsPaneContext } from 'element-plus'
import { ConversationStatusEnum } from '@/enums/conversation.ts'
import SvgIcon from '@/components/SvgIcon.vue'
import TransmitMessage from '@/views/workbench/Chat/components/TransmitMessage.vue'

const conversationStore = useConversationStore()
const layoutStore = useLayoutStore()
const activeName = ref('tab1')
const showTransmitMessage = ref(false)

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}

const handlerReception = () => {
  conversationStore.setConversationStatus(ConversationStatusEnum.recepting)
}

const cancelMultipleMessage = () => {
  conversationStore.setMultipleMessageStatus(false)
}

const cancelAt = () => {
  conversationStore.setAt(false)
}

const handleTransmit = () => {
  showTransmitMessage.value = true
}

</script>

<template>
  <div class="chat-wrap">
    <div class="left-wrap">
      <!-- 选择会话模式 -->
      <ConversationMode />
      <!-- 机器人列表、会话列表 -->
      <div class="layout-qz">
        <RobotList />
        <ConversationList />
      </div>
    </div>
    <!-- 中间聊天区域 -->
    <div class="center-wrap">
      <div class="layout-qz">
        <ChatView @transmit="handleTransmit" />
      </div>
      <div class="chat-input">
        <!-- 待接待状态 -->
        <div v-if="conversationStore.conversationStatus === ConversationStatusEnum.wait" class="layout-cc">
          <img width="100" src="@/assets/images/empty2.png" alt="">
          <p style="font-size: 12px;color: #999999;margin: 10px">暂未接待当前用户</p>
          <el-button type="primary" @click="handlerReception">开始接待</el-button>
        </div>
        <template v-else>
          <!-- at -->
          <div v-if="conversationStore.at" class="reply">
            <p> 回复至<span class="nick">小龙女</span></p>
            <svg-icon style="font-size: 12px" name="close" @click="cancelAt" />
          </div>
          <!-- 消息多选状态 --->
          <div v-if="conversationStore.multipleMessageStatus" class="layout-zy" style="height: 100%;">
            <el-button @click="cancelMultipleMessage">取消</el-button>
            <el-button type="primary" @click="handleTransmit">转发</el-button>
          </div>
          <!-- 聊天编辑器 -->
          <ChatInput v-else />
        </template>
      </div>
    </div>
    <!-- 右侧区域 -->
    <div v-if="layoutStore.speechArtPanelShow" class="right-wrap">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="话术" name="tab1">
          <ChatSpeechArt />
        </el-tab-pane>
        <el-tab-pane label="信息" name="tab2">
          <ChantIntroduce />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
  <!-- 转发消息 -->
  <TransmitMessage v-if="showTransmitMessage" v-model="showTransmitMessage"></TransmitMessage>
</template>

<style scoped lang="scss">
.chat-wrap {
  display: flex;
  height: 100%;
  .left-wrap {
    width: 300px;
    height: 100%;
    flex-shrink: 0;
    background: #EAEAEA;
    display: flex;
    flex-direction: column;
  }
  .center-wrap {
    flex: 1;
    height: 100%;
    border-left: 1px solid #EDEDED;
    display: flex;
    flex-direction: column;
    background: #F7F7F7;
  }
  .right-wrap {
    width: 300px;
    height: 100%;
    border-left: 1px solid #EDEDED;
  }
}
.layout-qz {
  flex: 1;
  min-height: 0;
}
.scroller {
  height: 400px;
}
:deep(.el-tabs__nav) {
  width: 100%;
  justify-content: space-around;
}
.chat-input {
  height: 210px;
  border-top: 1px solid #E1E1E1;
  display: flex;
  flex-direction: column;
}
.layout-cc {
  height: 100%
}
.reply {
  height: 24px;
  background: #fff;
  padding: 0 13px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: #999;

  .nick {
    color: #3686FF;
    font-size: 14px;
    margin-left: 5px;
  }
}
</style>
