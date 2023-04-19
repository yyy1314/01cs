import store from '../store'
import request from '@/utils/request'

// 新增企业
export function opportunityCreate(data) {
  store.commit('setIsLoading', false)
  return request({
    url: '/opportunityCreate',
    method: 'post',
    data
  })
}
// ////////////////////////////////////////////////////////
// 企业详情
export function opportunityDetails(params) {
  store.commit('setIsLoading', false)
  return request({
    url: '/member_unit_government/detail',
    method: 'get',
    params
  })
}

// 企业列表
export function getopportunityList(params) {
  store.commit('setIsLoading', false)
  return request({
    url: '/member_unit_government/index',
    method: 'get',
    params
  })
}
// 发布沟通
export function releaseCommunication(data) {
  store.commit('setIsLoading', false)
  return request({
    url: '/member_unit_government/communicate',
    method: 'post',
    data
  })
}

// 导入
export function excelImport(data) {
  store.commit('setIsLoading', false)
  return request({
    url: '/member_unit_government/improt',
    method: 'post',
    data
  })
}

// 删除记录
export function deleteRecord(data) {
  store.commit('setIsLoading', false)
  return request({
    url: '/member_unit_government/delete_communicate',
    method: 'post',
    data
  })
}
// 新增联系人
export function addRelation(data) {
  store.commit('setIsLoading', false)
  return request({
    url: '/member_unit_government/create_contact',
    method: 'post',
    data
  })
}

// 删除联系人
export function deleteContact(data) {
  store.commit('setIsLoading', false)
  return request({
    url: '/member_unit_government/delete_contact',
    method: 'post',
    data
  })
}

// 删除附件
export function deleteAttachment(data) {
  store.commit('setIsLoading', false)
  return request({
    url: '/member_unit_government/delete_attachment',
    method: 'post',
    data
  })
}

// 删除单位
export function deleteGovernment(data) {
  store.commit('setIsLoading', false)
  return request({
    url: '/member_unit_government/delete',
    method: 'post',
    data
  })
}

// 政府会员单位创建
export function establish1(data) {
  store.commit('setIsLoading', false)
  return request({
    url: '/member_unit_government/create',
    method: 'post',
    data
  })
}

// 政府导出
export function exportExcel(params) {
  store.commit('setIsLoading', false)
  return request({
    url: '/member_unit_government/export',
    method: 'get',
    params
  })
}

// 政府会员单位修改
export function exchangeGovernmentFn(data) {
  store.commit('setIsLoading', false)
  return request({
    url: '/member_unit_government/modify',
    method: 'post',
    data
  })
}
