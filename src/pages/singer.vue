<template>
  <div class="singer" ref="singer">
    <list-view
      ref="listview"
      @select="selectSinger"
      :data="singerList"
    ></list-view>
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
import {
  reactive,
  onMounted,
  onActivated,
  watch,
  ref,
  defineComponent,
  toRefs,
} from "vue";
import { getSingerList } from "../config/http.config";
import { MutationTypes } from "../types/store.types";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import ListView from "../components/ListView.vue";
import { SingerType } from "../types/singer.types";
import { PlayListType } from "../types/search.types";

interface IState {
  singerList: SingerType[];
  playList: PlayListType[];
}

export default defineComponent({
  name: "Singer",
  components: {
    ListView,
  },
  setup() {
    const store = useStore(),
      router = useRouter();
    const state = reactive<IState>({
      singerList: [],
      playList: store.getters.playList,
    });
    const singer = ref();
    const listview = ref();
    onMounted(() => {
      getSingerList().then((res) => {
        state.singerList = res;
      });
      _handlePlayList(state.playList);
    });
    onActivated(() => {
      _handlePlayList(state.playList);
    });
    function _handlePlayList(playlist: any) {
      const bottom = playlist.length > 0 ? "55px" : "";
      singer.value.style.bottom = bottom;
      listview.value.refresh();
    }
    function selectSinger(singer: SingerType) {
      store.commit(MutationTypes.SET_SINGER, singer);
      router.push({
        path: `/singer/${singer.id}`,
      });
    }
    watch(
      () => state.playList,
      (newV) => {
        _handlePlayList(newV);
      }
    );
    return { ...toRefs(state), selectSinger, singer, listview };
  },
});
</script>

<style lang="stylus" scoped>
.singer
  position fixed
  top 88px
  bottom 0
  width 100%
.slide-enter-active
  transition all .5s ease
.slide-leave-active
  transition all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0)
.slide-enter, .slide-leave-to
  transform rotate(-15deg) translateX(-80px)
  opacity 0
</style>
