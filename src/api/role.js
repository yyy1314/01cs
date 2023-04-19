import store from '../store'
import request from '@/utils/request'

// 获取角色等级
export function getRolesList(params) {
  store.commit('setIsLoading', false)
  return request({
    url: '/roles',
    method: 'GET',
    params
  })
}

// 获取角色权限
export function menus(params) {
  store.commit('setIsLoading', false)
  return request({
    url: '/menus',
    method: 'GET',
    params
  })
}

// 创建角色权限
export function roleCreate(data) {
  store.commit('setIsLoading', false)
  return request({
    url: '/roleCreate',
    method: 'post',
    data
  })
}

// 权限
export function getMenus(params) {
  return request({
    url: '/menus',
    method: 'get',
    params
  })
}

// 权限
export function getPermissions(params={}) {
  return request({
    url: '/permission/index',
    method: 'get',
    params
  })
}

// 我的菜单
export function getMyMenus(params) {
  return request({
    url: '/myMenus',
    method: 'get',
    params
  })
}

// 删除角色
export function roleDel(data) {
  return request({
    url: '/roleDel',
    method: 'post',
    data
  })
}

// 角色详情
export function roleDetails(params) {
  return request({
    url: '/roleDetails',
    method: 'get',
    params
  })
}
