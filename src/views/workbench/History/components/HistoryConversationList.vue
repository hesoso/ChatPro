<script setup lang="ts">
import { ref } from 'vue'
import HistoryConversationItem from './HistoryConversationItem.vue'

const conversationList = ref(new Array(20000).fill(0))

</script>

<template>
  <div class="conversation-list">
    <DynamicScroller
      :items="conversationList"
      :min-item-size="54"
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
          <HistoryConversationItem :conversation="index"></HistoryConversationItem>
        </DynamicScrollerItem>
      </template>
    </DynamicScroller>
  </div>
</template>

<style scoped lang="scss">
.conversation-list {
  flex: 1;
  height: 100%;
  background: #fff;
  display: flex;
  flex-direction: column;

  .conversation-list-wrap {
    min-height: 0;
    flex: 1;
    overflow: auto;
  }
}

.nav-list {
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 44px;
  font-size: 20px;
  padding: 0 14px;
  flex-shrink: 0;

  .nav-list-item {
    padding: 6px 8px;
    border-radius: 6px;
    cursor: pointer;

    &.active {
      background: #fff;
    }
  }
}
</style>
