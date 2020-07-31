import { IState, MutationTypes } from "../types/store.types";
import { MutationTree } from "vuex";
import { RecommendListType } from "../types/recommend.types";
import { SingerType } from "../types/singer.types";
import { RankType } from "../types/rank.types";

const mutations: MutationTree<IState> = {
  [MutationTypes.SET_SINGER](state, singer: SingerType) {
    state.singer = singer;
  },
  [MutationTypes.SET_PLAYING_STATE](state, flag: boolean) {
    state.playing = flag;
  },
  [MutationTypes.SET_FULL_SCREEN](state, flag: boolean) {
    state.fullscreen = flag;
  },
  [MutationTypes.SET_PLAYLIST](state, list: []) {
    state.playlist = list;
  },
  [MutationTypes.SET_SEQUENCE_LIST](state, list: []) {
    state.sequencelist = list;
  },
  [MutationTypes.SET_MODE](state, mode: number) {
    state.mode = mode;
  },
  [MutationTypes.SET_CURRENT_IDX](state, idx: number) {
    state.currentIdx = idx;
  },
  [MutationTypes.SET_DISC](state, disc: RecommendListType) {
    state.disc = disc;
  },
  [MutationTypes.SET_RANK](state, rank: RankType) {
    state.rank = rank;
  },
  [MutationTypes.SET_SEARCH_HISTORY](state, history: any) {
    state.history = history;
  },
  [MutationTypes.SET_FAVOR](state, favor: any) {
    state.favor = favor;
  },
};

export default mutations;
