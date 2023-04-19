import store from '../store'
import request from '@/utils/request'

// 动态分类列表
export function dynamicCategories() {
  store.commit('setIsLoading', false);
  return request({
    url: '/dynamic_category/index',
    method: 'get',
  })
}

export function dynamicList(params) {
  store.commit('setIsLoading', false)
  return request({
    url: '/dynamic/index',
    method: 'get',
    params
  })
}

// 动态审核

export function dynamicAudit(data) {
  store.commit('setIsLoading', false)
  return request({
    url: '/dynamic/censor',
    method: 'post',
    data: data
  })
}
// 动态显示
export function switchOpen(data) {
  store.commit('setIsLoading', false)
  return request({
    url: '/dynamic/display',
    method: 'post',
    data: data
  })
}
// 动态详情
export function dynamicParticulars(params) {
  store.commit('setIsLoading', false)
  return request({
    url: '/dynamic/detail',
    method: 'get',
    params
  })
}
