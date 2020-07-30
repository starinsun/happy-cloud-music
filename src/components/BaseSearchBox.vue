<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input class="box" :placeholder="placeHolder" v-model="query" />
    <i class="icon-dismiss" v-show="query" @click="clearSearch"></i>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, onMounted, defineComponent, watch } from "vue";
export default defineComponent({
  name: "BaseSearchBox",
  props: {
    placeHolder: {
      type: String,
      default: "",
    },
  },
  setup(_, { emit }) {
    const state = reactive({
      query: "",
    });
    function clearSearch() {
      state.query = "";
    }
    function setQuery(item: string) {
      state.query = item;
    }
    onMounted(() => {
      watch(
        () => state.query,
        (newQ) => {
          emit("query", newQ);
        }
      );
    });
    return {
      ...toRefs(state),
      clearSearch,
      setQuery,
    };
  },
});
</script>

<style lang="stylus" scoped>
@import "../styles/var.styl"

.search-box
  display: flex
  align-items: center
  box-sizing: border-box
  width: 100%
  padding: 0 6px
  height: 40px
  background: $grey1
  border-radius: 6px
  .icon-search
    font-size: 28px
    color: $black
  .box
    flex: 1
    margin: 0 5px
    line-height: 18px
    background: $grey1
    color: $green
    font-size: $font-m
    outline: 0
    &::placeholder
      color: $green-dark
  .icon-dismiss
    font-size: 18px
    color: $black
</style>
