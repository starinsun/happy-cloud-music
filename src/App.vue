<template>
  <headers />
  <navs />
  <router-view v-slot="{ Component }">
    <keep-alive>
      <transition name="slide">
        <component :is="Component" />
      </transition>
    </keep-alive>
  </router-view>
  <player />
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from "vue";
import Recommend from "./pages/recommend.vue";
import Headers from "./components/Headers.vue";
import Navs from "./components/Navs.vue";
import Player from "./components/Player.vue";

export default defineComponent({
  name: "App",
  components: { Recommend, Headers, Navs, Player },
  setup() {
    const state = reactive({
      Component: Recommend,
    });
    return { ...toRefs(state) };
  },
});
</script>

<style lang="stylus" scoped>
.slide-enter-active
  transition all .5s ease
.slide-leave-active
  transition all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0)
.slide-enter, .slide-leave-to
  transform translateX(-66px) !important
  opacity 0
</style>
