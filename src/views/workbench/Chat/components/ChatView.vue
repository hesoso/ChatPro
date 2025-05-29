<script setup lang="ts">
import { nextTick, ref } from 'vue'
import MessageItem from '@/views/workbench/Chat/components/MessageItem.vue'
const messageList = ref(new Array(20000).fill(0))

const scroller = ref<HTMLElement>(document.body)

nextTick(() => {
  scroller.value.scrollToBottom()
})
</script>

<template>
  <div class="chat-view">
    <div class="chat-title-wrap">
      全部消息
    </div>
    <DynamicScroller
      ref="scroller"
      :items="messageList"
      :min-item-size="64"
      class="scroll"
    >
      <template v-slot="{ item, index, active }">
        <DynamicScrollerItem
          :item="item"
          :active="active"
          :size-dependencies="[
          item.message,
        ]"
          :data-index="index"
        >
          <MessageItem :index="index"></MessageItem>
        </DynamicScrollerItem>
      </template>
    </DynamicScroller>
    <div class="reply">
      回复至<span class="nick">小龙女</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.chat-title-wrap {
  height: 45px;
  background: #FFFFFF;
  padding: 0 28px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.chat-view {
  flex: 1;
  height: 100%;
  background: #F7F7F7;
  display: flex;
  flex-direction: column;
}

.reply {
  height: 24px;
  background: #fff;
  padding: 0 13px;
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #999;

  .nick {
    color: #3686FF;
    font-size: 14px;
    margin-left: 5px;
  }
}
</style>
