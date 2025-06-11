import request from '@/utils/request'

// 查询课程计划列表
export function listPlan(query) {
  return request({
    url: '/obtain/plan/list',
    method: 'get',
    params: query
  })
}

// 查询课程计划详细
export function getPlan(planId) {
  return request({
    url: '/obtain/plan/' + planId,
    method: 'get'
  })
}

// 新增课程计划
export function addPlan(data) {
  return request({
    url: '/obtain/plan',
    method: 'post',
    data: data
  })
}

// 修改课程计划
export function updatePlan(data) {
  return request({
    url: '/obtain/plan',
    method: 'put',
    data: data
  })
}

// 删除课程计划
export function delPlan(planId) {
  return request({
    url: '/obtain/plan/' + planId,
    method: 'delete'
  })
}
