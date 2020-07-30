<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import {
  ref,
  onMounted,
  watch,
  getCurrentInstance,
  defineComponent,
} from "vue";
import BScroll from "better-scroll";

export default defineComponent({
  name: "BaseScroll",
  props: {
    probeType: {
      type: Number,
      default: 1,
    },
    click: {
      type: Boolean,
      default: true,
    },
    data: {
      type: Array,
      default: null,
    },
    listenScroll: {
      type: Boolean,
      default: false,
    },
    pullup: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const wrapper = ref();
    const instance = getCurrentInstance();

    let scroll: BScroll;
    onMounted(() => {
      instance?.proxy?.$nextTick(() => {
        _initScroll();
      });
    });
    watch(
      () => props.data,
      () => {
        instance?.proxy?.$nextTick(() => {
          refresh();
        });
      }
    );

    function _initScroll() {
      if (!wrapper.value) return;
      scroll = new BScroll(wrapper.value, {
        probeType: props.probeType,
        click: props.click,
      });
      if (props.listenScroll) {
        scroll.on("scroll", (pos: any) => {
          emit("scroll", pos);
        });
      }
      if (props.pullup) {
        scroll.on("scrollEnd", () => {
          if (scroll.y <= scroll.maxScrollY + 50) {
            emit("scrollToEnd");
          }
        });
      }
    }
    // function _enable() {
    //   scroll.enable();
    // }
    // function _disable() {
    //   scroll.disable();
    // }
    function scrollTo(x: number, y: number, time?: number, easing?: object) {
      scroll.scrollTo(x, y, time, easing);
    }
    function scrollToElement(
      el: HTMLElement | string,
      time?: number,
      offsetX?: number | boolean,
      offsetY?: number | boolean,
      easing?: object
    ) {
      scroll.scrollToElement(el, time, offsetX, offsetY, easing);
    }
    function refresh() {
      scroll?.refresh();
    }
    return { wrapper, refresh, scrollTo, scrollToElement };
  },
});
</script>
