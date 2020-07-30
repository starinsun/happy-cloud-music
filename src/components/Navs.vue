<template>
  <div class="tab">
    <router-link tag="div" class="tab-item" to="/recommend">
      <span class="tab-link">推荐</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/singer">
      <span class="tab-link">歌手</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/rank">
      <span class="tab-link">排行</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/search">
      <span class="tab-link">搜索</span>
    </router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Navs",
});
</script>

<style lang="stylus" scoped>
@import "../styles/var.styl"
  .tab
    display flex
    height 44px
    line-height 44px
    font-size $font-m
    .tab-item
      flex 1
      text-align center
      .tab-link
        padding-bottom 5px
        color $green
      &.router-link-active
        .tab-link
          color $green
          border-bottom 2px solid $green-dark
</style>
