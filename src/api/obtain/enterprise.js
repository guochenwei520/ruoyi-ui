import request from '@/utils/request'

// 查询就业企业列表
export function listEnterprise(query) {
  return request({
    url: '/obtain/enterprise/list',
    method: 'get',
    params: query
  })
}

// 查询就业企业详细
export function getEnterprise(enterpriseId) {
  return request({
    url: '/obtain/enterprise/' + enterpriseId,
    method: 'get'
  })
}

// 新增就业企业
export function addEnterprise(data) {
  return request({
    url: '/obtain/enterprise',
    method: 'post',
    data: data
  })
}

// 修改就业企业
export function updateEnterprise(data) {
  return request({
    url: '/obtain/enterprise',
    method: 'put',
    data: data
  })
}

// 删除就业企业
export function delEnterprise(enterpriseId) {
  return request({
    url: '/obtain/enterprise/' + enterpriseId,
    method: 'delete'
  })
}
