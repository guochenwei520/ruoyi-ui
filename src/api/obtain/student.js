import request from '@/utils/request'
import {parseStrEmpty} from "@/utils/ruoyi";

//手机号码是否存在
export  function getCheckTelCode(mobile){
    return request({
       url: '/obtain/student/getCheckTelCode/'+mobile,
      method: 'get'
    })
}
//身份证是否存在
export  function getCheckIdenNum(idenNum){
  return request({
    url: '/obtain/student/getCheckCard/'+idenNum,
    method: 'get'
  })
}
export  function getWeixin(vx){
  return request({
    url: '/obtain/student/hasWeixin',
    method: 'get',
    params: vx
  })
}
// 查询学员管理列表
export function listStudent(query) {
  return request({
    url: '/obtain/student/list',
    method: 'get',
    params: query
  })
}

// 查询学员管理详细
export function getStudent(obtainStudentId) {
  return request({
    url: '/obtain/student/' + obtainStudentId,
    method: 'get'
  })
}
// 查询学员管理详细
export function getWordTemplate(obtainStudentId) {
  return request({
    url: '/obtain/student/getWordTemplate/' + obtainStudentId,
    method: 'get'
  })
}

// 新增学员管理
export function addStudent(data) {
  return request({
    url: '/obtain/student',
    method: 'post',
    data: data
  })
}

// 修改学员管理
export function updateStudent(data) {
  return request({
    url: '/obtain/student',
    method: 'put',
    data: data
  })
}

// 删除学员管理
export function delStudent(obtainStudentId) {
  return request({
    url: '/obtain/student/' + obtainStudentId,
    method: 'delete'
  })

}

// 查询班级管理详细
export function getSelectRoomBydeptId(deptId) {
  return request({
    url: '/obtain/student/selectRoomBydeptId/'+deptId,
    method: 'get'
  })
  // 查询学生下拉
}export function getSelectStuByRoomId(roomId) {
  return request({
    url: '/obtain/final/getSelectStuByRoomId/'+roomId,
    method: 'get'
  })
}

export function getSelectMarket() {
  return request({
    url: '/obtain/student/getSelectMarket',
    method: 'get'
  })
}
export function getSelectCollege() {
  return request({
    url: '/obtain/student/getSelectCollege',
    method: 'get'
  })
}

// 一级状态下拉
export function getSelectFirst(pid) {
  return request({
    url: '/obtain/student/getSelectThree/' + pid,
    method: 'get'
  })

}
// 二级状态下拉
export function getSelectSecond(pid) {
  return request({
    url: '/obtain/student/getSelectThree/' + pid,
    method: 'get'
  })

}


// 三级状态下拉
export function getSelectThree(pid) {
  return request({
    url: '/obtain/student/getSelectThree/' + pid,
    method: 'get'
  })

}
// 一级状态下拉
export function getSelectFirstById(id) {
  return request({
    url: '/obtain/student/getSelectThreeById/' + id,
    method: 'get'
  })

}
// 二级状态下拉
export function getSelectSecondById(id) {
  return request({
    url: '/obtain/student/getSelectThreeById/' + id,
    method: 'get'
  })

}


// 三级状态下拉
export function getSelectThreeById(id) {
  return request({
    url: '/obtain/student/getSelectThreeById/' + id,
    method: 'get'
  })

}
//账号冻结
export function unLockUserName(phonenumber) {
  return request({
    url: '/obtain/student/unLockUserName/' + phonenumber,
    method: 'get'
  })
}
//账号解冻
export function lockUserName(phonenumber) {
  return request({
    url: '/obtain/student/lockUserName/' + phonenumber,
    method: 'get'
  })
}
/*获取用户登录角色*/
/*获取用户登录角色*/
export function getQueryStuRoles() {
  return request({
    url: '/obtain/student/getQueryStuRoles',
    method: 'get'
  })
}
