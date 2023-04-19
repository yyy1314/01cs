import store from '../store'
import request from '@/utils/request'

// 资源列表
export function getbannerList(params) {
  store.commit('setIsLoading', false)
  return request({
    url: '/banner',
    method: 'get',
    params
  })
}

// 新建轮播图
export function bannerCreate(data) {
  store.commit('setIsLoading', false)
  return request({
    url: '/bannerCreate',
    method: 'post',
    data
  })
}

// 删除轮播图
export function bannerDel(data) {
  store.commit('setIsLoading', false)
  return request({
    url: '/bannerDel',
    method: 'post',
    data
  })
}

// 上下架轮播图
export function bannerUpDown(data) {
  store.commit('setIsLoading', false)
  return request({
    url: '/bannerAdded',
    method: 'post',
    data
  })
}
