<script setup lang="ts">
import { ref } from 'vue'
import ChatView from '@/views/workbench/Chat/components/ChatView.vue'
import SearchInput from '@/components/SearchInput.vue'
import HistoryConversationItem from '@/views/workbench/History/components/HistoryConversationItem.vue'


const list1 = ref(new Array(5).fill(0))
const list2 = ref(new Array(4).fill(0))
const emptyFlag = ref(false)

const showDialog = ref(false)

const handleShowDialog = () => {
  showDialog.value = true
}

</script>

<template>
  <div class="chat-wrap">
    <div class="left-wrap">
      <div class="search-input-wrap">
        <SearchInput></SearchInput>
      </div>
      <div class="conversation-list scroll">
        <div class="section">
          <p class="title-wrap">群聊</p>
          <HistoryConversationItem v-for="(item,index) in list1" :conversation="index"
                                   :key="item"></HistoryConversationItem>
        </div>
        <div class="section">
          <p class="title-wrap">个人</p>
          <HistoryConversationItem v-for="(item, index) in list2" :conversation="index"
                                   :key="item"></HistoryConversationItem>
        </div>
      </div>
      <div v-if="emptyFlag" class="empty-wrap">
        <div>
          <img src="@/assets/images/empty1.png" alt="">
          <p class="text">请输入关键字</p>
        </div>
      </div>
    </div>
    <div class="center-wrap">
      <div class="header-wrap">
        <div class="layout-rc">
          <img class="header-img" src="" alt="">
          <div class="header-center">
            <p class="header-title">发单101</p>
            <p class="header-text">3条与【测试】相关的聊天记录</p>
          </div>
        </div>
        <el-button type="primary">进入聊天</el-button>
      </div>
      <div class="conversation-item" v-for="(item,index) in list1" :key="index">
        <div class="img-wrap">
          <img src="@/assets/images/chat.png" alt="" />
        </div>
        <div class="conversation-content">
          <div class="layout-slide">
            <div class="title-wrap">
              <span>标题</span></div>
            <span class="time">11:30</span>
          </div>
          <div class="layout-slide" style="margin-top: 4px">
            <span class="message-text">[消息内容]</span>
            <span class="count" @click="handleShowDialog">查看上下文</span>
          </div>
        </div>
      </div>

      <div v-if="emptyFlag" class="empty-wrap">
        <div>
          <img src="@/assets/images/empty2.png" alt="">
          <p class="text">请选择聊天对象查看记录</p>
        </div>
      </div>
    </div>
  </div>

  <el-dialog v-model="showDialog" width="858" title="查看上下文">
    <div class="dialog-content">
      <div class="header-wrap" style="padding: 0;border-bottom: none">
        <div class="layout-rc">
          <img class="header-img" src="" alt="">
          <div class="header-center">
            <p class="header-title">发单101</p>
          </div>
        </div>
        <el-button type="primary">进入聊天</el-button>
      </div>
      <div style="flex: 1;min-height: 0;">
        <ChatView mode="history"></ChatView>
      </div>
    </div>
  </el-dialog>
</template>

<style scoped lang="scss">
.header-wrap {
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  border-bottom: 1px solid #EDEDED;

  .header-img {
    height: 40px;
    width: 40px;
    margin-right: 5px;
  }
}

.search-input-wrap {
  height: 36px;
  padding: 2px 12px;
  background: #fff;
}

.header-center {
  font-weight: 400;
  font-size: 14px;
  color: #212121;
  line-height: 14px;

  .header-text {
    font-weight: 400;
    font-size: 12px;
    color: #333333;
    line-height: 12px;
    margin-top: 6px;
  }
}

.section {
  .title-wrap {
    padding: 0 11px;
    height: 34px;
    display: flex;
    align-items: center;
    background: #F0F0F0;
    font-weight: 400;
    font-size: 14px;
    color: #666666;
  }
}

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
}

.conversation-list {
  flex: 1;
  min-height: 0;
  overflow: auto;
}

.conversation-item {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 27px;
  border-bottom: 1px solid #EDEDED;

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
      font-weight: 400;
      font-size: 14px;
      color: #3686FF;
      cursor: pointer;
    }
  }
}

.dialog-content {
  height: 614px;
  padding: 15px 25px;
  display: flex;
  flex-direction: column;
}
</style>
