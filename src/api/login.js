import request from '@/utils/request'
import store from '../store'

// 获取验证码
export function getCaptcha() {
  store.commit('setIsLoading', false)
  return request({
    url: '/getCaptcha',
    method: 'get',
    params: {}
  })
}

export function login(mobile, password, captcha) {
  store.commit('setIsLoading', false)
  return request({
    url: '/login',
    method: 'post',
    data: {
      mobile, password, captcha
    }
  })
}


export function ddLogin(code) {
  store.commit('setIsLoading', false)
  return request({
    url: '/ddlogin',
    method: 'post',
    data: {
      code
    }
  })
}

export function getInfo() {
  return request({
    url: '/info',
    method: 'get',
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
