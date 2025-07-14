<script setup lang="ts">
import { nextTick, ref } from 'vue'
import MessageItem from '@/views/workbench/Chat/components/MessageItem.vue'
import { ConversationStatusEnum } from '@/enums/conversation.ts'
import { useConversationStore } from '@/store/useConversationStore.ts'

const conversationStore = useConversationStore()

const props = defineProps({
  mode: String
})
const emits = defineEmits(['transmit'])


const messageList = ref(new Array(20000).fill(0).map((_, index) => ({
    id: index,
    type: 1,
    content: `${index}`,
    status: index % 2 === 0 ? 'success' : 'fail',
    isSelf: index % 2 === 0,
    time: '2023-05-05 12:00:00',
    avatar: 'https://picsum.photos/200/300',
    nickname: '张三',
    conversationId: '1234567890',
})))

const scroller = useTemplateRef<{scrollToBottom: () => void}>('scroller')
onMounted(() => {
  console.log(scroller.value, 'scroller') 
  nextTick(() => {
  if (props.mode !== 'history') {
    scroller.value && scroller.value.scrollToBottom()
  }
})
})

</script>

<template>
  <div class="chat-view">
    <div v-if="mode !== 'history'" class="chat-title-wrap">
      全部消息
    </div>
    <DynamicScroller
      v-if="conversationStore.conversationStatus !== ConversationStatusEnum.wait"
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
          <MessageItem :message="item" :index="index" @transmit="emits('transmit')"></MessageItem>
        </DynamicScrollerItem>
      </template>
    </DynamicScroller>
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

</style>
