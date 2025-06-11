import request from '@/utils/request'

// 查询工单类型列表
export function listType(query) {
  return request({
    url: '/obtain/type/list',
    method: 'get',
    params: query
  })
}

// 查询工单类型详细
export function getType(id) {
  return request({
    url: '/obtain/type/' + id,
    method: 'get'
  })
}

// 新增工单类型
export function addType(data) {
  return request({
    url: '/obtain/type',
    method: 'post',
    data: data
  })
}

// 修改工单类型
export function updateType(data) {
  return request({
    url: '/obtain/type',
    method: 'put',
    data: data
  })
}

// 删除工单类型
export function delType(id) {
  return request({
    url: '/obtain/type/' + id,
    method: 'delete'
  })
}


