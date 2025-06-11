import request from '@/utils/request'

// 查询工单回复列表
export function listReply(query) {
  return request({
    url: '/obtain/reply/list',
    method: 'get',
    params: query
  })
}

// 查询工单回复详细
export function getReply(replyId) {
  return request({
    url: '/obtain/reply/' + replyId,
    method: 'get'
  })
}

// 新增工单回复
export function addReply(data) {
  return request({
    url: '/obtain/reply',
    method: 'post',
    data: data
  })
}

// 修改工单回复
export function updateReply(data) {
  return request({
    url: '/obtain/reply',
    method: 'put',
    data: data
  })
}

// 删除工单回复
export function delReply(replyId) {
  return request({
    url: '/obtain/reply/' + replyId,
    method: 'delete'
  })
}
