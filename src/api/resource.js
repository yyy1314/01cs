import store from '../store'
import request from '@/utils/request'

// 资源列表
export function getResourceList(params) {
  store.commit('setIsLoading', false)
  return request({
    url: '/resource',
    method: 'get',
    params
  })
}


// 资源对接上下架
export function resourceAdded(data) {
  store.commit('setIsLoading', false)
  return request({
    url: '/resourceAdded',
    method: 'post',
    data
  })
}

// 资源对接删除
export function resourceDel(data) {
  store.commit('setIsLoading', false)
  return request({
    url: '/resourceDel',
    method: 'post',
    data
  })
}

// 资源对接详情
export function resourceDetails(params) {
  store.commit('setIsLoading', false)
  return request({
    url: '/resourceDetails',
    method: 'get',
    params
  })
}

//  资源对接分类列表
export function resourceCategory(params) {
  store.commit('setIsLoading', false)
  return request({
    url: '/resourceCategory',
    method: 'get',
    params
  })
}
//  项目对接分类列表
export function resourceList(params){
  store.commit('setIsLoading', false)
  return request({
    url: '/resourceCategory',
    method: 'get',
    params
  })
}
//  资源对接分类删除
export function resourceCategoryDel(data) {
  store.commit('setIsLoading', false)
  return request({
    url: '/resourceCategoryDel',
    method: 'post',
    data
  })
}

//  资源对接分类创建
export function resourceCategoryCreate(params) {
  store.commit('setIsLoading', false)
  return request({
    url: '/resourceCategoryCreate',
    method: 'get',
    params
  })
}

//  资源对接报名列表
export function resourceJoin(params) {
  store.commit('setIsLoading', false)
  return request({
    url: '/resourceJoin',
    method: 'get',
    params
  })
}

//  资源对接创建
export function resourceCreate(data) {
  store.commit('setIsLoading', false)
  return request({
    url: '/resourceCreate',
    method: 'post',
    data
  })
}
//  已有城市省接口
export function gitCity(params) {
  store.commit('setIsLoading', false)
  return request({
    url: '/resourceCity',
    method: 'get',
    params
  })
}
//  标签库
export function gitTags(params) {
  store.commit('setIsLoading', false)
  return request({
    url: '/tags',
    method: 'get',
    params
  })
}



