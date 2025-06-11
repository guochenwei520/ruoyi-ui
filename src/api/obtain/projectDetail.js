import request from '@/utils/request'

// 查询项目管理详情列表
export function listProjectDetail(query) {
  return request({
    url: '/obtain/projectDetail/list',
    method: 'get',
    params: query
  })
}

// 查询项目管理详情详细
export function getProjectDetail(projectDetailId) {
  return request({
    url: '/obtain/projectDetail/' + projectDetailId,
    method: 'get'
  })
}

// 新增项目管理详情
export function addProjectDetail(data) {
  return request({
    url: '/obtain/projectDetail',
    method: 'post',
    data: data
  })
}

// 修改项目管理详情
export function updateProjectDetail(data) {
  return request({
    url: '/obtain/projectDetail',
    method: 'put',
    data: data
  })
}

// 删除项目管理详情
export function delProjectDetail(projectDetailId) {
  return request({
    url: '/obtain/projectDetail/' + projectDetailId,
    method: 'delete'
  })
}
