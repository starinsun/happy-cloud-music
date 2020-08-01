<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span
        class="dot"
        v-for="(dot, index) in dots"
        :key="index"
        :class="{ active: currentPage === index }"
      ></span>
    </div>
  </div>
</template>

<script lang="ts">
import {
  onMounted,
  ref,
  reactive,
  onBeforeUnmount,
  defineComponent,
  toRefs,
  getCurrentInstance,
} from "vue";
import BScroll from "better-scroll";

export default defineComponent({
  name: "BaseSlider",
  setup() {
    const sliderGroup = ref();
    const slider = ref();
    const state = reactive({ name: "dots", dots: {}, currentPage: 0 });
    let bscroll: BScroll,
      timer: any,
      instance = getCurrentInstance();

    onMounted(() => {
      instance?.proxy?.$nextTick(() => {
        _setSliderWidth();
        _initDots();
        _initSlider();
        _autoPlay();
      });
      window.addEventListener("resize", () => {
        _setSliderWidth(true);
      });
    });
    onBeforeUnmount(() => {
      clearTimeout(timer);
    });

    function _setSliderWidth(isRest?: boolean) {
      let children = sliderGroup.value.children;
      let width = slider.value.clientWidth;
      for (let i = 0; i < children.length; i++) {
        children[i].classList.add("slider-item");
        children[i].style.width = width + "px";
      }
      //FIXME:这里留出了左右两边的DOM宽度，如3个图片，最终是5个宽度
      if (!isRest) {
        sliderGroup.value.style.width = width * (children.length + 2) + "px";
      } else {
        sliderGroup.value.style.width = width * children.length + "px";
      }
    }
    function _initSlider() {
      bscroll = new BScroll(slider.value, {
        scrollX: true,
        scrollY: true,
        momentum: false,
        click: true,
        snap: {
          loop: true,
          threshold: 0.3,
          speed: 400,
        },
      });
      bscroll.on("scrollEnd", () => {
        let pageIdx = bscroll.getCurrentPage().pageX;
        state.currentPage = pageIdx;
        _autoPlay();
      });
    }
    function _initDots() {
      state.dots = new Array(sliderGroup.value.children.length);
    }
    function _autoPlay() {
      clearTimeout(timer);
      timer = setTimeout(() => {
        bscroll.next();
      }, 2333);
    }
    return { ...toRefs(state), sliderGroup, slider };
  },
});
</script>

<style lang="stylus" scoped>
@import "../styles/var.styl"

.slider
  min-height 1px
  position relative
  .slider-group
    position relative
    overflow hidden
    white-space nowrap
    .slider-item
      float left
      box-sizing border-box
      overflow hidden
      text-align center
  .dots
    position absolute
    right 0
    left 0
    bottom 10px
    text-align center
    .dot
      display inline-block
      margin 0 4px
      width 8px
      height 8px
      border-radius 50%
      background $grey2
      &.active
        width 15px
        border-radius 5px
        background $green2
</style>
