<script setup lang="ts">
import { ref } from 'vue'
import ConversationItem from '@/views/workbench/Chat/components/ConversationItem.vue'
const conversationList = ref(new Array(20000).fill(0))


</script>

<template>
  <div class="conversation-list">
    <div class="nav-list">
      <svg-icon name="nav1"></svg-icon>
      <svg-icon name="nav2"></svg-icon>
      <svg-icon name="nav3"></svg-icon>
      <svg-icon name="email"></svg-icon>
    </div>
    <DynamicScroller
      :items="conversationList"
      :min-item-size="54"
      class="scroll"
    >
      <template v-slot="{ item, index }">
        <DynamicScrollerItem
          :item="item"
          :size-dependencies="[
          item.message,
        ]"
          :data-index="index"
        >
          <conversation-item :conversation="item"></conversation-item>
        </DynamicScrollerItem>
      </template>
    </DynamicScroller>
  </div>
</template>

<style scoped lang="scss">
.conversation-list {
  flex: 1;
  height: 100%;
  background: #F0F0F0;
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
}

.svg-icon {
  cursor: pointer;
}
</style>
