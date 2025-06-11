import request from '@/utils/request'

// 查询跟踪记录明细列表
export function listTrackDetail(query) {
  return request({
    url: '/obtain/trackDetail/list',
    method: 'get',
    params: query
  })
}

// 查询跟踪记录明细详细
export function getTrackDetail(trackDetailId) {
  return request({
    url: '/obtain/trackDetail/' + trackDetailId,
    method: 'get'
  })
}

// 新增跟踪记录明细
export function addTrackDetail(data) {
  return request({
    url: '/obtain/trackDetail',
    method: 'post',
    data: data
  })
}

// 修改跟踪记录明细
export function updateTrackDetail(data) {
  return request({
    url: '/obtain/trackDetail',
    method: 'put',
    data: data
  })
}

// 删除跟踪记录明细
export function delTrackDetail(trackDetailId) {
  return request({
    url: '/obtain/trackDetail/' + trackDetailId,
    method: 'delete'
  })
}
