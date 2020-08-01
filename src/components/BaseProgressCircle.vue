<template>
  <div class="progress-circle">
    <svg
      :width="radius"
      :height="radius"
      viewBox="0 0 100 100"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        class="progress-background"
        r="50"
        cx="50"
        cy="50"
        fill="transparent"
      />
      <circle
        class="progress-bar"
        r="50"
        cx="50"
        cy="50"
        fill="transparent"
        :stroke-dasharray="val"
        :stroke-dashoffset="dashoffset"
      />
    </svg>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { reactive, computed, defineComponent, toRefs } from "vue";

export default defineComponent({
  name: "BaseProgressCircle",
  props: {
    radius: {
      type: Number,
      default: 100,
    },
    percent: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    const state = reactive({
      val: Math.PI * 100,
    });
    const dashoffset = computed(() => (1 - props.percent) * state.val);
    return {
      ...toRefs(state),
      dashoffset,
    };
  },
});
</script>

<style lang="stylus" scoped>
@import "../styles/var.styl"

.progress-circle
  position relative
  circle
    stroke-width 8px
    transform-origin center
    &.progress-background
      transform scale(0.9)
      stroke $green
    &.progress-bar
      transform scale(0.9) rotate(-90deg)
      stroke $white
</style>
