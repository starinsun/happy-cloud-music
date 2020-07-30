import { ActionTypes, MutationTypes, IState } from "../types/store.types";
import { ActionTree } from "vuex";

const actions: ActionTree<IState, IState> = {
  [ActionTypes.SELECT_PLAY]({ commit, state }, { list, index }) {
    const {
      SET_SEQUENCE_LIST,
      SET_PLAYLIST,
      SET_CURRENT_IDX,
      SET_FULL_SCREEN,
      SET_PLAYING_STATE,
    } = MutationTypes;
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
};

export default actions;
