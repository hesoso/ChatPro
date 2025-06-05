<script setup lang="ts">
import { ref } from 'vue'
import SvgIcon from '@/components/SvgIcon.vue'
import EmojiPicker, { EmojiExt } from 'vue3-emoji-picker'
import 'vue3-emoji-picker/css'

const emits = defineEmits(['emoji-select'])
const optionsRefs = ref([])
const showEmojiPopover = ref(false)

const options = ref([{
  iconName: '表情'
}, {
  iconName: '收藏'
}, {
  iconName: 'gif'
}, {
  iconName: '文件'
}, {
  iconName: '消息记录'
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
</script>

<template>
  <div class="chat-input-bar" ref="emojiRef">
    <div ref="optionsRefs" class="options" v-for="(item, index) in options" :key="index">
      <svg-icon :name="item.iconName"></svg-icon>
    </div>
  </div>
  <!-- emoji弹窗 -->
  <el-popover
    popper-class="emoji-popover"
    ref="popoverRef"
    v-model:visible="showEmojiPopover"
    :virtual-ref="optionsRefs[0]"
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
