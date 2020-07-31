<template>
  <music-list :songs="songs" :title="name" :bgImage="img1v1Url"></music-list>
</template>

<script lang="ts">
import { onMounted, reactive, defineComponent, toRefs } from "vue";
import MusicList from "../components/MusicList.vue";
import { getSingerDetail } from "../config/http.config";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { SingerType } from "../types/singer.types";
import { PlayListType } from "../types/search.types";

interface IState {
  songs: PlayListType[];
  singer: SingerType;
  name: string;
  img1v1Url: string;
}

export default defineComponent({
  name: "SingerDetail",
  components: { MusicList },
  setup() {
    const store = useStore();
    const router = useRouter();
    const state = reactive<IState>({
      songs: [],
      singer: store.getters.singer,
      name: store.getters.singer.name,
      img1v1Url: store.getters.singer.img1v1Url,
    });
    onMounted(() => {
      if (!state.singer.id) router.push("/singer");
      else {
        getSingerDetail(state.singer.id).then((v) => {
          state.songs = v.hotSongs;
        });
      }
    });
    return { ...toRefs(state) };
  },
});
</script>
