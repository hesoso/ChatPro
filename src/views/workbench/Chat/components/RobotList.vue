<script setup lang="ts">
import { ref } from 'vue'
const robotList = ref([
  {
    id: Symbol(),
    robotType: '',
    robotName: '桦',
  },
  {
    id: Symbol(),
    robotType: '',
    robotName: '小陈',
  },
  {
    id: Symbol(),
    robotType: '',
    robotName: '机器人3',
  }
])

const curRobot = ref(robotList.value[0])


const handleRobotChange = (robot) => {
  curRobot.value = robot
}
</script>

<template>
<ul class="robot-list">
  <li v-for="item in robotList" :key="item.id" class="robot-item" :class="[{active: item.id === curRobot.id }]" @click="handleRobotChange(item)">
    <div class="avatar-wrap">
      <img src="@/assets/images/weixin.png" alt="" class="avatar">
      <img src="@/assets/images/qw_.png" alt="" class="avatar-icon">
    </div>
    <span>{{item.robotName}}</span>
  </li>
</ul>
</template>

<style scoped lang="scss">
.robot-list {
  width: 60px;
  height: 100%;
  background: #EAEAEA;
  padding: 8px;
  .robot-item {
    margin-top: 10px;
    font-size: 12px;
    opacity: 0.5;
    text-align: center;
    cursor: pointer;
    .avatar-wrap {
      width: 40px;
      height: 40px;
      background: #EAEAEA;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      position: relative;
      margin-top: 8px;
      .avatar-icon {
        width: 13px;
        height: 13px;
        position: absolute;
        bottom: 0;
        right: 0;
      }
      .avatar {
        width: 34px;
        height: 34px;
        border-radius: 50%;
      }
    }
    &.active {
      opacity: 1;
      .avatar-wrap {
        background: #fff;
      }
    }
  }
}
</style>
