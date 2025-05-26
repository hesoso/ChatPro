<script setup lang="ts">
const props = defineProps({
  conversation: Number,
})

</script>

<template>
<div class="conversation-item">
  {{ conversation}}
</div>
</template>

<style scoped lang="scss">
.conversation-item {
  height: 53px
}
</style>
