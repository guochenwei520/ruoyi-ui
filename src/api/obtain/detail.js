import request from '@/utils/request'

// 查询学生就业状态明细列表
export function listDetail(query) {
  return request({
    url: '/obtain/detail/list',
    method: 'get',
    params: query
  })
}

// 查询学生就业状态明细详细
export function getDetail(obtainTrackDetailId) {
  return request({
    url: '/obtain/detail/' + obtainTrackDetailId,
    method: 'get'
  })
}

// 新增学生就业状态明细
export function addDetail(data) {
  return request({
    url: '/obtain/detail',
    method: 'post',
    data: data
  })
}

// 修改学生就业状态明细
export function updateDetail(data) {
  return request({
    url: '/obtain/detail',
    method: 'put',
    data: data
  })
}

// 删除学生就业状态明细
export function delDetail(obtainTrackDetailId) {
  return request({
    url: '/obtain/detail/' + obtainTrackDetailId,
    method: 'delete'
  })
}
