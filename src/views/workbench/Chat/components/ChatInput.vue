<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { Editor } from '@wangeditor/editor-for-vue'
import ChatInputBar from '@/views/workbench/Chat/components/ChatInputBar.vue'
import ChatInputEnter from '@/views/workbench/Chat/components/ChatInputEnter.vue'
import { EmojiExt } from 'vue3-emoji-picker'
import '@wangeditor/editor/dist/css/style.css'


const editorRef = ref(undefined)
const valueHtml = ref('')
const editorWidth = ref(0)
const editorDefaultConfig = ref({
  autoFocus: false
})


const handleEmojiSelect = (emoji: EmojiExt) => {
  editorRef.value?.focus()
  editorRef.value?.insertText(emoji.i)
}

const handleEditorCreated = (editor) => {
  editorRef.value = editor
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
  <ChatInputBar @emoji-select="handleEmojiSelect"></ChatInputBar>
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

<style scoped lang="scss">

.edit-content {
  flex: 1;
  border: none;
  padding-left: 10px;
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
