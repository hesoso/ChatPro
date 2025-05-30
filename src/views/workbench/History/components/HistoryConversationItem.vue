<script setup lang="ts">
const props = defineProps({
  conversation: [Number, String]
})

</script>

<template>
  <div class="conversation-item" :class="[{active: conversation === 0}]">
    <div class="img-wrap">
      <img src="@/assets/images/chat.png" alt="" />
    </div>
    <div class="conversation-content">
      <div class="layout-slide">
        <div class="title-wrap">
          <svg-icon name="mute"></svg-icon>
          <span>标题</span></div>
      </div>
      <div class="layout-slide">
        <span class="message-text">[消息内容]</span>
      </div>
    </div>
  </div>


</template>

<style scoped lang="scss">
.conversation-item {
  height: 53px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  background: #fff;

  &.active {
    background: #E1EDFF;
  }

  .img-wrap {
    width: 34px;
    height: 34px;
    position: relative;

    img {
      border-radius: 50%;
      width: 100%;
      height: 100%;
    }

    .label {
      position: absolute;
      left: -10px;
      top: -10px;
      font-size: 24px;
    }
  }

  .conversation-content {
    flex: 1;
    margin-left: 4px;

    .title-wrap {
      font-weight: 400;
      font-size: 14px;
      color: #212121;

      .svg-icon {
        font-size: 15px;
      }
    }

    .time {
      font-weight: 400;
      font-size: 11px;
      color: #999999;
    }

    .message-text {
      font-weight: 400;
      font-size: 12px;
      color: #999999;
    }

    .count {
      display: inline-block;
      font-weight: 500;
      font-size: 10px;
      color: #FFFFFF;
      padding: 2px 6px;
      min-width: 20px;
      border-radius: 20px;
      background: rgba(146, 189, 255, 0.502);
      text-align: center;

      &.active {
        background: #F54A45;
      }
    }
  }
}

.menu-text {
  font-weight: 400;
  font-size: 14px;
  color: #333333;
}

</style>
