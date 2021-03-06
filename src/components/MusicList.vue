<template>
  <div class="music-list">
    <div class="back" @click="goBack">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImg">
      <div class="play-wrapper" v-show="songs.length" ref="playBtn">
        <div class="play" @click="random">
          <i class="icon-play"></i>
          <span class="text">随机播放歌曲</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layers"></div>
    <base-scroll
      @scroll="scroll"
      :probeType="PROBETYPE"
      :listenScroll="LISTEN_SCROLL"
      :data="songs"
      class="list"
      ref="list"
    >
      <div class="song-list-wrapper">
        <song-list @select="selectItem" :songs="songs" :rank="rank"></song-list>
      </div>
    </base-scroll>
  </div>
</template>

<script lang="ts">
import {
  computed,
  onMounted,
  ref,
  watch,
  reactive,
  onActivated,
  defineComponent,
  PropType,
} from "vue";
import BaseScroll from "./BaseScroll.vue";
import SongList from "./SongList.vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { Ipos } from "../types/scroll.types";
import { PlayListType } from "../types/search.types";
import { ActionTypes } from "../types/store.types";
export default defineComponent({
  name: "MusicList",
  props: {
    bgImage: {
      type: String,
      default: "",
    },
    songs: {
      type: Array as PropType<PlayListType[]>,
      default: () => [],
    },
    title: {
      type: String,
      default: "",
    },
    rank: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    BaseScroll,
    SongList,
  },
  setup(props) {
    const PROBETYPE = 3,
      LISTEN_SCROLL = true,
      RESERVE_HEIGHT = 40,
      router = useRouter(),
      store = useStore();
    const list = ref();
    const bgImg = ref();
    const layers = ref();
    const filter = ref();
    const playBtn = ref();
    const scrollData = reactive({ scrollY: 0, minTranslateY: 0 });
    const playList = computed<PlayListType>(() => store.getters.playList);
    const bgStyle = computed(() => `background-image:url(${props.bgImage})`);
    onMounted(() => {
      scrollData.minTranslateY = -bgImg.value.clientHeight + RESERVE_HEIGHT;
      list.value.$el.style.top = `${bgImg.value.clientHeight}px`;
      _handlePlayList(playList.value);
    });
    onActivated(() => {
      _handlePlayList(playList.value);
    });
    function _handlePlayList(playlist: any) {
      const bottom = playlist.length > 0 ? "55px" : "";
      list.value.$el.style.bottom = bottom;
      list.value.refresh();
    }
    function scroll(pos: Ipos) {
      scrollData.scrollY = pos.y;
    }
    function goBack() {
      router.back();
    }
    function selectItem(song: PlayListType, idx: number) {
      store.dispatch(ActionTypes.SELECT_PLAY, {
        list: props.songs,
        index: idx,
      });
    }
    function random() {
      store.dispatch(ActionTypes.RANDOW_PLAY, { list: props.songs });
    }
    watch(
      () => playList.value,
      (newV) => {
        _handlePlayList(newV);
      }
    );
    watch(
      () => scrollData.scrollY,
      (newY) => {
        let translatey = Math.max(newY, scrollData.minTranslateY),
          zidx = 0,
          scale = 1,
          percent = Math.abs(newY / bgImg.value.clientHeight),
          blur = 0;
        layers.value.style["transform"] = `translate3d(0,${translatey}px,0)`;
        if (newY > 0) {
          scale = 1 + percent;
          zidx = 10;
        } else {
          blur = Math.min(20, 20 * percent);
        }
        filter.value.style["backdrop-filter"] = `blur(${blur}px)`;
        if (newY < scrollData.minTranslateY) {
          zidx = 10;
          bgImg.value.style.paddingTop = 0;
          bgImg.value.style.height = `${RESERVE_HEIGHT}px`;
          playBtn.value.style.display = "none";
        } else {
          bgImg.value.style.paddingTop = "70%";
          bgImg.value.style.height = 0;
          playBtn.value.style.display = "";
        }
        bgImg.value.style.zIndex = zidx;
        bgImg.value.style["transform"] = `scale(${scale})`;
      }
    );
    return {
      bgStyle,
      list,
      bgImg,
      layers,
      PROBETYPE,
      LISTEN_SCROLL,
      scrollData,
      scroll,
      filter,
      goBack,
      playBtn,
      selectItem,
      random,
    };
  },
});
</script>

<style scoped lang="stylus">
@import "../styles/var.styl"

.music-list
  position: fixed
  z-index: 100
  top: 0
  left: 0
  bottom: 0
  right: 0
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
    position: absolute
    top: 0
    left: 10%
    z-index: 40
    width: 80%
    text-overflow: ellipsis
    overflow: hidden
    white-space: nowrap
    text-align: center
    line-height: 40px
    font-size: $font-l
    color: $green
  .bg-image
    position: relative
    width: 100%
    height: 0
    padding-top: 70%
    transform-origin: top
    background-size: cover
    .play-wrapper
      position: absolute
      bottom: 20px
      z-index: 50
      width: 100%
      .play
        box-sizing: border-box
        width: 135px
        padding: 7px 0
        margin: 0 auto
        text-align: center
        border: 1px solid $green
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
    .filter
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
      background: rgba(7, 17, 27, 0.4)
  .bg-layer
    position: relative
    height: 100%
    background: $black
  .list
    position: fixed
    top: 0
    bottom: 0
    width: 100%
    background: $black
    .song-list-wrapper
      padding: 20px 30px
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
