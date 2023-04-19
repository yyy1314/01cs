import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import getters from './getters'
import errorLog from './modules/errorLog'
import tagsView from './modules/tagsView'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    uploadUrl: process.env.uploadUrl
  },
  modules: {
    app,
    errorLog,
    tagsView,
    user
  },
  getters
})

export default store
