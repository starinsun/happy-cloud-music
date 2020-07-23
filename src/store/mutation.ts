import { MutationTypes } from "../utils/types";
import { IState } from "../utils/types";
import { MutationTree } from "vuex";

const mutations: MutationTree<IState> = {
  [MutationTypes.SET_SINGER](state, singer:object) {
    state.singer = singer;
  },
  [MutationTypes.SET_SINGER_SONGS](state, songs: any[]) {
    state.songs = songs;
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
  [MutationTypes.SET_DISC](state, disc: object) {
    state.disc = disc;
  },
  [MutationTypes.SET_RANK](state, rank: object) {
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
