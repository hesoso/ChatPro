<script setup lang="ts">
import { ref } from 'vue'
import ConversationItem from '@/views/workbench/Chat/components/ConversationItem.vue'

const conversationList = ref(new Array(20000).fill(0))
const navList = ref([{
  id: Symbol(),
  iconName: 'nav1'
}, {
  id: Symbol(),
  iconName: 'nav2'
}, {
  id: Symbol(),
  iconName: 'nav3'
}, {
  id: Symbol(),
  iconName: 'email'
}])

const activeNav  = ref(navList.value[0])


</script>

<template>
  <div class="conversation-list">
    <div class="nav-list">
      <div class="nav-list-item" :class="[{active: activeNav.id === item.id}]" v-for="item in navList" :key="item.id"
           @click="activeNav = item">
        <svg-icon :name="item.iconName"></svg-icon>
      </div>
    </div>
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
          <conversation-item :conversation="index"></conversation-item>
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
