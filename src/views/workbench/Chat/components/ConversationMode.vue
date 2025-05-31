<script setup lang="ts">
import { ref } from 'vue'
import SearchInput from '@/components/SearchInput.vue'
import CreateNewConversation from '@/views/workbench/Chat/components/CreateNewConversation.vue'

const showSearch = ref(false)
const showCreateNewConversation = ref(true)

const handleCancel = () => {
  showSearch.value = false
}

const curModeType = ref('type1')
const curGroupList = ref(['group1', 'group2', 'group3'])

const modeList = ref([{
  type: 'type1',
  name: '独立'
}, {
  type: 'type2',
  name: '组合'
}, {
  type: 'type3',
  name: '接待'
}])
const groupList = ref([{
  type: 'group1',
  name: '好友'
},{
  type: 'group2',
  name: '群'
},{
  type: 'group3',
  name: '群成员'
}])

const curGroupListHanlder = (type: String) => {
  const index = curGroupList.value.indexOf(type)
  index > -1 ? curGroupList.value.splice(index, 1) : curGroupList.value.push(type)
}

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
                <span v-for="item in modeList" class="radio-item" :class="[{active: item.type === curModeType}]"
                      @click="curModeType = item.type">{{ item.name }}</span>
              </div>
            </div>
            <div class="mode-section">
              <p class="title">组合消息</p>
              <div class="radio-wrap">
                <span v-for="item in groupList" class="radio-item" :class="[{active: curGroupList.includes(item.type)}]"
                      @click="curGroupListHanlder(item.type)">{{ item.name }}</span>
              </div>
            </div>
          </div>
          <template #reference>
            <div class="mode-wrap">
              <span style="margin-right: 27px">独立[好友+群+群成员]</span>
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
      justify-content: space-between;

    }
  }
}

.radio-item {
  width: 46px;
  height: 20px;
  display: flex;
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
}
</style>
