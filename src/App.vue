<template>
  <div>name</div>
  <base-scroll class="bscroll">
    <div class="show-components">
      <base-loading />
      <base-none title="这是一个测试题目" />
    </div>
  </base-scroll>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import BaseLoading from "./components/BaseLoading.vue";
import BaseNone from "./components/BaseNone.vue";
import BaseScroll from "./components/BaseScroll.vue";

export default defineComponent({
  name: "App",
  components: {
    BaseLoading,
    BaseNone,
    BaseScroll,
  },
});
</script>

<style lang="stylus" scoped>
.show-components
  margin 10px
  padding 10px
  height 2000px
.bscroll
  height 500px
  background $white
</style>
