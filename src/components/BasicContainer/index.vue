<script lang="ts" setup>
import { getCssValue } from "@/utils/common";
interface Props {
  width?: StringNumber,
  padding?: StringNumber,
  top?: StringNumber
  radius?: StringNumber
  backgroundColor?: string
}
const props = withDefaults(defineProps<Props>(), {
  width: "calc(100% - 30px)",
  padding: 20,
  top: 0,
  radius: 8,
  backgroundColor: "#FFF"
});
const style = computed(() => {
  return {
    width: getCssValue(props.width),
    padding: getCssValue(props.padding),
    margin: `${ getCssValue(props.top) } auto 0`,
    borderRadius: getCssValue(props.radius),
    backgroundColor: props.backgroundColor
  }
})
</script>
<template>
  <div class="basic-container" :style="style">
    <slot></slot>
  </div>
</template>
<style lang="scss" scoped>
.basic-container {
  box-sizing: border-box;
  overflow: hidden;
}
</style>
