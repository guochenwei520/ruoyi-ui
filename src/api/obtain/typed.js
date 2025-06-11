import request from '@/utils/request'

// 查询面试问题类型列表
export function listTyped(query) {
  return request({
    url: '/obtain/typed/list',
    method: 'get',
    params: query
  })
}

// 查询面试问题类型详细
export function getTyped(tid) {
  return request({
    url: '/obtain/typed/' + tid,
    method: 'get'
  })
}

// 新增面试问题类型
export function addTyped(data) {
  return request({
    url: '/obtain/typed',
    method: 'post',
    data: data
  })
}

// 修改面试问题类型
export function updateTyped(data) {
  return request({
    url: '/obtain/typed',
    method: 'put',
    data: data
  })
}

// 删除面试问题类型
export function delTyped(tid) {
  return request({
    url: '/obtain/typed/' + tid,
    method: 'delete'
  })
}
