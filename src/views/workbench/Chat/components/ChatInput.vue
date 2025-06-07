<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { Editor } from '@wangeditor/editor-for-vue'
import ChatInputBar from '@/views/workbench/Chat/components/ChatInputBar.vue'
import ChatInputEnter from '@/views/workbench/Chat/components/ChatInputEnter.vue'
import { EmojiExt } from 'vue3-emoji-picker'
import '@wangeditor/editor/dist/css/style.css'
import FilePreview from '@/components/FilePreview.vue'

const emits = defineEmits(['show-all-message'])

const editorRef = ref(undefined)
const valueHtml = ref('')
const editorWidth = ref(0)
const editorDefaultConfig = ref({
  autoFocus: false
})

const fileData = ref(null)

const handleEmojiSelect = (emoji: EmojiExt) => {
  editorRef.value?.focus()
  editorRef.value?.insertText(emoji.i)
}

const handleCollectSelect = (collect) => {
  fileData.value = collect
}

const handleEditorCreated = (editor) => {
  editorRef.value = editor
}

const handleCancelSendFile = () => {
  fileData.value = null
}

const handleSendFile = () => {
  fileData.value = null
}


onMounted(() => {
  const el = document.querySelector('#editor-container')
  editorWidth.value = el?.offsetWidth
})

onUnmounted(() => {
  editorRef.value?.destroy()
  editorRef.value = undefined
})
</script>

<template>
  <ChatInputBar @emoji-select="handleEmojiSelect" @collect-select="handleCollectSelect" @show-all-message="emits('show-all-message')"></ChatInputBar>
  <div v-if="fileData" class="layout-cc">
   <div class="layout-zy" style="height: 100px">
     <FilePreview></FilePreview>
   </div>
    <div style="margin-top: 20px">
      <el-button @click="handleCancelSendFile">取消</el-button>
      <el-button type="primary" @click="handleSendFile">发送</el-button>
    </div>
  </div>
  <template v-else>
    <div class="edit-content" id="editor-container">
      <Editor
        v-model="valueHtml"
        style="height: 100%; overflow-y: auto;"
        :style="{ width: editorWidth + 'px' }"
        mode="simple"
        :default-config="editorDefaultConfig"
        @onCreated="handleEditorCreated"
      />
    </div>
    <ChatInputEnter></ChatInputEnter>
  </template>
</template>

<style scoped lang="scss">

.edit-content {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-weight: 400;
  font-size: 14px;
  color: #212121;
  resize: none;
  min-height: 0;
  overflow: auto;
}

:deep(.w-e-text-container p) {
  margin: 0;
}

</style>
