import request from '@/utils/request'

// 查询关于我们列表
export function listAboutUs(query) {
  return request({
    url: '/obtain/aboutUs/list',
    method: 'get',
    params: query
  })
}

// 查询关于我们详细
export function getAboutUs(aboutId) {
  return request({
    url: '/obtain/aboutUs/' + aboutId,
    method: 'get'
  })
}

// 新增关于我们
export function addAboutUs(data) {
  return request({
    url: '/obtain/aboutUs',
    method: 'post',
    data: data
  })
}

// 修改关于我们
export function updateAboutUs(data) {
  return request({
    url: '/obtain/aboutUs',
    method: 'put',
    data: data
  })
}

// 删除关于我们
export function delAboutUs(aboutId) {
  return request({
    url: '/obtain/aboutUs/' + aboutId,
    method: 'delete'
  })
}
