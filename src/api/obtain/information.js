import request from '@/utils/request'

// 查询行业资讯列表
export function listInformation(query) {
  return request({
    url: '/obtain/information/list',
    method: 'get',
    params: query
  })
}

// 查询行业资讯详细
export function getInformation(id) {
  return request({
    url: '/obtain/information/' + id,
    method: 'get'
  })
}

// 新增行业资讯
export function addInformation(data) {
  return request({
    url: '/obtain/information',
    method: 'post',
    data: data
  })
}

// 修改行业资讯
export function updateInformation(data) {
  return request({
    url: '/obtain/information',
    method: 'put',
    data: data
  })
}

// 删除行业资讯
export function delInformation(id) {
  return request({
    url: '/obtain/information/' + id,
    method: 'delete'
  })
}
