<template>
  <div class="rank" ref="rankList">
    <base-scroll :data="[...detail, ...rest]" class="toplist" ref="topList">
      <div>
        <ul>
          <li
            class="item"
            v-for="item in detail"
            :key="item.id"
            @click="selectItem(item)"
          >
            <div class="icon">
              <img width="100" height="100" :src="item.coverImgUrl" />
            </div>
            <ul class="songlist">
              <li class="song" v-for="(song, idx) in item.tracks" :key="idx">
                <span>{{ idx + 1 }} · </span>
                <span>{{ song.first }} · {{ song.second }} </span>
              </li>
            </ul>
          </li>
        </ul>
        <ul class="rest-wrapper">
          <div
            v-for="item in rest"
            class="rest"
            @click="selectItem(item)"
            :key="item.id"
          >
            <img
              :src="item.coverImgUrl"
              :alt="item.name"
              class="rest-image"
              width="100"
              height="100"
            />
          </div>
        </ul>
      </div>
      <div class="loading-container" v-show="!detail.length && !rest.length">
        <base-loading />
      </div>
    </base-scroll>
    <router-view v-slot="{ Component }">
      <transition name="slide">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </transition>
    </router-view>
  </div>
</template>

<script lang="ts">
import BaseLoading from "../components/BaseLoading.vue";
import BaseScroll from "../components/BaseScroll.vue";
import {
  onMounted,
  reactive,
  ref,
  onActivated,
  defineComponent,
  toRefs,
} from "vue";
import { getRankList } from "../config/http.config";
import { MutationTypes } from "../types/store.types";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { PlayListType } from "../types/search.types";
import { RankType } from "../types/rank.types";

interface IState {
  detail: RankType[];
  rest: RankType[];
  playList: PlayListType[];
}

export default defineComponent({
  name: "Rank",
  components: { BaseLoading, BaseScroll },
  setup() {
    const store = useStore();
    const router = useRouter();
    const rankList = ref();
    const topList = ref();
    const state = reactive<IState>({
      detail: [],
      rest: [],
      playList: store.getters.playList,
    });
    function _handlePlayList(playlist: PlayListType[]) {
      const bottom = playlist.length > 0 ? "65px" : "";
      rankList.value.style.bottom = bottom;
      topList.value.refresh();
    }
    function selectItem(item: RankType) {
      router.push({
        path: `/rank/${item.id}`,
      });
      store.commit(MutationTypes.SET_RANK, item);
    }
    onMounted(() => {
      getRankList().then((res) => {
        state.detail = res.detail;
        state.rest = res.rest;
      });
      _handlePlayList(state.playList);
    });
    onActivated(() => {
      _handlePlayList(state.playList);
    });
    return {
      ...toRefs(state),
      rankList,
      topList,
      selectItem,
    };
  },
});
</script>

<style lang="stylus" scoped>
@import "../styles/var.styl"

.rank
  position fixed
  width 100%
  top 88px
  bottom 0
  .toplist
    height 100%
    overflow hidden
    .item
      display flex
      margin 0 20px
      padding-top 20px
      height 100px
      &:last-child
        padding-bottom 20px
      .icon
        flex 0 0 100px
        width 100px
        height 100px
      .songlist
        flex 1
        display flex
        flex-direction column
        justify-content center
        padding 0 20px
        height 100px
        overflow hidden
        background $black
        color $green2
        font-size $font-s
        .song
          text-overflow ellipsis
          overflow hidden
          white-space nowrap
          line-height 26px
          font-size $font-sl
    .loading-container
      position absolute
      width 100%
      top 50%
      transform translateY(-50%)
.rest-wrapper
  display grid
  grid-template-columns 1fr 1fr 1fr
  place-items center
  place-content center
  gap 10px
  margin 0 20px
  .rest
    width 27vw
.slide-enter-active
  transition all .5s ease
.slide-leave-active
  transition all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0)
.slide-enter, .slide-leave-to
  transform rotate(-15deg) translateX(-80px)
  opacity 0
</style>
