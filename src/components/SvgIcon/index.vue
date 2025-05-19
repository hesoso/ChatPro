<script setup>
import {computed} from "vue";

const props = defineProps({
	iconClass: {
		required: true,
	},
	className: {
		default: ''
	}
})

function isExternalHandler(path) {
	return /^(https?:|mailto:|tel:)/.test(path)
}

const isExternal = computed(() => isExternalHandler(props.iconClass))
const iconName = computed(() =>  `#icon-${props.iconClass}`)
const svgClass = computed(() =>  props.className ? 'svg-icon ' + props.className : 'svg-icon')
const styleExternalIcon = computed(() => ({
	mask: `url(${props.iconClass}) no-repeat 50% 50%`,
	'-webkit-mask': `url(${props.iconClass}) no-repeat 50% 50%`
}))

</script>

<template>
  <div v-if="isExternal" :style="styleExternalIcon" class="svg-external-icon svg-icon" v-on="$listeners" />
  <svg v-else :class="svgClass" aria-hidden="true" v-on="$listeners">
    <use :xlink:href="iconName" />
  </svg>
</template>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  min-width: 1em;
  min-height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

.svg-external-icon {
  background-color: currentColor;
  mask-size: cover!important;
  display: inline-block;
}
</style>
