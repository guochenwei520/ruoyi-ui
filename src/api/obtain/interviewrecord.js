import request from '@/utils/request'

// 查询面试记录列表
export function listInterviewrecord(query) {
  return request({
    url: '/obtain/interviewrecord/list',
    method: 'get',
    params: query
  })
}

// 查询面试记录详细
export function getInterviewrecord(questioningId) {
  return request({
    url: '/obtain/interviewrecord/' + questioningId,
    method: 'get'
  })
}

// 新增面试记录
export function addInterviewrecord(data) {
  return request({
    url: '/obtain/interviewrecord',
    method: 'post',
    data: data
  })
}

// 修改面试记录
export function updateInterviewrecord(data) {
  return request({
    url: '/obtain/interviewrecord',
    method: 'put',
    data: data
  })
}

// 删除面试记录
export function delInterviewrecord(questioningId) {
  return request({
    url: '/obtain/interviewrecord/' + questioningId,
    method: 'delete'
  })
}
