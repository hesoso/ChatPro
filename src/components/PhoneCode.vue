<script setup lang="ts">
import { ref } from 'vue'
const props = defineProps({
  phone: {
    type: [Number, String],
    required: true,
  }
})

const loading = ref(false)
const seconds = ref(60)


let timer: NodeJS.Timeout | number  = -1
const sendCode = () => {
  if (loading.value) return
  loading.value = true
  timer = setInterval(() => {
    if (seconds.value === 1) {
      clearInterval(timer)
    }
    seconds.value--
  }, 1000)
}
</script>

<template>
<el-button class="no-drag-area" size="large" type="primary" @click="sendCode">
  <span v-if="!loading">发送验证码</span>
  <span v-else style="margin: 0 15px">{{seconds}} S</span>
</el-button>
</template>

<style scoped lang="scss">
span {
  font-weight: 400;
  font-size: 16px;
  color: #FFFFFF;
}
</style>
