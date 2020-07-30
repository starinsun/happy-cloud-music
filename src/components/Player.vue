<template>
  <div class="player" v-show="playList.length > 0">
    <transition name="normal">
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.img" />
        </div>
        <div class="top">
          <div class="back" @click="miniPlay">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="singer"></h2>
        </div>
        <div
          class="middle"
          @touchstart.prevent="midTouchStart"
          @touchmove.prevent="midTouchMove"
          @touchend="midTouchEnd"
        >
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper">
              <div class="cd">
                <img class="image" :class="cdClass" :src="currentSong.img" />
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">
                {{ playingLyric }}
              </div>
            </div>
          </div>
          <base-scroll class="middle-r" ref="lyricList" :data="lyric?.lines">
            <div class="lyric-wrapper">
              <div v-if="lyric">
                <p
                  ref="lyricLines"
                  class="text"
                  :class="{ current: currentLineNum === idx }"
                  v-for="(line, idx) in lyric.lines"
                  :key="idx"
                >
                  {{ line.txt }}
                </p>
              </div>
            </div>
          </base-scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{ active: currentShow === 'cd' }"></span>
            <span
              class="dot"
              :class="{ active: currentShow === 'lyric' }"
            ></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{ format(currentTime) }}</span>
            <div class="progress-bar-wrapper">
              <base-progress-bar
                @percentChange="barChange"
                :percent="percent"
              ></base-progress-bar>
            </div>
            <span class="time time-r">{{ format(currentSong.interval) }}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" @click="changeMode">
              <i :class="iconMode"></i>
            </div>
            <div class="icon i-left" :class="noClass">
              <i @click="prev" class="icon-prev"></i>
            </div>
            <div class="icon i-center" :class="noClass">
              <i @click="togglePlaying" :class="playIcon"></i>
            </div>
            <div class="icon i-right" :class="noClass">
              <i @click="next" class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i
                @click="toggleFavor(currentSong)"
                :class="getFavorIcon(currentSong)"
              ></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="fullScreenPlay">
        <div class="icon">
          <div class="imgWrapper">
            <img
              width="40"
              height="40"
              :src="currentSong.img"
              :class="cdClass"
            />
          </div>
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="singer"></p>
        </div>
        <div class="control">
          <base-progress-circle :radius="radius" :percent="percent">
            <i
              class="icon-mini"
              @click.stop="togglePlaying"
              :class="miniIcon"
            ></i>
          </base-progress-circle>
        </div>
        <div class="control" @click.stop="showPlayList">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <play-list ref="playComponent"></play-list>
    <audio
      :src="currentSong.audio"
      ref="audio"
      @canplay="ready"
      @error="error"
      @timeupdate="timeUpdate"
      @ended="end"
    ></audio>
  </div>
</template>

<script lang="ts">
import {
  computed,
  ref,
  watch,
  reactive,
  getCurrentInstance,
  toRefs,
} from "vue";
import { MutationTypes } from "../types/store.types";
import BaseProgressBar from "./BaseProgressBar.vue";
import BaseProgressCircle from "./BaseProgressCircle.vue";
import BaseScroll from "./BaseScroll.vue";
import PlayList from "./PlayList.vue";
import Lyric from "lyric-parser";
import { useStore } from "vuex";
import { artistType, PlayListType } from "../types/search.types";
import { Itouch } from "../types/scroll.types";

