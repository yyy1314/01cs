import store from '../store'
import request from '@/utils/request'

// 活动列表
export function getActivityList(params) {
  store.commit('setIsLoading', false)
  return request({
    url: '/activity',
    method: 'get',
    params
  })
}

// 活动分类列表
export function getActivityCategory() {
  store.commit('setIsLoading', false)
  return request({
    url: '/activityCategory',
    method: 'get',
    params: { }
  })
}

// 发布活动
export function activityCreate(data) {
  store.commit('setIsLoading', false)
  return request({
    url: '/activityCreate',
    method: 'post',
    data: data
  })
}
// 活动上下架
export function activityRelease(data) {
  store.commit('setIsLoading', false)
  return request({
    url: '/activityRelease',
    method: 'post',
    data: data
  })
}
// 删除活动
export function activityDel(data) {
  store.commit('setIsLoading', false)
  return request({
    url: '/activityDel',
    method: 'post',
    data: data
  })
}
// 活动详情
export function activityDetails(params) {
  store.commit('setIsLoading', false)
  return request({
    url: '/activityDetails',
    method: 'get',
    params
  })
}
// 活动报名列表
export function activityJoin(params) {
  store.commit('setIsLoading', false)
  return request({
    url: '/activityJoin',
    method: 'get',
    params
  })
}

// 活动分类
export function activityCategory(params) {
  store.commit('setIsLoading', false)
  return request({
    url: '/activityCategory',
    method: 'get',
    params
  })
}
// 创建活动分类
export function activityCategoryCreate(data) {
  store.commit('setIsLoading', false)
  return request({
    url: '/activityCategoryCreate',
    method: 'post',
    data
  })
}
// 删除活动分类
export function activityCategoryDel(data) {
  store.commit('setIsLoading', false)
  return request({
    url: '/activityCategoryDel',
    method: 'post',
    data
  })
}
// 活动订单详情
export function activityJoinDetails(params) {
  store.commit('setIsLoading', false)
  return request({
    url: '/activityJoinDetails',
    method: 'get',
    params
  })
}

//活动订单设置
export function activityJoinSetting(data) {
  store.commit('setIsLoading', false)
  return request({
    url: '/activityJoinSetting',
    method: 'post',
    data
  })
}

//活动通过
export function activityPass(data) {
  store.commit('setIsLoading', false)
  return request({
    url: '/activityJoinExamine',
    method: 'post',
    data
  })
}
