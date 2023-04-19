import store from '../store'
import request from '@/utils/request'

// 活动列表
export function getInformationList(params) {
  store.commit('setIsLoading', false)
  return request({
    url: '/information',
    method: 'get',
    params
  })
}

// 资讯详情
export function informationDetails(params) {
  store.commit('setIsLoading', false)
  return request({
    url: '/informationDetails',
    method: 'get',
    params
  })
}

// 资讯分类
export function informationCategory(params) {
  store.commit('setIsLoading', false)
  return request({
    url: '/informationCategory',
    method: 'get',
    params
  })
}

// 创建分类
export function informationCategoryCreate(data) {
  store.commit('setIsLoading', false)
  return request({
    url: '/informationCategoryCreate',
    method: 'post',
    data
  })
}

// 资讯分类删除
export function informationCategoryDel(data) {
  store.commit('setIsLoading', false)
  return request({
    url: '/informationCategoryDel',
    method: 'post',
    data
  })
}

// 资讯导入
export function informationImport(data) {
  store.commit('setIsLoading', false)
  return request({
    url: '/information/import',
    method: 'post',
    data
  })
}

// 资讯创建
export function informationCreate(data) {
  store.commit('setIsLoading', false)
  return request({
    url: '/informationCreate',
    method: 'post',
    data
  })
}

// 资讯删除
export function informationDel(data) {
  store.commit('setIsLoading', false)
  return request({
    url: '/informationDel',
    method: 'post',
    data
  })
}

// 推荐资讯
export function informationHot(data) {
  store.commit('setIsLoading', false)
  return request({
    url: '/informationHot',
    method: 'post',
    data
  })
}
// 资讯排序
export function informationSort(data) {
  store.commit('setIsLoading', false)
  return request({
    url: '/informationSort',
    method: 'post',
    data
  })
}
