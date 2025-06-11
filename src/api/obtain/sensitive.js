import request from '@/utils/request'

// 查询敏感词库管理列表
export function listSensitive(query) {
  return request({
    url: '/obtain/sensitive/list',
    method: 'get',
    params: query
  })
}

// 查询敏感词库管理详细
export function getSensitive(sensitiveId) {
  return request({
    url: '/obtain/sensitive/' + sensitiveId,
    method: 'get'
  })
}

// 新增敏感词库管理
export function addSensitive(data) {
  return request({
    url: '/obtain/sensitive',
    method: 'post',
    data: data
  })
}

// 修改敏感词库管理
export function updateSensitive(data) {
  return request({
    url: '/obtain/sensitive',
    method: 'put',
    data: data
  })
}

// 删除敏感词库管理
export function delSensitive(sensitiveId) {
  return request({
    url: '/obtain/sensitive/' + sensitiveId,
    method: 'delete'
  })
}
