import request from '@/utils/request'

// 查询事故单列表
export function listAccident(query) {
  return request({
    url: '/obtain/accident/list',
    method: 'get',
    params: query
  })
}

// 查询事故单详细
export function getAccident(reportedStatus,accidentId) {
  return request({
    url: '/obtain/accident/updateReportedStatus/' + reportedStatus+'/'+accidentId,
    method: 'get'
  })
}

// 新增事故单
export function addAccident(data) {
  return request({
    url: '/obtain/accident',
    method: 'post',
    data: data
  })
}

// 修改事故单
export function updateAccident(data) {
  return request({
    url: '/obtain/accident',
    method: 'put',
    data: data
  })
}

// 删除事故单
export function delAccident(accidentId) {
  return request({
    url: '/obtain/accident/' + accidentId,
    method: 'delete'
  })
}
