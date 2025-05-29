<script setup lang="ts">

</script>

<template>
  <div class="input-wrap">
    <svg-icon name="search-gray"></svg-icon>
    <input type="text" placeholder="请输入关键字">
  </div>
</template>

<style scoped lang="scss">
.input-wrap {
  display: flex;
  align-items: center;
  font-size: 14px;
  background: #F6F6F6;
  border-radius: 6px;
  height: 100%;
  padding: 0 10px;
  flex: 1;
  input {
    background: transparent;
    border: none;
    outline: none;
    margin-left: 10px;
    width: 100%;
    font-size: 12px;
    &::placeholder {
      color: #8F959E;
    }
  }
}
</style>
