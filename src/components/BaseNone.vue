<template>
  <div class="no-result">
    <p class="no-result-text">{{ title }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "BaseNone",
  props: {
    title: {
      type: String,
      default: "抱歉没有搜到结果噢~~~",
    },
  },
});
</script>

<style lang="stylus" scoped>
@import "../styles/var.styl";

.no-result
  text-align: center
  .no-result-text
    margin-top 30px
    font-size $font-m
    color $dark-green
</style>
