<template>
  <transition name="list-fade">
    <div class="playlist" v-show="show" @click="onHide">
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="icon"></i>
            <span class="text">播放列表</span>
            <span class="clear" @click="showConfirm">
              <i class="icon-clear" />
            </span>
          </h1>
        </div>
        <base-scroll
          ref="listContent"
          :data="sequenceList"
          class="list-content"
        >
          <transition-group name="list" tag="ul" ref="listItem">
            <li
              class="item"
              @click="selectItem(item, idx)"
              v-for="(item, idx) in sequenceList"
              :key="item.mid"
            >
              <i class="current" :class="getCurCls(item)"></i>
              <span class="text">{{ item.name }}</span>
              <span class="like" @click.stop="toggleFavor(item)">
                <i :class="getFavorIcon(item)"></i>
              </span>
              <span class="delete" @click.stop="deleteOne(item)">
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </base-scroll>
        <div class="list-close" @click="onHide">
          <span>关闭</span>
        </div>
      </div>
      <base-confirm
        @confirm="clearList"
        ref="confirm"
        text="是否清空列表"
      ></base-confirm>
    </div>
  </transition>
</template>

<script lang="ts">
import {
  reactive,
  toRefs,
  ref,
  watch,
  getCurrentInstance,
  defineComponent,
  PropType,
} from "vue";
import BaseScroll from "./BaseScroll.vue";
import BaseConfirm from "./BaseConfirm.vue";
import { MutationTypes, ActionTypes } from "../types/store.types";
import { useStore } from "vuex";
import { PlayListType } from "../types/search.types";

export default defineComponent({
  name: "PlayList",
  components: { BaseScroll, BaseConfirm },
  props: {
    sequenceList: {
      type: Array as PropType<PlayListType[]>,
      default: () => [],
    },
    currentSong: {
      type: Object as PropType<PlayListType>,
      default: () => ({
        mid: 0,
        singer: [
          {
            img1v1Url: "",
            name: "",
          },
        ],
        album: {
          name: "",
        },
        interval: 0,
        name: "",
        audio: "",
        img: "",
        lyric: "",
      }),
    },
    mode: {
      type: Number,
      default: 0,
    },
    playList: {
      type: Array as PropType<PlayListType[]>,
      default: [],
    },
  },
  setup(props) {
    const store = useStore();
    const instance = getCurrentInstance();
    const listContent = ref();
    const listItem = ref();
    const confirm = ref();
    const state = reactive({
      show: false,
    });
    function onShow() {
      state.show = true;
      instance?.proxy?.$nextTick(() => {
        listContent.value.refresh();
        scrollToCurrent(props.currentSong);
      });
    }
    function onHide() {
      state.show = false;
    }
    function getCurCls(item: PlayListType) {
      if (props.currentSong.mid === item.mid) return "icon-play";
      return "";
    }
    function selectItem(item: PlayListType, idx: number) {
      if (props.mode === 2) {
        idx = props.playList.findIndex((song) => song.mid === item.mid);
      }
      store.commit(MutationTypes.SET_CURRENT_IDX, idx);
      store.commit(MutationTypes.SET_PLAYING_STATE, true);
    }
    function scrollToCurrent(cur: PlayListType) {
      const idx = props.sequenceList.findIndex((song) => song.mid === cur.mid);
      listContent.value.scrollToElement(listItem.value.$el.children[idx], 300);
    }
    function deleteOne(item: PlayListType) {
      store.dispatch(ActionTypes.DELETE_SONG, item);
      if (!props.playList.length) onHide();
    }
    function showConfirm() {
      confirm.value.onShow();
    }
    function clearList() {
      store.dispatch(ActionTypes.DELETE_ALL);
      onHide();
    }
    function getFavorIcon(item: PlayListType) {
      return _isFavor(item) ? "icon-favorite" : "icon-not-favorite";
    }
    function toggleFavor(item: PlayListType) {
      _isFavor(item)
        ? store.dispatch(ActionTypes.DELETE_FAVOR, item)
        : store.dispatch(ActionTypes.SAVE_FAVOR, item);
    }
    function _isFavor(item: PlayListType) {
      const idx = store.getters.favor.findIndex(
        (song: PlayListType) => song.mid === item.mid
      );
      return idx > -1;
    }
    watch(
      () => props.currentSong,
      (newS, oldS) => {
        if (!state.show || newS.mid === oldS.mid) {
          return;
        }
        scrollToCurrent(newS);
      }
    );
    return {
      ...toRefs(state),
      onShow,
      onHide,
      listContent,
      getCurCls,
      selectItem,
      listItem,
      deleteOne,
      confirm,
      showConfirm,
      clearList,
      getFavorIcon,
      toggleFavor,
    };
  },
});
</script>

<style lang="stylus" scoped>
@import "../styles/var.styl"

  .playlist
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 200
    background-color: rgba(0, 0, 0, 0.4)
    .list-wrapper
      position: absolute
      left: 0
      bottom: 0
      width: 100%
      background-color: $grey2
      .list-header
        position: relative
        padding: 20px 30px 10px 20px
        .title
          display: flex
          align-items: center
          .icon
            margin-right: 10px
            font-size: 30px
            color: $green2
          .text
            flex: 1
            font-size: $font-m
            color: $green
          .clear
            .icon-clear
              font-size: $font-m
              color: $green2
      .list-content
        max-height: 240px
        overflow: hidden
        .item
          display: flex
          align-items: center
          height: 40px
          padding: 0 30px 0 20px
          overflow: hidden
          .current
            flex: 0 0 20px
            width: 20px
            font-size: $font-s
            color: $green2
          .text
            flex: 1
            text-overflow: ellipsis
            overflow: hidden
            white-space: nowrap
            font-size: $font-m
            color: $green2
          .like
            margin-right: 15px
            font-size: $font-s
            color: $green
            .icon-favorite
              color: $red
          .delete
            font-size: $font-s
            color: $green
      .list-close
        text-align: center
        line-height: 50px
        background: $black
        font-size: $font-sm
        color: $green
  .list-fade-enter-active, .list-fade-leave-active
    transition: opacity 0.1s
    .list-wrapper
      transition: all 0.1s
  .list-fade-enter, .list-fade-leave-to
    opacity: 0
    .list-wrapper
      transform: translate3d(0, 100%, 0)
  .list-enter-active, .list-leave-active
    transition: all 0.1s
  .list-enter, .list-leave-to
    height: 0
</style>
