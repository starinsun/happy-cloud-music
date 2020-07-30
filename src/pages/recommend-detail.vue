<template>
  <transition name="slide">
    <music-list :title="title" :bgImage="bgImage" :songs="discs"></music-list>
  </transition>
</template>

<script lang="ts">
import MusicList from "../components/MusicList.vue";
import { reactive, computed, onMounted, defineComponent, toRefs } from "vue";
import { getPlayListDetail } from "../config/http.config";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "RecommendDetail",
  components: { MusicList },
  setup() {
    const store = useStore(),
      router = useRouter();
    const title = computed(() => state.disc.name);
    const bgImage = computed(() => state.disc.picUrl);
    const state = reactive({
      discs: [],
      disc: store.getters.disc,
    });
    onMounted(() => {
      if (!state.disc.id) router.push("/recommend");
      else {
        getPlayListDetail(state.disc.id).then((v) => {
          // @ts-ignore
          state.discs = v;
        });
      }
    });
    return { ...toRefs(state), title, bgImage };
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
