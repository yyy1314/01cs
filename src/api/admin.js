import store from '../store'
import request from '@/utils/request'

// 活动列表
export function getAdminList(params) {
  store.commit('setIsLoading', false)
  return request({
    url: '/admin',
    method: 'get',
    params
  })
}

// 修改密码
export function changePassword(data) {
  store.commit('setIsLoading', false)
  return request({
    url: '/changePassword',
    method: 'post',
    data
  })
}

// 删除用户
export function adminDel(data) {
  store.commit('setIsLoading', false)
  return request({
    url: '/adminDel',
    method: 'post',
    data
  })
}

// 添加管理员
export function adminCreate(data) {
  store.commit('setIsLoading', false)
  return request({
    url: '/adminCreate',
    method: 'post',
    data
  })
}


// 管理员操作日志
export function getAdminLog(params={}) {
  store.commit('setIsLoading', false)
  return request({
    url: '/admin_log/index',
    method: 'get',
    params
  })
}
