import request from '@/utils/request'

// 查询面试记录列表
export function listInterview(query) {
  return request({
    url: '/obtain/interview/list',
    method: 'get',
    params: query
  })
}
// 根据学生id查询面试记录列表
export function listInterviews(stuId) {
  return request({
    url: '/obtain/interview/listInterviews/'+stuId,
    method: 'get'
  })
}
// 查询面试记录详细
export function getInterview(interviewId) {
  return request({
    url: '/obtain/interview/' + interviewId,
    method: 'get'
  })
}

// 新增面试记录
export function addInterview(data) {
  return request({
    url: '/obtain/interview',
    method: 'post',
    data: data
  })
}

// 修改面试记录
export function updateInterview(data) {
  return request({
    url: '/obtain/interview',
    method: 'put',
    data: data
  })
}

// 删除面试记录
export function delInterview(interviewId) {
  return request({
    url: '/obtain/interview/' + interviewId,
    method: 'delete'
  })
}
