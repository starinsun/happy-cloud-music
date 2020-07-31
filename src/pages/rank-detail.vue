<template>
  <music-list :rank="true" :title="title" :bg-image="bgImage" :songs="songs" />
</template>

<script lang="ts">
import MusicList from "../components/MusicList.vue";
import { computed, onMounted, reactive, defineComponent, toRefs } from "vue";
import { getPlayListDetail } from "../config/http.config";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { PlayListType } from "../types/search.types";
import { RankType } from "../types/rank.types";

interface IState {
  songs: PlayListType[];
  rank: RankType;
  title: string;
}

export default defineComponent({
  name: "RankDetail",
  components: { MusicList },
  setup() {
    const store = useStore(),
      router = useRouter();
    const state = reactive<IState>({
      songs: [],
      rank: store.getters.rank,
      title: store.getters.rank.name,
    });
    const bgImage = computed(() => {
      if (state.songs.length) {
        return state.songs[0].img;
      } else {
        return state.rank.coverImgUrl;
      }
    });
    onMounted(() => {
      if (!state.rank.id) router.push("/rank");
      else {
        getPlayListDetail(state.rank.id).then((v) => {
          state.songs = v;
        });
      }
    });
    return {
      ...toRefs(state),
      bgImage,
    };
  },
});
</script>
