import { IState } from "../types/store.types";
import { GetterTree } from "vuex";
import { PlayListType } from "../types/search.types";

const getters: GetterTree<IState, IState> = {
  singer: (state) => state.singer,
  songs: (state) => state.songs,
  playing: (state) => state.playing,
  fullScreen: (state) => state.fullscreen,
  playList: (state) => state.playlist,
  sequenceList: (state) => state.sequencelist,
  mode: (state) => state.mode,
  currentIdx: (state) => state.currentIdx,
  currentSong: (state): PlayListType => state.playlist[state.currentIdx] || {},
  disc: (state) => state.disc,
  rank: (state) => state.rank,
  searchHistory: (state) => state.history,
  favor: (state) => state.favor,
};

export default getters;
