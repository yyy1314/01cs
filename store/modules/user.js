import { login, ddLogin as ddLoginResquest ,logout, getInfo } from '@/api/login';
import { getToken, setToken, removeToken } from '@/utils/auth';
import { md5 } from '@/utils/md5'

const user = {
  state: {
    token: getToken(),
    id: null,
    name: '',
    avatar: '',
    roles: [],
    role_id: null,
    permissions: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_ID: (state, id) => {
      state.id = id
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_ROLE_ID: (state, role_id) => {
      state.role_id = role_id;
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions;
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.mobile.trim()
      // const password = md5(userInfo.password).toUpperCase()
      const password = userInfo.password
      const captcha = userInfo.captcha
      return new Promise((resolve, reject) => {
        login(username, password, captcha).then(response => {
          const data = response.res
          setToken(data.token,data.expires_at);
          commit('SET_TOKEN', data.token);
          resolve();
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 钉钉登录
    ddLogin({ commit }, code) {
      return new Promise((resolve, reject) => {
        ddLoginResquest(code).then(response => {
          const data = response.res;
          if(response.code === 200){
            setToken(data.token,data.expires_at);
            commit('SET_TOKEN', data.token);
          }
          resolve(response);
        }).catch(error => {
          reject(error);
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          const data = response.res;
          if (data.role_id != 0 && data.role.permissions && data.role.permissions.length > 0) { //
            commit('SET_PERMISSIONS', data.role.permissions);
          }
          commit('SET_ID', data.id);
          commit('SET_NAME', data.name);
          commit('SET_ROLE_ID', data.role_id);
          commit('SET_AVATAR', data.picture);
          resolve(response);
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resolve()
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
