<template>
  <div class="song-list">
    <ul>
      <li
        @click="selectItem(song, idx)"
        v-for="(song, idx) in songs"
        class="item"
        :key="song.id"
      >
        <div class="rank" v-show="rank">
          <span class="text">{{ idx + 1 }}</span>
        </div>
        <div class="content">
          <h2 class="name">{{ song.name }}</h2>
          <p class="desc">{{ getDesc(song) }}</p>
        </div>
      </li>
    </ul>
    <base-loading v-show="isShow"></base-loading>
  </div>
</template>

<script lang="ts">
import BaseLoading from "./BaseLoading.vue";
import { computed, defineComponent } from "vue";
import { PlayListType } from "../types/search.types";
export default defineComponent({
  name: "SongList",
  props: {
    songs: {
      type: Array,
      default: () => [],
    },
    rank: {
      type: Boolean,
      default: false,
    },
    noneed: {
      type: Boolean,
      default: false,
    },
  },
  components: { BaseLoading },
  setup(props, { emit }) {
    function getDesc(song: PlayListType) {
      return `${song.singer[0].name} · ${song.album.name} · ${song.name}`;
    }
    function selectItem(song: PlayListType, idx: number) {
      emit("select", song, idx);
    }
    const isShow = computed(() => {
      if (props.noneed === false) {
        return !props.songs.length;
      } else {
        return false;
      }
    });
    return { getDesc, selectItem, isShow };
  },
});
</script>

<style scoped lang="stylus">
@import "../styles/var.styl"

.song-list
  .item
    display: flex
    align-items: center
    box-sizing: border-box
    height: 64px
    font-size: $font-m
    .rank
      flex: 0 0 25px
      width: 25px
      margin-right: 30px
      text-align: center
      .text
        color: $black
        font-size: $font-l
    .content
      flex: 1
      line-height: 20px
      overflow: hidden
      .name
        text-overflow: ellipsis
        overflow: hidden
        white-space: nowrap
        color: $green
      .desc
        text-overflow: ellipsis
        overflow: hidden
        white-space: nowrap
        margin-top: 4px
        color: $green-dark
</style>
