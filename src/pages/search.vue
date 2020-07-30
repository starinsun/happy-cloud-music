<template>
  <div class="search">
    <div class="search-box-wrapper">
      <base-search-box ref="searchBox" @query="onQueryChange"></base-search-box>
    </div>
    <div ref="shortcutWrapper" class="shortcut-wrapper" v-show="!query">
      <base-scroll class="shortcut" :data="shortcut" ref="searchScroll">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li
                @click="addQuery(item.first)"
                v-for="item in hotkey"
                :key="item.first"
                class="item"
              >
                <span>{{ item.first }}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="history.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <base-search-list
              @delete="deleteQuery"
              @select="addQuery"
              :searches="history"
            ></base-search-list>
          </div>
        </div>
      </base-scroll>
    </div>
    <div ref="searchResWrapper" class="search-result" v-show="query">
      <suggest ref="sugScroll" @select="saveSearch" :query="query"></suggest>
    </div>
    <base-confirm
      @confirm="clearHistory"
      ref="confirm"
      text="是否清空列表"
    ></base-confirm>
    <transition name="slide">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script lang="ts">
import BaseSearchBox from "../components/BaseSearchBox.vue";
import BaseSearchList from "../components/BaseSearchList.vue";
import Suggest from "../components/Suggest.vue";
import BaseConfirm from "../components/BaseConfirm.vue";
import BaseScroll from "../components/BaseScroll.vue";
import {
  onMounted,
  onActivated,
  reactive,
  toRefs,
  ref,
  computed,
  watch,
  defineComponent,
  getCurrentInstance,
} from "vue";
import { getHotkey } from "../config/http.config";
import { useStore } from "vuex";
import { ActionTypes } from "../types/store.types";

export default defineComponent({
  name: "search",
  components: {
    BaseSearchList,
    Suggest,
    BaseSearchBox,
    BaseConfirm,
    BaseScroll,
  },
  setup() {
    const store = useStore(),
      instance = getCurrentInstance();
    const searchBox = ref();
    const confirm = ref();
    const searchScroll = ref();
    const sugScroll = ref();
    const shortcutWrapper = ref();
    const searchResWrapper = ref();
    const state = reactive({
      hotkey: [],
      query: "",
      history: store.getters.searchHistory ? store.getters.searchHistory : [],
      playList: store.getters.playList,
    });
    const shortcut = computed(() => state.hotkey.concat(state.history));
    function addQuery(key: string) {
      searchBox.value.setQuery(key);
    }
    function onQueryChange(query: string) {
      state.query = query;
    }
    function saveSearch() {
      store.dispatch(ActionTypes.SAVE_HISTORY, state.query);
    }
    function deleteQuery(item: string) {
      store.dispatch(ActionTypes.DELETE_HISTORY, item);
    }
    function clearHistory() {
      store.dispatch(ActionTypes.CLEAR_HISTORY);
    }
    function showConfirm() {
      confirm.value.onShow();
    }
    onMounted(() => {
      getHotkey().then((res) => {
        state.hotkey = res.slice();
      });
    });
    watch(
      () => state.query,
      (newQ) => {
        if (!newQ) {
          instance?.proxy?.$nextTick(() => searchScroll.value.refresh());
        }
      }
    );
    onMounted(() => {
      _handlePlayList(state.playList);
    });
    onActivated(() => {
      _handlePlayList(state.playList);
    });
    function _handlePlayList(list: any) {
      const bottom = list.length > 0 ? "60px" : "";
      searchResWrapper.value.style.bottom = bottom;
      sugScroll.value.refresh();
      shortcutWrapper.value.style.bottom = bottom;
      searchScroll.value.refresh();
    }
    watch(
      () => state.playList,
      (newV) => {
        _handlePlayList(newV);
      }
    );
    return {
      ...toRefs(state),
      addQuery,
      searchBox,
      onQueryChange,
      saveSearch,
      deleteQuery,
      clearHistory,
      confirm,
      showConfirm,
      shortcut,
      searchScroll,
      searchResWrapper,
      shortcutWrapper,
      sugScroll,
    };
  },
});
</script>

<style lang="stylus" scoped>
@import "../styles/var.styl"

.search
  .search-box-wrapper
    margin: 20px
  .shortcut-wrapper
    position: fixed
    top: 178px
    bottom: 0
    width: 100%
    .shortcut
      height: 100%
      overflow: hidden
      .hot-key
        margin: 0 20px 20px 20px
        .title
          margin-bottom: 20px
          font-size: $font-size-medium
          color: $color-text-l
        .item
          display: inline-block
          padding: 5px 10px
          margin: 0 20px 10px 0
          border-radius: 6px
          background: $color-highlight-background
          font-size: $font-size-medium
          color: $color-text-d
      .search-history
        position: relative
        margin: 0 20px
        .title
          display: flex
          align-items: center
          height: 40px
          font-size: $font-size-medium
          color: $color-text-l
          .text
            flex: 1
          .clear
            .icon-clear
              font-size: $font-size-medium
              color: $color-text-d
  .search-result
    position: fixed
    width: 100%
    top: 178px
    bottom: 0
.slide-enter-active
  transition all .5s ease
.slide-leave-active
  transition all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0)
.slide-enter, .slide-leave-to
  transform rotate(-15deg) translateX(-80px)
  opacity 0
</style>
