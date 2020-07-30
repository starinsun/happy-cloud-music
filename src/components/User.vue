<template>
  <div class="user-center">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <div class="title">
      收藏夹
    </div>
    <div ref="playBtn" class="play-btn" @click="playAll">
      <i class="icon-play"></i>
      <span class="text">播放全部</span>
    </div>
    <div class="list-wrapper" ref="listWrapper">
      <base-scroll ref="favoriteList" class="list-scroll" :data="favor">
        <div class="list-inner">
          <song-list
            :songs="favor"
            @select="selectItem"
            :noneed="isShow"
          ></song-list>
        </div>
      </base-scroll>
    </div>
    <div class="no-result-wrapper" v-show="!favor.length">
      <base-none />
    </div>
    <div class="mengceng" @click="back"></div>
  </div>
</template>

<script lang="ts">
import BaseNone from "./BaseNone.vue";
import BaseScroll from "./BaseScroll.vue";
import SongList from "./SongList.vue";
import {
  computed,
  onMounted,
  watch,
  onActivated,
  ref,
  defineComponent,
} from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { PlayListType } from "../types/search.types";
import { ActionTypes } from "../types/store.types";

export default defineComponent({
  components: { BaseNone, BaseScroll, SongList },
  setup() {
    const router = useRouter(),
      store = useStore(),
      isShow = true;
    const listWrapper = ref();
    const favoriteList = ref();
    const favor = computed(() => store.getters.favor);
    function back() {
      router.go(-1);
    }
    function selectItem(item: PlayListType) {
      store.dispatch(ActionTypes.INSERT_SONG, item);
    }
    function playAll() {
      store.dispatch(ActionTypes.RANDOW_PLAY, { list: favor.value });
    }
    const playList = computed(() => store.getters.playList);
    onMounted(() => {
      _handlePlayList(playList.value);
    });
    onActivated(() => {
      _handlePlayList(playList.value);
    });
    function _handlePlayList(list: PlayListType[]) {
      const bottom = list.length > 0 ? "60px" : "";
      listWrapper.value.style.bottom = bottom;
      favoriteList.value && favoriteList.value.refresh();
    }
    watch(
      () => playList.value,
      (newV) => {
        _handlePlayList(newV);
      }
    );
    return {
      back,
      favor,
      selectItem,
      playAll,
      listWrapper,
      favoriteList,
      isShow,
    };
  },
});
</script>

<style lang="stylus" scoped>
@import "../styles/var.styl"

.user-center
  position: fixed
  top: 0
  bottom: 0
  z-index: 100
  width: 75%
  background: $black
  .back
    position absolute
    top: 0
    left: 6px
    z-index: 50
    .icon-back
      display: block
      padding: 10px
      font-size: $font-l
      color: $green
  .title
    color: $green
    margin 15px 0
    text-align center
  .play-btn
    box-sizing: border-box
    width: 135px
    padding: 7px 0
    margin: 0 auto
    text-align: center
    border: 1px solid  $grey1
    color: $green
    border-radius: 100px
    font-size: 0
    .icon-play
      display: inline-block
      vertical-align: middle
      margin-right: 6px
      font-size: $font-m
    .text
      display: inline-block
      vertical-align: middle
      font-size: $font-s
  .list-wrapper
    position: absolute
    top: 88px
    bottom: 0
    width: 100%
    .list-scroll
      height: 100%
      overflow: hidden
      .list-inner
        padding: 20px 30px
  .no-result-wrapper
    position: absolute
    width: 100%
    top: 50%
    transform: translateY(-50%)
  .mengceng
    position fixed
    top 0
    bottom 0
    left 75%
    right 0
    filter blur(1px) opacity(0.5)
    background-color #000
</style>