export default {
  components: { BaseProgressBar, BaseProgressCircle, BaseScroll, PlayList },
  setup() {
    const store = useStore();
    const audio = ref();
    const lyricList = ref();
    const lyricLines = ref();
    const middleL = ref();
    const playComponent = ref();
    let lyric = ref();
    let touch: Itouch = {
      init: false,
      percent: 0,
      startX: 0,
      startY: 0,
      left: 0,
    };
    const instance = getCurrentInstance();
    const state = reactive({
      ready: false,
      currentTime: 0,
      radius: 32,
      currentLineNum: 0,
      currentShow: "cd",
      playingLyric: "",
    });
    const fullScreen = computed(() => store.getters.fullScreen);
    const playList = computed(() => store.getters.playList);
    const currentSong = computed(() => store.getters.currentSong);
    const playing = computed(() => store.getters.playing);
    const currentIdx = computed(() => store.getters.currentIdx);
    const sequenceList = computed(() => store.getters.sequenceList);
    const mode = computed(() => store.getters.mode);
    const iconMode = computed(() =>
      mode.value === 0
        ? "icon-sequence"
        : mode.value === 1
        ? "icon-loop"
        : "icon-random"
    );
    const singer = computed(() => {
      let strs = currentSong.value.singer
        ? currentSong.value.singer.map((v: artistType) => v.name)
        : [];
      return strs.join(" & ");
    });
    const playIcon = computed(() =>
      playing.value ? "icon-pause" : "icon-play"
    );
    const miniIcon = computed(() =>
      playing.value ? "icon-pause-mini" : "icon-play-mini"
    );
    const cdClass = computed(() => (playing.value ? "play" : "play pause"));
    const noClass = computed(() => (state.ready ? "" : "disable"));
    const percent = computed(
      () => state.currentTime / currentSong.value.interval
    );
    function miniPlay() {
      store.commit(MutationTypes.SET_FULL_SCREEN, false);
    }
    function fullScreenPlay() {
      store.commit(MutationTypes.SET_FULL_SCREEN, true);
    }
    function togglePlaying() {
      if (!state.ready) return;
      store.commit(MutationTypes.SET_PLAYING_STATE, !playing.value);
      lyric.value?.togglePlay();
    }
    function next() {
      if (!state.ready) return;
      if (playList.value.length === 1) {
        _loop();
      } else {
        let idx = currentIdx.value + 1;
        if (idx === playList.value.length) idx = 0;
        store.commit(MutationTypes.SET_CURRENT_IDX, idx);
        if (!playing.value) {
          togglePlaying();
        }
      }
      state.ready = false;
    }
    function prev() {
      if (!state.ready) return;
      if (playList.value.length === 1) {
        _loop();
      } else {
        let idx = currentIdx.value - 1;
        if (idx === -1) idx = playList.value.length - 1;
        store.commit(MutationTypes.SET_CURRENT_IDX, idx);
        if (!playing.value) {
          togglePlaying();
        }
      }
      state.ready = false;
    }
    function ready() {
      state.ready = true;
    }
    function error() {
      state.ready = true;
    }
    function end() {
      if (mode.value === 1) {
        _loop();
      } else {
        next();
      }
    }
    function timeUpdate(e: any) {
      state.currentTime = e.target.currentTime;
    }
    function format(interval: number) {
      interval = interval | 0;
      const min = (interval / 60) | 0;
      const sec = (interval % 60).toString().padStart(2, "0");
      return `${min}:${sec}`;
    }
    function barChange(percent: number) {
      audio.value.currentTime = currentSong.value.interval * percent;
      if (!playing.value) togglePlaying();
      lyric.value?.seek(audio.value.currentTime * 1000);
    }
    function changeMode() {
      const modetype = (mode.value + 1) % 3;
      store.commit(MutationTypes.SET_MODE, modetype);
      let list = sequenceList.value.slice();
      if (mode.value === 2) {
        list.sort(() => 0.5 - Math.random());
      }
      _resetIdx(list);
      store.commit(MutationTypes.SET_PLAYLIST, list);
    }
    function midTouchStart(e: TouchEvent) {
      touch.init = true;
      const _touch = e.touches[0];
      touch.startX = _touch.pageX;
      touch.startY = _touch.pageY;
    }
    function midTouchMove(e: TouchEvent) {
      if (!touch.init) return;
      const _touch = e.touches[0];
      const deltaX = _touch.pageX - touch.startX;
      const deltaY = _touch.pageY - touch.startY;
      if (Math.abs(deltaY) > Math.abs(deltaX)) return;
      const left = state.currentShow === "cd" ? 0 : -window.innerWidth;
      const width = Math.min(0, Math.max(-window.innerWidth, left + deltaX));
      touch.percent = Math.abs(width / window.innerWidth);
      lyricList.value.$el.style["transform"] = `translate3d(${width}px,0,0)`;
      lyricList.value.$el.style["transition"] = "0";
      middleL.value.style.opacity = 1 - touch.percent;
    }
    function midTouchEnd() {
      let width, opacity;
      if (state.currentShow === "cd") {
        if (touch.percent > 0.1) {
          width = -window.innerWidth;
          opacity = 0;
          state.currentShow = "lyric";
        } else {
          width = 0;
          opacity = 1;
        }
      } else {
        if (touch.percent < 0.9) {
          width = 0;
          opacity = 1;
          state.currentShow = "cd";
        } else {
          width = -window.innerWidth;
          opacity = 1;
        }
      }
      lyricList.value.$el.style["transform"] = `translate3d(${width}px,0,0)`;
      lyricList.value.$el.style["transition"] = `all 300ms`;
      middleL.value.style.opacity = opacity;
      middleL.value.style["transition"] = `all 300ms`;
    }
    function showPlayList() {
      playComponent.value.onShow();
    }
    function getFavorIcon(item: PlayListType) {
      return _isFavor(item) ? "icon-favorite" : "icon-not-favorite";
    }
    function toggleFavor(item: PlayListType) {
      _isFavor(item)
        ? store.dispatch("deleteFavor", item)
        : store.dispatch("saveFavor", item);
    }
    function _isFavor(item: PlayListType) {
      const idx = store.getters.favor.findIndex(
        (song: PlayListType) => song.mid === item.mid
      );
      return idx > -1;
    }
    function _loop() {
      audio.value.currentTime = 0;
      audio.value.play();
      lyric.value?.seek(0);
    }
    function _resetIdx(list: PlayListType[]) {
      let idx = list.findIndex((item) => item.mid === currentSong.value.mid);
      store.commit(MutationTypes.SET_CURRENT_IDX, idx);
    }
    function _getLyric() {
      lyric.value = new Lyric(currentSong.value.lyric, _handlerLyric);
      if (playing.value) lyric.value?.play(0);
    }
    // @ts-ignore
    function _handlerLyric({ lineNum, txt }) {
      state.currentLineNum = lineNum;
      if (lineNum > 7) {
        let lineEl = lyricLines.value[lineNum - 7];
        lyricList.value.scrollToElement(lineEl, 1000);
      } else {
        lyricList.value.scrollTo(0, 0, 1000);
      }
      state.playingLyric = txt;
    }
    watch(
      () => currentSong.value,
      (newS, oldS) => {
        if (!newS.mid) return;
        if (newS.mid === oldS.mid) return;
        lyric.value?.stop();
        instance?.proxy?.$nextTick(() => {
          if (audio.value) audio.value.play();
          _getLyric();
        });
      }
    );
    watch(
      () => playing.value,
      (newP) => {
        instance?.proxy?.$nextTick(() => {
          if (audio.value) {
            newP ? audio.value.play() : audio.value.pause();
          }
        });
      }
    );
    return {
      ...toRefs(state),
      lyric,
      fullScreen,
      playList,
      playing,
      mode,
      currentSong,
      miniPlay,
      fullScreenPlay,
      togglePlaying,
      singer,
      audio,
      lyricList,
      playIcon,
      miniIcon,
      cdClass,
      next,
      prev,
      currentIdx,
      lyricLines,
      ready,
      error,
      noClass,
      timeUpdate,
      format,
      computed,
      percent,
      barChange,
      changeMode,
      iconMode,
      sequenceList,
      end,
      midTouchEnd,
      midTouchStart,
      midTouchMove,
      middleL,
      showPlayList,
      playComponent,
      getFavorIcon,
      toggleFavor,
    };
  },
};
</script>

