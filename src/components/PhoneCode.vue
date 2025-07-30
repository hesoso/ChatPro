<script setup lang="ts">
import { computed, ref } from 'vue'
const props = defineProps<{
  phone: string | number
}>()

const loading = ref(false)
const seconds = ref(60)
const timer = ref<NodeJS.Timeout | null>(null)

const buttonAttrs = computed(() => {
  return {
    ...(((timer && loading.value) || !props.phone )? { disabled: true } : {type: 'primary'}) 
  }
})
const sendCode = () => {
  if (loading.value || timer.value) return
  loading.value = true
  timer.value = setInterval(() => {
    if (seconds.value === 1 && timer.value) {
      clearInterval(timer.value)
      timer.value = null
      loading.value = false
    }
    seconds.value--
  }, 1000)
}
</script>

<template>
<el-button class="no-drag-area btn-auth-code" size="large" v-bind="buttonAttrs" @click="sendCode" >
  <span v-if="!loading">发送验证码</span>
  <span v-else style="margin: 0 15px">{{seconds}} S</span>
</el-button>
</template>

<style scoped lang="scss">
.btn-auth-code { 
  padding-top: 23px;
  padding-bottom: 23px;
}
span {
  font-weight: 400;
  font-size: 16px;
}
</style>
