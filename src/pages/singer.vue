<template>
  <div class="singer" ref="singer">
    <list-view
      ref="listview"
      @select="selectSinger"
      :data="singerList"
    ></list-view>
    <router-view></router-view>
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

interface Istate {
  singerList: any[];
  playList: any[];
}

export default defineComponent({
  name: "Singer",
  components: {
    ListView,
  },
  setup() {
    const store = useStore(),
      router = useRouter();
    const state: Istate = reactive({
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
    function selectSinger(singer: any) {
      store.commit(MutationTypes.SET_SINGER, singer);
      router.push({
        path: `/singer/${singer.singer_mid}`,
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
</style>
