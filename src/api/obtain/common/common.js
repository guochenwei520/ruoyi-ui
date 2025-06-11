import request from '@/utils/request'
/*当前组件为公共组件*/
export function hasWorkOrder() {
  return request({
    url: '/obtain/order/hasWorkOrder',
    method: 'get'
  })
}
