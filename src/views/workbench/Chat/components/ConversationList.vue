<script setup lang="ts">
import { ref, watch } from 'vue'
import { useConversationStore } from '@/store/useConversationStore.ts'

import ConversationItem from '@/views/workbench/Chat/components/ConversationItem.vue'
import { ConversationModeEnum, ConversationStatusEnum } from '@/enums/conversation.ts'


const conversationStore = useConversationStore()
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

const activeNav = ref(navList.value[0])
const tabName = ref(ConversationStatusEnum.wait)

const curConversation = ref(0)
const handleSelectConversation = (conversationindex) => {
  curConversation.value = conversationindex

  if (tabName.value === ConversationStatusEnum.wait) {
    conversationStore.setConversationStatus(ConversationStatusEnum.wait)
  }
}

watch(() => conversationStore.conversationStatus, (newVal, oldVal) => {
  if (newVal === ConversationStatusEnum.recepting) {
    tabName.value = ConversationStatusEnum.recepting
  }
}, {
  immediate: true,
})


</script>

<template>
  <div class="conversation-list">
    <el-tabs v-if="conversationStore.conversationMode === ConversationModeEnum.reception" v-model="tabName">
      <el-tab-pane :name="ConversationStatusEnum.wait">
        <template #label><span>待接待</span></template>
      </el-tab-pane>
      <el-tab-pane :name="ConversationStatusEnum.recepting">
        <template #label>
          <el-badge :value="99" class="item" type="danger" :offset="[10, 0]">
            <span>接待中</span>
          </el-badge>
        </template>
      </el-tab-pane>
    </el-tabs>
    <div v-else class="nav-list">
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
          :data-index="index"
        >
          <conversation-item :conversation="index" :active="curConversation === index"
                             @select="handleSelectConversation(index)"></conversation-item>
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

:deep(.el-tabs__header) {
  background: #fff;
  margin-bottom: 0;
}
</style>
