import request from '@/utils/request'

// 查询就业状态列表
export function listObtainstatus(query) {
  return request({
    url: '/status/obtainstatus/list',
    method: 'get',
    params: query
  })
}

// 查询就业状态详细
export function getObtainstatus(id) {
  return request({
    url: '/status/obtainstatus/' + id,
    method: 'get'
  })
}

// 新增就业状态
export function addObtainstatus(data) {
  return request({
    url: '/status/obtainstatus',
    method: 'post',
    data: data
  })
}

// 修改就业状态
export function updateObtainstatus(data) {
  return request({
    url: '/status/obtainstatus',
    method: 'put',
    data: data
  })
}

// 删除就业状态
export function delObtainstatus(id) {
  return request({
    url: '/status/obtainstatus/' + id,
    method: 'delete'
  })
}
