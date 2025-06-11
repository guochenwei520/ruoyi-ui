import request from "@/utils/request";
let fileUrl = '/obtain/profile'
export function getPrevieweFile(resumeId) {
  return request({
    url: '/obtain/profile/download/'+resumeId,
    method: 'get',
    responseType: 'blob'
  })
}
