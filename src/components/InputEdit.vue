<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  value: String,
})

const readonlyFlag = ref(true)
const handleClick = () => {
  readonlyFlag.value = !readonlyFlag.value
}
const handleBlur = () => {
  readonlyFlag.value = true
}
</script>

<template>
  <div class="input-edit-wrap">
    <span v-if="readonlyFlag">{{value}}</span>
    <input v-else :value="value" type="text" @blur="handleBlur" />
    <svg-icon name="edit" @click="handleClick"></svg-icon>
  </div>
</template>

<style scoped lang="scss">
.input-edit-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  font-weight: 400;
  font-size: 16px;
  color: #3D3D3D;
  input {
    outline: none;
    margin-right: 10px;
    font-weight: 400;
    font-size: 16px;
    color: #3D3D3D;
    width: 120px;
    background: #FFFFFF;
    border-radius: 2px 2px 2px 2px;
    border: 1px solid #3686FF;
  }
}
</style>
