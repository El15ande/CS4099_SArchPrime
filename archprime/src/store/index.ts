import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    //  Left drawer switch
    drawerLeft: false,
    //  Right drawer switch
    drawerRight: false,
  },

  mutations: {
    //  Left drawer switch
    changeLeft: state => state.drawerLeft = !state.drawerLeft,
    //  Right drawer switch
    changeRight: state => state.drawerRight = !state.drawerRight
  },
  
  actions: {
  },
  
  modules: {
  }
})
