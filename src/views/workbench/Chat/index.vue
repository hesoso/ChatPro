<script setup lang="ts">
import ConversationMode from './components/ConversationMode.vue'
import RobotList from './components/RobotList.vue'
import ConversationList from './components/ConversationList.vue'
import ChatInput from '@/views/workbench/Chat/components/ChatInput.vue'
import ChatView from '@/views/workbench/Chat/components/ChatView.vue'
import ChatSpeechArt from '@/views/workbench/Chat/components/ChatSpeechArt.vue'
import ChantIntroduce from '@/views/workbench/Chat/components/ChantIntroduce.vue'

import { ref } from 'vue'
import type { TabsPaneContext } from 'element-plus'

const activeName = ref('tab1')

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}


</script>

<template>
  <div class="chat-wrap">
    <div class="left-wrap">
      <!-- 选择会话模式 -->
      <ConversationMode></ConversationMode>
      <!-- 机器人列表、会话列表 -->
      <div class="layout-qz">
        <RobotList></RobotList>
        <ConversationList></ConversationList>
      </div>
    </div>
    <!-- 中间聊天区域 -->
    <div class="center-wrap">
      <div class="layout-qz">
        <ChatView></ChatView>
      </div>
      <ChatInput></ChatInput>
    </div>
    <!-- 右侧区域 -->
    <div class="right-wrap">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="话术" name="tab1">
          <ChatSpeechArt></ChatSpeechArt>
        </el-tab-pane>
        <el-tab-pane label="信息" name="tab2">
          <ChantIntroduce></ChantIntroduce>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
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
</style>
