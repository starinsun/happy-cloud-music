<template>
  <div class="m-header">
    <router-link :to="target" class="mine" tag="div">
      <i class="icon-mine"></i>
    </router-link>
    <div class="icon"></div>
    <div class="text">Vue-Music</div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useRoute } from "vue-router";

export default defineComponent({
  name: "Headers",
  setup() {
    const route = useRoute();
    const target = computed(() => `${route.path}/user`);
    return {
      target,
    };
  },
});
</script>

<style lang="stylus" scoped>
@import "../styles/var.styl"

.m-header
  display flex
  justify-content center
  align-items center
  height 44px
  .mine
    position absolute
    top 0
    left 0
    .icon-mine
      display block
      padding 12px
      font-size 20px
      color $green-dark
  .icon
    margin-top 6px
    width 32px
    height 32px
    margin-right 9px
    background-image url("../assets/image/default.png")
    background-size 32px 32px
  .text
    color $green
    font-size $font-l
</style>
