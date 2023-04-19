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
    url: '/member_unit_enterprise/detail',
    method: 'get',
    params
  })
}

// 企业列表
export function getopportunityList1(params) {
  store.commit('setIsLoading', false)
  return request({
    url: '/member_unit_enterprise/index',
    method: 'get',
    params
  })
}
// 发布沟通
export function releaseCommunication(data) {
  store.commit('setIsLoading', false)
  return request({
    url: '/member_unit_enterprise/communicate',
    method: 'post',
    data
  })
}

// 导入
export function excelImport(data) {
  store.commit('setIsLoading', false)
  return request({
    url: '/member_unit_enterprise/import',
    method: 'post',
    data
  })
}

// 删除联系人
export function deleteContact(data) {
  store.commit('setIsLoading', false)
  return request({
    url: '/member_unit_enterprise/delete_contact',
    method: 'post',
    data
  })
}

// 删除附件
export function deleteAttachment(data) {
  store.commit('setIsLoading', false)
  return request({
    url: '/member_unit_enterprise/delete_attachment',
    method: 'post',
    data
  })
}

// 删除单位
export function deleteOpportunity(data) {
  store.commit('setIsLoading', false)
  return request({
    url: '/member_unit_enterprise/delete',
    method: 'post',
    data
  })
}

// 删除记录
export function deleteRecord(data) {
  store.commit('setIsLoading', false)
  return request({
    url: '/member_unit_enterprise/delete_communicate',
    method: 'post',
    data
  })
}
// 新增联系人
export function addRelation(data) {
  store.commit('setIsLoading', false)
  return request({
    url: '/member_unit_enterprise/create_contact',
    method: 'post',
    data
  })
}

// 省
export function getProvince(params) {
  store.commit('setIsLoading', false)
  return request({
    url: '/province',
    method: 'get',
    params
  })
}

// 市
export function getCity(params) {
  store.commit('setIsLoading', false)
  return request({
    url: '/city',
    method: 'get',
    params
  })
}

// 区
export function getArea(params) {
  store.commit('setIsLoading', false)
  return request({
    url: '/area',
    method: 'get',
    params
  })
}

// 企业会员单位创建
export function establish(data) {
  store.commit('setIsLoading', false)
  return request({
    url: '/member_unit_enterprise/create',
    method: 'post',
    data
  })
}
// 企业导出
export function exportExcel(params) {
  store.commit('setIsLoading', false)
  return request({
    url: '/member_unit_enterprise/export',
    method: 'get',
    params
  })
}
// 企业会员单位修改
export function exchangeEnterprise(data) {
  store.commit('setIsLoading', false)
  return request({
    url: '/member_unit_enterprise/modify',
    method: 'post',
    data
  })
}
