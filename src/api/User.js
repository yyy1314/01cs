import store from '../store'
import request from '@/utils/request'
// 账号列表
export function userCenter(params) {
  store.commit('setIsLoading', false)
  return request({
    url: '/userCenter',
    method: 'get',
    params
  })
}

// 修改账号
export function UpdateAccountAsync(data) {
  return request({
    url: 'System/User/UpdateAccountAsync',
    method: 'post',
    data: data
  })
}

// 修改密码
export function UpdateAccountPasswordAsync(data) {
  return request({
    url: 'System/User/UpdateAccountPasswordAsync',
    method: 'post',
    data: data
  })
}

// 登录
export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data: data
  })
}

// 修改密码
export function changePassword(data) {
  return request({
    url: '/changePassword',
    method: 'post',
    data
  })
}

// 行业分类
export function getIndustryList() {
  return request({
    url: '/industry',
    method: 'get'
  })
}
// 用户详情
export function getuserDetail(params) {
  return request({
    url: '/user/detail',
    method: 'get',
    params
  })
}
// 用户修改
export function changeUserMsg(data) {
  return request({
    url: '/user/modify',
    method: 'post',
    data
  })
}

// 人脉显示切换
export function switchContactsDisplay(data) {
  return request({
    url: '/user/contacts_display',
    method: 'post',
    data
  })
}
