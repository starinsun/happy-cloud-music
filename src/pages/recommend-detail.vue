<template>
  <transition name="slide">
    <music-list :title="title" :bgImage="bgImage" :songs="discs"></music-list>
  </transition>
</template>

<script lang="ts">
import MusicList from "../components/MusicList.vue";
import { reactive, onMounted, defineComponent, toRefs } from "vue";
import { getPlayListDetail } from "../config/http.config";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { PlayListType } from "../types/search.types";
import { RecommendListType } from "../types/recommend.types";

interface IState {
  discs: PlayListType[];
  disc: RecommendListType;
  title: string;
  bgImage: string;
}

export default defineComponent({
  name: "RecommendDetail",
  components: { MusicList },
  setup() {
    const store = useStore(),
      router = useRouter();
    const state = reactive<IState>({
      discs: [],
      disc: store.getters.disc,
      title: store.getters.disc.name,
      bgImage: store.getters.disc.picUrl,
    });
    onMounted(() => {
      if (!state.disc.id) router.push("/recommend");
      else {
        getPlayListDetail(state.disc.id).then((v) => {
          state.discs = v;
        });
      }
    });
    return { ...toRefs(state) };
  },
});
</script>

<style lang="stylus" scoped>
@import "../styles/var.styl"

.slide-enter-active
  transition: all .3s .3s ease

.slide-leave-active
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0)
.slide-enter, .slide-leave-to
  transform: translateX(10px)
  opacity: 0
</style>
