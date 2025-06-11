import request from '@/utils/request'

// 查询简历档案列表
export function listProfile(query) {
  return request({
    url: '/obtain/profile/list',
    method: 'get',
    params: query
  })
}

// 根据学生id查询简历档案列表
export function listResume(stuId) {
  return request({
    url: '/obtain/profile/listResume/'+stuId,
    method: 'get'
  })
}


// 查询简历档案详细
export function getProfile(resumeId) {
  return request({
    url: '/obtain/profile/' + resumeId,
    method: 'get'
  })
}



// 新增简历档案
export function addProfile(data) {
  return request({
    url: '/obtain/profile',
    method: 'post',
    data: data
  })
}

// 修改简历档案
export function updateProfile(data) {
  return request({
    url: '/obtain/profile',
    method: 'put',
    data: data
  })
}

// 删除简历档案
export function delProfile(resumeId) {
  return request({
    url: '/obtain/profile/' + resumeId,
    method: 'delete'
  })
}

// 下载简历档案
export function download(resumeId) {
  return request({
    url: '/obtain/profile/download/' + resumeId,
    method: 'get'
  })
}

