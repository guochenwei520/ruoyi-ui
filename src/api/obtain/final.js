import request from '@/utils/request'

// 查询学生就业信息列表
export function listFinal(query) {
  return request({
    url: '/obtain/final/list',
    method: 'get',
    params: query
  })
}

// 查询学生就业信息详细
export function getFinal(obtainFinalId) {
  return request({
    url: '/obtain/final/' + obtainFinalId,
    method: 'get'
  })
}

// 新增学生就业信息
export function addFinal(data) {
  return request({
    url: '/obtain/final',
    method: 'post',
    data: data
  })
}

// 修改学生就业信息
export function updateFinal(data) {
  return request({
    url: '/obtain/final',
    method: 'put',
    data: data
  })
}

// 删除学生就业信息
export function delFinal(obtainFinalId) {
  return request({
    url: '/obtain/final/' + obtainFinalId,
    method: 'delete'
  })
}
