<template>
  <base-scroll
    class="listview"
    :data="data"
    ref="listview"
    :listenScroll="true"
    :probeType="Number(3)"
    @scroll="scroll"
  >
    <ul v-show="data.length" ref="listgroup">
      <li v-for="(item, idx) in singerTag" class="list-group" :key="item.key">
        <h2 class="list-group-title">{{ item.name }}</h2>
        <ul>
          <li
            v-for="item in data[idx]"
            :key="item.singer_id"
            class="list-group-item"
            @click="selectItem(item)"
          >
            <img :src="item.picUrl" class="avatar" />
            <span class="name">{{ item.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div
      class="list-shortcut"
      @touchstart="onTagTouchStart"
      @touchmove.stop.prevent="onTagTouchMove"
    >
      <ul>
        <li
          v-for="(item, idx) in tagList"
          class="item"
          :class="{ current: currentIdx === idx }"
          :key="idx"
          :data-index="idx"
        >
          {{ item }}
        </li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixedTitle" ref="listfixed">
      <h1 class="fixed-title">
        {{ fixedTitle }}
      </h1>
    </div>
    <div v-show="!data.length" class="loading-container">
      <base-loading></base-loading>
    </div>
  </base-scroll>
</template>

<script lang="ts">
import BaseScroll from "../components/BaseScroll.vue";
import BaseLoading from "../components/BaseLoading.vue";
import { singerTag } from "../utils/help";
import { Ipos } from "../types/scroll.types";
import {
  computed,
  ref,
  reactive,
  watch,
  defineComponent,
  getCurrentInstance,
  toRefs,
} from "vue";

interface Itouch {
  y1: number;
  y2: number;
  idx: number;
}

export default defineComponent({
  name: "ListView",
  props: {
    data: {
      type: Array,
      default: null,
    },
  },
  components: { BaseScroll, BaseLoading },
  setup(props, { emit }) {
    const instance = getCurrentInstance();
    const listview = ref();
    const listgroup = ref();
    const listfixed = ref();
    const state = reactive({
      scrollY: -1,
      currentIdx: 0,
    });
    const tagList = computed(() => singerTag.map((item) => item.name));
    const fixedTitle = computed(() => {
      if (state.scrollY > 0) return "";
      return props.data[state.currentIdx]
        ? tagList.value[state.currentIdx]
        : "";
    });
    let touch: Itouch = { y1: 0, y2: 0, idx: -1 },
      ARCHOR_HEIGHT = 20,
      listHeight: any[] = [];
    function onTagTouchStart(e: TouchEvent) {
      // @ts-ignore
      let idx = e?.target?.getAttribute("data-index");
      let firstTouch = e.touches[0];
      touch.y1 = firstTouch.pageY;
      touch.idx = idx;
      _scrollTo(idx);
    }
    function onTagTouchMove(e: TouchEvent) {
      let firstTouch = e.touches[0];
      touch.y2 = firstTouch.pageY;
      let delta = ((touch.y2 - touch.y1) / ARCHOR_HEIGHT) | 0;
      let idx = +touch.idx + delta;
      _scrollTo(idx);
    }
    function refresh() {
      listview.value.refresh();
    }
    function scroll(pos: Ipos) {
      state.scrollY = pos.y;
    }
    function _scrollTo(idx: number) {
      listview.value.scrollToElement(listgroup.value.children[idx], 0);
    }
    function _calculateHeight() {
      listHeight = [];
      const list = listgroup.value.children;
      let height = 0;
      listHeight.push(height);
      for (let i = 0; i < list.length; i++) {
        let item = list[i];
        height += item.clientHeight;
        listHeight.push(height);
      }
    }
    function selectItem(item: any) {
      emit("select", item);
    }
    watch(
      () => props.data,
      () => {
        instance?.proxy?.$nextTick(() => {
          _calculateHeight();
        });
      },
      {
        immediate: true,
      }
    );
    watch(
      () => state.scrollY,
      (newY) => {
        for (let i = 0; i < listHeight.length - 1; i++) {
          if (newY > 0) {
            state.currentIdx = 0;
            return;
          }
          let h1 = listHeight[i],
            h2 = listHeight[i + 1];
          if (-newY >= h1 && -newY < h2) {
            state.currentIdx = i;
            return;
          }
        }
      }
    );
    return {
      ...toRefs(state),
      singerTag,
      tagList,
      listview,
      onTagTouchStart,
      onTagTouchMove,
      listgroup,
      listfixed,
      scroll,
      fixedTitle,
      selectItem,
      refresh,
    };
  },
});
</script>

<style lang="stylus" scoped>
@import "../styles/var.styl"

.listview
  position: relative
  width: 100%
  height: 100%
  overflow: hidden
  background: $grey1
  .list-group
    padding-bottom: 30px
    .list-group-title
      height: 30px
      line-height: 30px
      padding-left: 25px
      font-size: $font-m
      color: $green-dark
      background: $grey3
    .list-group-item
      display: flex
      align-items: center
      padding: 20px 0 0 30px
      .avatar
        width: 50px
        height: 50px
        border-radius: 50%
      .name
        margin-left: 20px
        color: $green
        font-size: $font-m
  .list-shortcut
    position: absolute
    z-index: 30
    right: 0
    top: 50%
    transform: translateY(-50%)
    width: 40px
    padding: 10px 0
    border-radius: 10px
    text-align: center
    background: $grey2
    font-family: Helvetica
    .item
      padding: 4px
      line-height: 1
      color: $green
      font-size: $font-s
      &.current
        color: $red
  .list-fixed
    position: absolute
    top: 0
    left: 0
    width: 100%
    .fixed-title
      height: 30px
      line-height: 30px
      padding-left: 25px
      font-size: $font-m
      color: $green-dark
      background: $grey2
  .loading-container
    position: absolute
    width: 100%
    top: 40%
    transform: translateY(-50%)
</style>
