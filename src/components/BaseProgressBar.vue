<template>
  <div class="progress-bar" ref="bar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-bar-wrapper">
        <div
          class="progress-btn"
          ref="btn"
          @touchstart.prevent="ptouchStart"
          @touchmove.prevent="ptouchMove"
          @touchend="ptouchEnd"
        ></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { watch, ref, defineComponent } from "vue";
import { Itouch } from "../types/scroll.types";
const BALL_WIDTH = 16;

export default defineComponent({
  name: "BaseProgressBar",
  props: {
    percent: {
      type: Number,
      default: 0,
    },
  },
  setup(props, { emit }) {
    let touch: Itouch = {
      init: false,
      percent: 0,
      startX: 0,
      startY: 0,
      left: 0,
    };
    const bar = ref();
    const progress = ref();
    const btn = ref();
    watch(
      () => props.percent,
      (newP) => {
        if (newP >= 0 && !touch.init) {
          const barWidth = bar.value.clientWidth - BALL_WIDTH;
          const offsetWidth = newP * barWidth;
          _offsetW(offsetWidth);
        }
      }
    );
    function ptouchStart(e: TouchEvent) {
      touch.init = true;
      touch.startX = e.touches[0].pageX;
      touch.left = progress.value.clientWidth;
    }
    function ptouchMove(e: TouchEvent) {
      if (!touch.init) return;
      const deltaX = e.touches[0].pageX - touch.startX;
      const offsetWidth = Math.min(
        bar.value.clientWidth - BALL_WIDTH,
        Math.max(0, touch.left + deltaX)
      );
      _offsetW(offsetWidth);
    }
    function ptouchEnd() {
      touch.init = false;
      _triggerPercent();
    }
    function progressClick(e: any) {
      _offsetW(e.offsetX);
      _triggerPercent();
    }
    function _triggerPercent() {
      const barWidth = bar.value.clientWidth - BALL_WIDTH;
      const percent = progress.value.clientWidth / barWidth;
      emit("percentChange", percent);
    }
    function _offsetW(offsetWidth: number) {
      progress.value.style.width = `${offsetWidth}px`;
      btn.value.style["transform"] = `translate3d(${offsetWidth}px,0,0)`;
    }
    return {
      bar,
      progress,
      btn,
      ptouchMove,
      ptouchStart,
      ptouchEnd,
      progressClick,
    };
  },
});
</script>

<style lang="stylus" scoped>
@import "../styles/var.styl"

.progress-bar
  height 30px
  .bar-inner
    position relative
    top 13px
    height 4px
    background rgba(0, 0, 0, 0.3)
    .progress
      position absolute
      height 100%
      background $grey1
    .progress-bar-wrapper
      position absolute
      left -8px
      top -13px
      width 30px
      height 30px
      .progress-btn
        position relative
        top 7px
        left 7px
        box-sizing border-box
        width 16px
        height 16px
        border 3px solid $green
        border-radius 50%
        background $black
</style>
