import { createStore } from 'vuex'
import state from './state'
import mutations from './mutation'
import getters from './getters'
import actions from './action'

export default createStore({
  state,
  mutations,
  actions,
  getters,
})
