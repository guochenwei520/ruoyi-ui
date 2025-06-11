import request from '@/utils/request'

// 查询就业问题反馈列表
export function listProblem(query) {
  return request({
    url: '/obtain/problem/list',
    method: 'get',
    params: query
  })
}

// 查询就业问题反馈详细
export function getProblem(problemId) {
  return request({
    url: '/obtain/problem/' + problemId,
    method: 'get'
  })
}

// 新增就业问题反馈
export function addProblem(data) {
  return request({
    url: '/obtain/problem',
    method: 'post',
    data: data
  })
}

// 修改就业问题反馈
export function updateProblem(data) {
  return request({
    url: '/obtain/problem',
    method: 'put',
    data: data
  })
}

// 删除就业问题反馈
export function delProblem(problemId) {
  return request({
    url: '/obtain/problem/' + problemId,
    method: 'delete'
  })
}
