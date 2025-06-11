import request from '@/utils/request'

// 查询提问记录列表
export function listQuestioningRecord(query) {
  return request({
    url: '/obtain/QuestioningRecord/list',
    method: 'get',
    params: query
  })
}
// 根据学生id查询提问记录列表
export function getlistQuestioning(stuId) {
  return request({
    url: '/obtain/QuestioningRecord/getlistQuestionings/'+stuId,
    method: 'get'
  })
}
// 查询提问记录详细
export function getQuestioningRecord(questioningId) {
  return request({
    url: '/obtain/QuestioningRecord/' + questioningId,
    method: 'get'
  })
}

// 新增提问记录
export function addQuestioningRecord(data) {
  return request({
    url: '/obtain/QuestioningRecord',
    method: 'post',
    data: data
  })
}

// 修改提问记录
export function updateQuestioning(data) {
  return request({
    url: '/obtain/QuestioningRecord/',
    method: 'put',
    data: data
  })
}
// 完结提问记录
export function overQuestioningRecord(data) {
  return request({
    url: '/obtain/QuestioningRecord/overQuestioningRecord',
    method: 'put',
    data: data
  })
}
// 问题处理
export function updateQuestioningRecord(data) {
  return request({
    url: '/obtain/QuestioningRecord/updateQuestioningRecord',
    method: 'put',
    data: data
  })
}

// 删除提问记录
export function delQuestioningRecord(questioningId) {
  return request({
    url: '/obtain/QuestioningRecord/' + questioningId,
    method: 'delete'
  })
}
