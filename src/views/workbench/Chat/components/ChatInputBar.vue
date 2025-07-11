<script setup lang="ts">
import { ref } from 'vue'
import { useFileDialog } from '@vueuse/core'
import EmojiPicker, { EmojiExt } from 'vue3-emoji-picker'
import 'vue3-emoji-picker/css'
import ChatInputBarCollect from '@/views/workbench/Chat/components/ChatInputBarCollect.vue'
import ChatInputBarGif from '@/views/workbench/Chat/components/ChatInputBarGif.vue'

const emits = defineEmits(['emoji-select', 'collect-select', 'show-all-message','file-select'])
const optionsRefs = ref([])
const showEmojiPopover = ref(false)
const showCollectPopover = ref(false)
const showGifPopover = ref(false)

const { files, open, reset, onChange } = useFileDialog(
  {
    multiple:true,//可选：是否可以多选文件
    accept:".docx,.doc,.pdf,.xlx",//可选：自定义上传文件类型
    reset:true,//可选：再次选择时是否把之前选的文件清除
    capture:"user" //可选：调用设备媒体 camera camcorder microphone user(相机前置摄像头)
  }
)

onChange((fileList) => {
  console.log(fileList)
  emits('file-select',fileList && fileList[0])
})

const options = ref([{
  iconName: '表情',
  onClick: () => {
    showEmojiPopover.value = true
  }
}, {
  iconName: '收藏'
}, {
  iconName: 'gif'
}, {
  iconName: '文件',
  onClick: () => {
    open()
  }
}, {
  iconName: '消息记录',
  onClick: () => {
    emits('show-all-message')
  }
}])

function onSelectEmoji(emoji: EmojiExt) {
  emits('emoji-select', emoji)
  showEmojiPopover.value = false
  /*
    // emoji
    {
        i: "😚",
        n: ["kissing face"],
        r: "1f61a", // with skin tone
        t: "neutral", // skin tone
        u: "1f61a" // without tone
    }
    */
}
function onSelectCollect (collect) {
  emits('collect-select', collect)
  showCollectPopover.value = false
  showGifPopover.value = false
}

const handleClick = (item) => {
  item.onClick && item.onClick()
}
</script>

<template>
  <div class="chat-input-bar" ref="emojiRef">
    <div ref="optionsRefs" class="options" v-for="(item, index) in options" :key="index" @click="handleClick(item)">
      <svg-icon :name="item.iconName"></svg-icon>
    </div>
  </div>
  <!-- emoji弹窗 -->
  <el-popover
    v-if="showEmojiPopover"
    popper-class="emoji-popover"
    ref="popoverRef"
    v-model:visible="showEmojiPopover"
    :virtual-ref="optionsRefs[0]"
    :show-arrow="false"
    width="280"
    placement="top-start"
    trigger="click"
    virtual-triggering
  >
    <div class="emoji-content">
      <EmojiPicker mode="append" :display-recent="true" :hide-group-names="true" :hide-search="true"
                   :disable-skin-tones="true"
                   :disable-sticky-group-names="true" @select="onSelectEmoji" />
    </div>
  </el-popover>
  <!-- 收藏弹窗 -->
  <el-popover
    popper-class="emoji-popover"
    ref="popoverRef"
    v-model:visible="showCollectPopover"
    :virtual-ref="optionsRefs[1]"
    :show-arrow="false"
    width="479"
    placement="top-start"
    trigger="click"
    virtual-triggering
  >
    <ChatInputBarCollect v-if="showCollectPopover" @select="onSelectCollect"></ChatInputBarCollect>
  </el-popover>
  <!-- gif弹窗 -->
  <el-popover
    popper-class="emoji-popover"
    ref="popoverRef"
    v-model:visible="showGifPopover"
    :virtual-ref="optionsRefs[2]"
    :show-arrow="false"
    width="479"
    placement="top-start"
    trigger="click"
    virtual-triggering
  >
    <ChatInputBarGif v-if="showGifPopover" @select="onSelectCollect"> </ChatInputBarGif>
  </el-popover>

</template>

<style scoped lang="scss">
.chat-input-bar {
  height: 38px;
  display: flex;
  align-items: center;
  padding: 2px 8px;

  .options {
    font-size: 16px;
    cursor: pointer;
    padding: 8px 10px;
    border-radius: 4px;

    &:hover {
      background-color: #F6F6F6;
    }
  }
}

.emoji-content {
  :deep(.v3-emoji-picker) {
    background: transparent;
    box-shadow: none;
    #recent {
      border-bottom: 1px solid var(--v3-picker-border);
    }
    .v3-footer {
      display: none;
    }
  }
}
</style>