<style lang="stylus" scoped>
@import "../styles/var.styl"

.player
  .normal-player
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 150
    background: $black
    .background
      position: absolute
      left: 0
      top: 0
      width: 100%
      height: 100%
      z-index: -1
      opacity: 0.6
      filter: blur(20px)
    .top
      position: relative
      margin-bottom: 25px
      .back
        position absolute
        top: 0
        left: 6px
        z-index: 50
        .icon-back
          display: block
          padding: 9px
          font-size: $font-xl
          color: $green-dark
          transform: rotate(-90deg)
      .title
        width: 70%
        margin: 0 auto
        line-height: 40px
        text-align: center
        text-overflow: ellipsis
        overflow: hidden
        white-space: nowrap
        font-size: $font-l
        color: $green
      .subtitle
        line-height: 20px
        text-align: center
        font-size: $font-m
        color: $green
    .middle
      position: fixed
      width: 100%
      top: 80px
      bottom: 170px
      white-space: nowrap
      font-size: 0
      .middle-l
        display: inline-block
        vertical-align: top
        position: relative
        width: 100%
        height: 0
        padding-top: 80%
        .cd-wrapper
          position: absolute
          left: 10%
          top: 0
          width: 80%
          box-sizing: border-box
          height: 100%
          .cd
            width: 100%
            height: 100%
            border-radius: 50%
            .image
              position: absolute
              left: 0
              top: 0
              width: 100%
              height: 100%
              box-sizing: border-box
              border-radius: 50%
              border: 10px solid rgba(255, 255, 255, 0.1)
            .play
              animation: rotate 20s linear infinite
            .pause
              animation-play-state: paused
        .playing-lyric-wrapper
          width: 80%
          margin: 50px auto 0 auto
          overflow: hidden
          text-align: center
          .playing-lyric
            height: 20px
            line-height: 20px
            font-size: $font-m
            color: $green-dark
      .middle-r
        display: inline-block
        vertical-align: top
        width: 100%
        height: 100%
        overflow: hidden
        .lyric-wrapper
          width: 80%
          margin: 0 auto
          overflow: hidden
          text-align: center
          .text
            line-height: 32px
            color: $green
            font-size: $font-m
            &.current
              color: $green-dark
          .pure-music
            padding-top: 50%
            line-height: 32px
            color: $green
            font-size: $font-m
    .bottom
      position: absolute
      bottom: 50px
      width: 100%
      .dot-wrapper
        text-align: center
        font-size: 0
        .dot
          display: inline-block
          vertical-align: middle
          margin: 0 4px
          width: 8px
          height: 8px
          border-radius: 50%
          background: $green
          &.active
            width: 20px
            border-radius: 5px
            background: $grey1
      .progress-wrapper
        display: flex
        align-items: center
        width: 80%
        margin: 0px auto
        padding: 10px 0
        .time
          color: $green
          font-size: $font-s
          flex: 0 0 30px
          line-height: 30px
          width: 30px
          &.time-l
            text-align: left
          &.time-r
            text-align: right
        .progress-bar-wrapper
          flex: 1
      .operators
        display: flex
        align-items: center
        .icon
          flex: 1
          color: $green
          &.disable
            color: $green-dark
          i
            font-size: 30px
        .i-left
          text-align: right
        .i-center
          padding: 0 20px
          text-align: center
          i
            font-size: 40px
        .i-right
          text-align: left
        .icon-favorite
          color: $red
    &.normal-enter-active, &.normal-leave-active
      transition: all 0.4s
      .top, .bottom
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
    &.normal-enter, &.normal-leave-to
      opacity: 0
      .top
        transform: translate3d(0, -100px, 0)
      .bottom
        transform: translate3d(0, 100px, 0)
  .mini-player
    display: flex
    align-items: center
    position: fixed
    left: 0
    bottom: 0
    z-index: 180
    width: 100%
    height: 60px
    background: $grey2
    &.mini-enter-active, &.mini-leave-active
      transition: all 0.4s
    &.mini-enter, &.mini-leave-to
      opacity: 0
    .icon
      flex: 0 0 40px
      width: 40px
      height: 40px
      padding: 0 10px 0 20px
      .imgWrapper
        height: 100%
        width: 100%
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
    .text
      display: flex
      flex-direction: column
      justify-content: center
      flex: 1
      line-height: 20px
      overflow: hidden
      .name
        margin-bottom: 2px
        text-overflow: ellipsis
        overflow: hidden
        white-space: nowrap
        font-size: $font-m
        color: $green
      .desc
        text-overflow: ellipsis
        overflow: hidden
        white-space: nowrap
        font-size: $font-s
        color: $green-dark
    .control
      flex: 0 0 30px
      width: 30px
      padding: 0 10px
      .icon-play-mini, .icon-pause-mini, .icon-playlist
        font-size: 30px
        color: $green-dark
      .icon-mini
        font-size: 32px
        position: absolute
        left: 0
        top: 0
@keyframes rotate
  0%
    transform: rotate(0)
  100%
    transform: rotate(360deg)
</style>
