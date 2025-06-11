<script setup lang="ts">
import { ref } from 'vue'
import SearchInput from '@/components/SearchInput.vue'
import ChatSpeechArtGroupNew from '@/views/workbench/Chat/components/ChatSpeechArtGroupNew.vue'
import ChatSpeechArtNew from '@/views/workbench/Chat/components/ChatSpeechArtNew.vue'
import SharedCode from '@/views/workbench/Chat/components/SharedCode.vue'
import ChatSpeechArtTree from '@/views/workbench/Chat/components/ChatSpeechArtTree.vue'
import SharedCodeNew from '@/views/workbench/Chat/components/SharedCodeNew.vue'
import SharedCodeImport from '@/views/workbench/Chat/components/SharedCodeImport.vue'

const showChatSpeechArtGroupNew = ref(false)
const showChatSpeechArtNew = ref(false)
const showSharedCode = ref(false)
const showSharedCodeNew = ref(false)
const showSharedCodeImport = ref(false)


</script>

<template>
  <div class="tab-wrap">
    <div style="height: 27px">
      <SearchInput></SearchInput>
    </div>
    <div class="tag-wrap">
      <el-tag type="primary" style="margin-right: 10px" @click="showChatSpeechArtNew = true"><span style="margin: 0 10px">新增话术</span></el-tag>
      <el-tag type="primary" style="margin-right: 10px" @click="showChatSpeechArtGroupNew = true"><span style="margin: 0 10px">新增话术分组</span></el-tag>
      <el-dropdown placement="bottom-end">
        <svg-icon style="font-size: 30px" name="down-blue"></svg-icon>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="showSharedCode = true">共享码</el-dropdown-item>
            <el-dropdown-item @click="showSharedCodeNew = true">生成共享码</el-dropdown-item>
            <el-dropdown-item @click="showSharedCodeImport = true">导入共享码</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <div class="tree-wrap">
      <ChatSpeechArtTree></ChatSpeechArtTree>
    </div>
  </div>
  <!-- 新增话术分组 -->
  <ChatSpeechArtGroupNew v-if="showChatSpeechArtGroupNew" v-model="showChatSpeechArtGroupNew"></ChatSpeechArtGroupNew>
  <!-- 新增话术 -->
  <ChatSpeechArtNew v-if="showChatSpeechArtNew" v-model="showChatSpeechArtNew" @new-group="showChatSpeechArtGroupNew = true"></ChatSpeechArtNew>
  <!-- 共享码 -->
  <SharedCode v-if="showSharedCode" v-model="showSharedCode"></SharedCode>
  <!-- 生成共享码 -->
  <SharedCodeNew v-if="showSharedCodeNew" v-model="showSharedCodeNew"></SharedCodeNew>
  <!-- 导入共享码 -->
  <SharedCodeImport v-if="showSharedCodeImport" v-model="showSharedCodeImport" @addGroup="showChatSpeechArtGroupNew = true"></SharedCodeImport>
</template>

<style scoped lang="scss">
.tab-wrap {
  padding: 0 16px;
}

.tag-wrap {
  display: flex;
  align-items: center;
  margin-top: 10px;
}

:deep(.el-tag) {
  cursor: pointer;
}
</style>
