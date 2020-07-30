<template>
  <headers />
  <navs />
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from "vue";
import Recommend from "./pages/recommend.vue";
import Headers from "./components/Headers.vue";
import Navs from "./components/Navs.vue";

export default defineComponent({
  name: "App",
  components: { Recommend, Headers, Navs },
  setup() {
    const state = reactive({
      Component: Recommend,
    });
    return { ...toRefs(state) };
  },
});
</script>
