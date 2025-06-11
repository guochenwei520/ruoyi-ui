import request from '@/utils/request'

// 查询就业岗位信息列表
export function listObtainpost(query) {
  return request({
    url: '/obtain/obtainpost/list',
    method: 'get',
    params: query
  })
}

// 查询就业岗位信息详细
export function getObtainpost(postId) {
  return request({
    url: '/obtain/obtainpost/' + postId,
    method: 'get'
  })
}

// 新增就业岗位信息
export function addObtainpost(data) {
  return request({
    url: '/obtain/obtainpost',
    method: 'post',
    data: data
  })
}

// 修改就业岗位信息
export function updateObtainpost(data) {
  return request({
    url: '/obtain/obtainpost',
    method: 'put',
    data: data
  })
}

// 删除就业岗位信息
export function delObtainpost(postId) {
  return request({
    url: '/obtain/obtainpost/' + postId,
    method: 'delete'
  })
}
