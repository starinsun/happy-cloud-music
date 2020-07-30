<template>
  <base-scroll
    class="suggest"
    :data="list"
    :pullup="pullup"
    @scrollToEnd="searchMore"
    ref="sug"
  >
    <ul class="suggest-list">
      <li
        @click="selectItem(item)"
        class="suggest-item"
        v-for="(item, idx) in list"
        :key="idx"
      >
        <div class="icon">
          <i class="icon-music"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getListName(item)"></p>
        </div>
      </li>
      <base-loading v-show="hasMore"></base-loading>
    </ul>
    <div class="no-result-wrapper" v-show="!hasMore && !list.length">
      <base-none></base-none>
    </div>
  </base-scroll>
</template>

<script lang="ts">
import {
  watch,
  reactive,
  toRefs,
  ref,
  onBeforeUnmount,
  defineComponent,
} from "vue";
import { getSearchRes } from "../config/http.config";
import BaseScroll from "../components/BaseScroll.vue";
import BaseLoading from "../components/BaseLoading.vue";
import BaseNone from "../components/BaseNone.vue";
import { useStore } from "vuex";
import { SearchListType } from "../types/search.types";

const LIMIT = 20;
interface IState {
  page: number;
  pullup: boolean;
  hasMore: boolean;
  list: any[];
}

export default defineComponent({
  name: "Suggest",
  props: {
    query: {
      type: String,
      default: "",
    },
  },
  components: {
    BaseLoading,
    BaseScroll,
    BaseNone,
  },
  setup(props, { emit }) {
    const store = useStore();
    let timer: any = null;
    const debouceSearch = _debouce(_search, 500);
    const sug = ref();
    const state: IState = reactive({
      page: 0,
      list: [],
      pullup: true,
      hasMore: true,
    });
    function getListName(item: any) {
      return `${item.name} · ${item.singer[0].name} ${
        item.singer[1] ? "& " + item.singer[1].name : ""
      }`;
    }
    function searchMore() {
      if (!state.hasMore) return;
      state.page++;
      getSearchRes(props.query, state.page, LIMIT).then(
        (res: SearchListType) => {
          state.list = [...state.list, ...res.data];
          state.hasMore = res.hasMore;
        }
      );
    }
    function selectItem(item: any) {
      store.dispatch("insertSong", item);
      emit("select");
    }
    function _search(key: string, page: number, limit: number) {
      state.hasMore = true;
      state.page = 1;
      state.list = [];
      sug.value.scrollTo(0, 0);
      getSearchRes(key, page, limit).then((res: SearchListType) => {
        state.list = res.data;
        state.hasMore = res.hasMore;
      });
    }
    function _debouce(fn: any, delay: number) {
      timer = null;
      return (...args: any) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          //@ts-ignore
          fn.apply(this, args);
        }, delay);
      };
    }
    onBeforeUnmount(() => {
      clearTimeout(timer);
    });
    watch(
      () => props.query,
      (newQ) => {
        if (newQ === "") return;
        debouceSearch(props.query, state.page, LIMIT);
      }
    );
    function refresh() {
      sug.value.refresh();
    }
    return {
      ...toRefs(state),
      sug,
      getListName,
      searchMore,
      selectItem,
      refresh,
    };
  },
});
</script>

<style lang="stylus" scoped>
@import "../styles/var.styl"

.suggest
  height: 100%
  overflow: hidden
  .suggest-list
    padding: 0 30px
    .suggest-item
      display: flex
      align-items: center
      padding-bottom: 20px
    .icon
      flex: 0 0 30px
      width: 30px
      [class^="icon-"]
        font-size: 16px
        color: $green
    .name
      flex: 1
      font-size: 15px
      color: $green-dark
      overflow: hidden
      .text
        text-overflow: ellipsis
        overflow: hidden
        white-space: nowrap
  .no-result-wrapper
    position: absolute
    width: 100%
    top: 40%
    transform: translateY(-50%)
</style>
