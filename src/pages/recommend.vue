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
              <a :href="banner.url">
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
                width="133"
                height="133"
              />
            </div>
            <div class="text">
              <h1 class="desc" v-html="song.name"></h1>
              <p class="listenNum">播放数：{{ getCount(song.playCount) }}</p>
            </div>
          </li>
        </ul>
      </div>
      <base-loading v-show="!songs.length" class="loading-container" />
    </base-scroll>
    <transition name="slide">
      <router-view></router-view>
    </transition>
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
} from "vue";
import BaseSlider from "../components/BaseSlider.vue";
import BaseScroll from "../components/BaseScroll.vue";
import BaseLoading from "../components/BaseLoading.vue";
import { getCount } from "../utils/help";
import { getRecommendBanner, getSongList } from "../config/http.config";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { MutationTypes } from "../types/store.types";
import { RecommendListType } from "../types/recommend.types";

export default defineComponent({
  name: "Recommend",
  components: { BaseSlider, BaseScroll, BaseLoading },
  setup() {
    const router = useRouter(),
      store = useStore();
    const state = reactive({
      banners: [],
      songs: [],
      hasGotImg: false,
      playList: store.getters.playList,
    });
    const scroll = ref();
    const recommend = ref();
    onMounted(() => {
      getRecommendBanner().then((res) => {
        state.banners = res;
      });
      getSongList().then((res) => {
        state.songs = res;
      });
      _handlePlayList(state.playList);
    });
    onActivated(() => {
      _handlePlayList(state.playList);
    });
    function _handlePlayList(playlist: any) {
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
      () => state.playList,
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
      color $green-dark
      display flex
      justify-content center
      align-items flex-end
      &::before
        content '————'
        color $green-dark
      &::after
        content '————'
    .songList
      display grid
      grid-template-columns 1fr 1fr
      .icon,.text
        display grid
        justify-items  center
        font-size 12px
        margin 12px 0 0 0
        color $green-dark
        .desc
          text-overflow ellipsis
          text-align center
          overflow hidden
          white-space nowrap
          margin-bottom 5px
          width 90%
        .listenNum
          color $green-dark
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
.slide-enter-active
  transition all .5s ease
.slide-leave-active
  transition all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0)
.slide-enter, .slide-leave-to
  transform rotate(-15deg) translateX(-80px)
  opacity 0
</style>
