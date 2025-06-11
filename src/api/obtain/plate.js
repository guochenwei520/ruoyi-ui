import request from '@/utils/request'

// 查询资料板块列表
export function listPlate(query) {
  return request({
    url: '/obtain/plate/list',
    method: 'get',
    params: query
  })
}

// 查询资料板块详细
export function getPlate(pid) {
  return request({
    url: '/obtain/plate/' + pid,
    method: 'get'
  })
}

// 新增资料板块
export function addPlate(data) {
  return request({
    url: '/obtain/plate',
    method: 'post',
    data: data
  })
}

// 修改资料板块
export function updatePlate(data) {
  return request({
    url: '/obtain/plate',
    method: 'put',
    data: data
  })
}

// 删除资料板块
export function delPlate(pid) {
  return request({
    url: '/obtain/plate/' + pid,
    method: 'delete'
  })
}
