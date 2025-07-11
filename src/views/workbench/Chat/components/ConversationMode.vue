<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import SearchInput from '@/components/SearchInput.vue'
import CreateNewConversation from '@/views/workbench/Chat/components/CreateNewConversation.vue'
import { useConversationStore } from '@/store/useConversationStore.ts'
import { changePanel, getPanel } from '@/apis'
import { ChatModePanel, EnumConvoMode, EnumConvoModeNames, EnumFlag } from '@/views/workbench/Chat/types/chat.d.ts'

const conversationStore = useConversationStore()

const showSearch = ref(false)
const showCreateNewConversation = ref(false)

const handleCancel = () => {
  showSearch.value = false
}

const modeList = ref([{
  type: EnumConvoMode.single,
  name: '独立'
}, {
  type: EnumConvoMode.mix,
  name: '组合'
}, {
  type: EnumConvoMode.server,
  name: '接待'
}])

const extractMemberMsgFlag = ref(conversationStore.chatPanel.extractMemberMsgFlag)

const modeText = computed(() => {
  const convoModeName = EnumConvoModeNames[conversationStore.chatPanel.convoMode]
  const groupNames = []
  if (conversationStore.chatPanel.targetContactFlag === EnumFlag.YES) {
    groupNames.push('好友')
  }
  if (conversationStore.chatPanel.targetRoomFlag === EnumFlag.YES) {
    groupNames.push('群')
  }
  if (conversationStore.chatPanel.targetMemberFlag === EnumFlag.YES) {
    groupNames.push('群成员')
  }
  let text = convoModeName
  if (groupNames.length > 0) {
    text += `[${groupNames.join('+')}]`
  }
  return text
})


const handleChangeMode = (type: EnumConvoMode) => {
  conversationStore.setConversationMode(type)
  changePanel({convoMode: conversationStore.chatPanel.convoMode})
}

const extractMemberMsgFlagChange = (flag: EnumFlag) => {
  conversationStore.setExtractMemberMsgFlag(flag)
  changePanel({extractMemberMsgFlag: conversationStore.chatPanel.extractMemberMsgFlag})
}

const handleChangeGroup = (field: string) => {
  const val = conversationStore.chatPanel[field] === EnumFlag.YES ? EnumFlag.NO : EnumFlag.YES
  conversationStore.setTargetFlag(field, val)
  changePanel({[field]: val})
}

onMounted(() => {
  getPanel().then((res: HttpResponse<ChatModePanel>) => {
    handleChangeMode(res.data.convoMode)
  })
})

</script>

<template>
  <div class="conversation-mode">
    <template v-if="!showSearch">
      <el-tag type="primary" size="large" style="margin-right: 27px">
        <el-popover
          placement="bottom"
          :width="200"
          trigger="click"
        >
          <div class="mode-select-wrap">
            <div class="mode-section">
              <p class="title">会话模式</p>
              <div class="radio-wrap">
                <span v-for="item in modeList" class="radio-item" :class="[{active: conversationStore.chatPanel.convoMode === item.type}]"
                      @click="handleChangeMode(item.type)">{{ item.name }}</span>
              </div>
            </div>
            <div class="mode-section">
              <div class="title layout-lc">
                <p>组合消息</p>
                <el-switch
                  size="small"
                  style="margin-left: 10px"
                  v-model="extractMemberMsgFlag"
                  :active-value="EnumFlag.YES"
                  :inactive-value="EnumFlag.NO"
                  @change="extractMemberMsgFlagChange"
                >
                </el-switch>
              </div>
              <div class="radio-wrap">
                <span  class="radio-item" :class="[{active: conversationStore.chatPanel.targetContactFlag === EnumFlag.YES}]"
                         @click="handleChangeGroup('targetContactFlag')">好友</span>
                <span  class="radio-item" :class="[{active: conversationStore.chatPanel.targetRoomFlag === EnumFlag.YES}]"
                       @click="handleChangeGroup('targetRoomFlag')">群</span>
                <span v-if="extractMemberMsgFlag === EnumFlag.YES"  class="radio-item" :class="[{active: conversationStore.chatPanel.targetMemberFlag === EnumFlag.YES}]"
                      @click="handleChangeGroup('targetMemberFlag')">群成员</span>
              </div>
            </div>
          </div>
          <template #reference>
            <div class="mode-wrap">
              <span style="margin-right: 27px">{{modeText}}</span>
              <svg-icon style="font-size: 20px" name="down-blue"></svg-icon>
            </div>
          </template>
        </el-popover>
      </el-tag>
      <div class="options-wrap">
        <svg-icon name="search-gray" style="margin-right: 10px" @click="showSearch = true"></svg-icon>
        <svg-icon name="add-gray" @click="showCreateNewConversation = true"></svg-icon>
      </div>
    </template>
    <template v-else>
      <div class="search-input-wrap">
        <SearchInput></SearchInput>
        <span class="cancel" @click="handleCancel">取消</span>
      </div>
    </template>

    <CreateNewConversation v-if="showCreateNewConversation" v-model="showCreateNewConversation"></CreateNewConversation>
  </div>
</template>

<style scoped lang="scss">
.conversation-mode {
  height: 41px;
  border-bottom: 1px solid #EDEDED;
  background: #fff;
  display: flex;
  align-items: center;
  padding: 5px 10px;
}

.options-wrap {
  font-size: 20px;
}

.mode-wrap {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.search-input-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 27px;
  width: 100%;
}

.cancel {
  font-weight: 400;
  font-size: 12px;
  color: #3686FF;
  margin-left: 10px;
  user-select: none;
  cursor: pointer;
  flex-shrink: 0;
}

.svg-icon {
  cursor: pointer;
}

.mode-select-wrap {
  .mode-section {
    margin-bottom: 15px;

    .title {
      font-weight: 400;
      font-size: 14px;
      color: #333333;
      margin-bottom: 8px;
    }

    .radio-wrap {
      display: flex;
      align-items: center;
    }
  }
}

.radio-item {
  width: 46px;
  height: 20px;
  display: flex;
  margin-right: 20px;
  align-items: center;
  justify-content: center;
  font-weight: 400;
  font-size: 10px;
  color: #666666;
  background: #E7E7E7;
  border-radius: 12px 12px 12px 12px;
  cursor: pointer;
  &.active {
    background: #3686FF;
    color: #fff;
  }
  &:last-child {
    margin-right: 0;
  }
}
</style>
