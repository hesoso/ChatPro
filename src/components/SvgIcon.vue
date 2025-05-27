<script setup>
import { computed } from "vue";

const props = defineProps({
	name: {
		required: true,
	}
})

const iconName = computed(() =>  `#icon-${props.name}`)


</script>

<template>
  <svg class="svg-icon" aria-hidden="true">
    <use :xlink:href="iconName" />
  </svg>
</template>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: #333;
  overflow: hidden;
}
.svg-external-icon {
	background-color: #333333;
	mask-size: cover!important;
	display: inline-block;
}
</style>
