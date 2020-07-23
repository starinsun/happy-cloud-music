import { ActionTypes, MutationTypes, IState } from "../utils/types";
import { ActionTree } from "vuex";

const actions:ActionTree<IState, IState> =  {
  [ActionTypes.SELECT_PLAY]({commit, state}, {list, index}) {
    const {
      SET_SEQUENCE_LIST,
      SET_PLAYLIST
    } = MutationTypes
    commit(SET_SEQUENCE_LIST, list)
    if(state.mode === 2) {
      let randomList = list.slice().sort(() => 0.5 - Math.random())
      commit(SET_PLAYLIST, randomList)
      index = randomList.findIndex((item: any) => item.mid === list[index].mid)
    } else {
      commit(SET_PLAYLIST)
    }
  }
}

export default actions
