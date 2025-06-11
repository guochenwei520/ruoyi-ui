import request from '@/utils/request'

// 查询用户手册列表
export function listManual(query) {
  return request({
    url: '/obtain/manual/list',
    method: 'get',
    params: query
  })
}

// 查询用户手册详细
export function getManual(manualId) {
  return request({
    url: '/obtain/manual/' + manualId,
    method: 'get'
  })
}

// 新增用户手册
export function addManual(data) {
  return request({
    url: '/obtain/manual',
    method: 'post',
    data: data
  })
}

// 修改用户手册
export function updateManual(data) {
  return request({
    url: '/obtain/manual',
    method: 'put',
    data: data
  })
}

// 删除用户手册
export function delManual(manualId) {
  return request({
    url: '/obtain/manual/' + manualId,
    method: 'delete'
  })
}
