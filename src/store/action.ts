import { ActionTypes, MutationTypes, IState } from "../types/store.types";
import { ActionTree } from "vuex";
import {
  saveSearch,
  deleteSearch,
  clearList,
  setFavor,
  delFavor,
} from "../utils/utils";

const {
  SET_SEQUENCE_LIST,
  SET_PLAYLIST,
  SET_CURRENT_IDX,
  SET_FULL_SCREEN,
  SET_PLAYING_STATE,
  SET_MODE,
  SET_FAVOR,
  SET_SEARCH_HISTORY,
} = MutationTypes;

const actions: ActionTree<IState, IState> = {
  [ActionTypes.SELECT_PLAY]({ commit, state }, { list, index }) {
    commit(SET_SEQUENCE_LIST, list);
    if (state.mode === 2) {
      let randomList = list.slice().sort(() => 0.5 - Math.random());
      commit(SET_PLAYLIST, randomList);
      index = randomList.findIndex((item: any) => item.mid === list[index].mid);
    } else {
      commit(SET_PLAYLIST, list);
    }
    commit(SET_CURRENT_IDX, index);
    commit(SET_FULL_SCREEN, true);
    commit(SET_PLAYING_STATE, true);
  },

  [ActionTypes.RANDOW_PLAY]({ commit }, { list }) {
    commit(SET_MODE, 2);
    commit(SET_SEQUENCE_LIST, list);
    let randomList = list.slice().sort(() => 0.5 - Math.random());
    commit(SET_PLAYLIST, randomList);
    commit(SET_CURRENT_IDX, 0);
    commit(SET_FULL_SCREEN, true);
    commit(SET_PLAYING_STATE, true);
  },

  [ActionTypes.INSERT_SONG]({ commit, state }, song) {
    let playList = state.playlist.slice();
    let sequenceList = state.sequencelist.slice();
    let currentIdx = state.currentIdx;
    let curSong = playList[currentIdx];
    let fdIdx = playList.findIndex((item) => item.mid === song.mid);
    currentIdx++;
    playList.splice(currentIdx, 0, song);
    if (fdIdx > -1) {
      if (currentIdx > fdIdx) {
        playList.splice(fdIdx, 1);
        currentIdx--;
      } else {
        playList.splice(fdIdx + 1, 1);
      }
    }
    let curSeqIdx =
      sequenceList.findIndex((item) => item.mid === curSong.mid) + 1;
    let fsIdx = sequenceList.findIndex((item) => item.mid === song.mid);
    sequenceList.splice(curSeqIdx, 0, song);
    if (fsIdx > -1) {
      if (curSeqIdx > fsIdx) {
        sequenceList.splice(fsIdx, 1);
      } else {
        sequenceList.splice(fsIdx + 1, 1);
      }
    }
    commit(SET_PLAYLIST, playList);
    commit(SET_SEQUENCE_LIST, sequenceList);
    commit(SET_CURRENT_IDX, currentIdx);
    commit(SET_FULL_SCREEN, true);
    commit(SET_PLAYING_STATE, true);
  },

  [ActionTypes.SAVE_HISTORY]({ commit }, query) {
    commit(SET_SEARCH_HISTORY, saveSearch(query));
  },

  [ActionTypes.DELETE_HISTORY]({ commit }, query) {
    commit(SET_SEARCH_HISTORY, deleteSearch(query));
  },

  [ActionTypes.CLEAR_HISTORY]({ commit }) {
    commit(SET_SEARCH_HISTORY, clearList());
  },

  [ActionTypes.DELETE_HISTORY]({ commit, state }, song) {
    let playList = state.playlist.slice();
    let sequenceList = state.sequencelist.slice();
    let currentIdx = state.currentIdx;
    let fdIdx = playList.findIndex((item) => item.mid === song.mid);
    playList.splice(fdIdx, 1);
    let fsIdx = sequenceList.findIndex((item) => item.mid === song.mid);
    sequenceList.splice(fsIdx, 1);
    if (currentIdx > fdIdx || currentIdx === playList.length) {
      currentIdx--;
    }
    commit(SET_CURRENT_IDX, currentIdx);
    commit(SET_SEQUENCE_LIST, sequenceList);
    commit(SET_PLAYLIST, playList);

    if (!playList.length) {
      commit(SET_PLAYING_STATE, false);
    } else {
      commit(SET_PLAYING_STATE, true);
    }
  },

  [ActionTypes.DELETE_ALL]({ commit }) {
    commit(SET_CURRENT_IDX, -1);
    commit(SET_SEQUENCE_LIST, []);
    commit(SET_PLAYLIST, []);
    commit(SET_PLAYING_STATE, false);
  },

  [ActionTypes.SAVE_FAVOR]({ commit }, song) {
    commit(SET_FAVOR, setFavor(song));
  },
  [ActionTypes.DELETE_FAVOR]({ commit }, song) {
    commit(SET_FAVOR, delFavor(song));
  },
};

export default actions;
