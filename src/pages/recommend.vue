<template>
  <div class="recommend" ref="recommend">
    <base-scroll ref="scroll" class="scroll-provider" :data="songs">
      <div>
        <div v-if="banners.length">
          <base-slider>
            <section
              v-for="banner in banners"
              :key="banner.scm"
              class="slider-item"
            >
              <a :href="banner.imageUrl">
                <img :src="banner.imageUrl" />
              </a>
            </section>
          </base-slider>
        </div>
        <div class="songListTitle">\ 推荐歌单 /</div>
        <ul class="songList">
          <li @click="selectItem(song)" v-for="song in songs" :key="song.id">
            <div class="icon">
              <img
                :src="song.picUrl"
                :alt="song.copywriter"
                width="145"
                height="145"
              />
              <div class="play-nums">播放:{{ getCount(song.playCount) }}</div>
            </div>
            <div class="text">
              <h1 class="desc" v-html="song.name"></h1>
            </div>
          </li>
        </ul>
      </div>
      <base-loading v-show="!songs.length" class="loading-container" />
    </base-scroll>
    <router-view v-slot="{ Component }">
      <transition name="slipe">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </transition>
    </router-view>
  </div>
</template>

<script lang="ts">
import {
  onMounted,
  reactive,
  ref,
  watch,
  onActivated,
  defineComponent,
  toRefs,
  computed,
} from "vue";
import BaseSlider from "../components/BaseSlider.vue";
import BaseScroll from "../components/BaseScroll.vue";
import BaseLoading from "../components/BaseLoading.vue";
import { getCount } from "../utils/help";
import { getRecommendBanner, getSongList } from "../config/http.config";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { MutationTypes } from "../types/store.types";
import { RecommendListType, BannerType } from "../types/recommend.types";
import { PlayListType } from "../types/search.types";

interface IState {
  banners: BannerType[];
  songs: RecommendListType[];
  hasGotImg: boolean;
}

export default defineComponent({
  name: "Recommend",
  components: { BaseSlider, BaseScroll, BaseLoading },
  setup() {
    const router = useRouter(),
      store = useStore();
    const state = reactive<IState>({
      banners: [],
      songs: [],
      hasGotImg: false,
    });
    const playList = computed<PlayListType[]>(() => store.getters.playList);
    const scroll = ref();
    const recommend = ref();
    onMounted(() => {
      getRecommendBanner().then((res) => {
        state.banners = res;
      });
      getSongList().then((res) => {
        state.songs = res;
      });
      _handlePlayList(playList.value);
    });
    onActivated(() => {
      _handlePlayList(playList.value);
    });
    function _handlePlayList(playlist: PlayListType[]) {
      const bottom = playlist.length > 0 ? "65px" : "";
      recommend.value.style.bottom = bottom;
      scroll?.value?.refresh();
    }
    function getimg() {
      if (!state.hasGotImg) scroll?.value?.refresh();
      state.hasGotImg = true;
    }
    function selectItem(item: RecommendListType) {
      router.push({
        path: `/recommend/${item.id}`,
      });
      store.commit(MutationTypes.SET_DISC, item);
    }
    watch(
      () => playList.value,
      (newV) => {
        _handlePlayList(newV);
      }
    );
    return {
      ...toRefs(state),
      getCount,
      getimg,
      scroll,
      recommend,
      selectItem,
    };
  },
});
</script>

<style lang="stylus" scoped>
@import "../styles/var.styl"

.recommend
  position fixed
  width 100%
  top 88px
  bottom  0
  .scroll-provider
    height 100%
    overflow hidden
    .songListTitle
      height 40px
      color $green2
      display flex
      font-size $font-m
      justify-content center
      align-items flex-end
      &::before
        content '————'
        color $green2
      &::after
        content '————'
    .songList
      display grid
      grid-template-columns 1fr 1fr
      .icon,.text
        display grid
        position relative
        justify-items  center
        font-size $font-sl
        margin 12px 0 0 0
        color $green2
        .desc
          text-overflow ellipsis
          text-align center
          overflow hidden
          white-space nowrap
          margin-bottom 5px
          width 90%
    .loading-container
      position: absolute
      width: 100%
      top: 40%
      transform: translateY(-50%)
.slider-item
  float left
  box-sizing border-box
  overflow hidden
  text-align center
  a
    display: block
    width: 100%
    overflow: hidden
    img
      display: block
      width: 100%
.play-nums
  position absolute
  top 0
  right calc((50vw - 145px)/2)
  padding 5px 2px 5px 10px
  background $grey3
  border-top-left-radius 20px
  border-bottom-left-radius 20px
  color $grey1
.slipe-enter-active
  transition all .5s ease
.slipe-leave-active
  transition all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0)
.slipe-enter, .slipe-leave-to
  transform rotate(-15deg) translateX(-80px)
  opacity 0
</style>
