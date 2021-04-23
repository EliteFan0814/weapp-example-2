import { fly } from '../utils/request'

const requestApi = {
  // 确认立即购买订单信息
  getConfirmNowInfo(role, spec_id, buy_num, is_cart = 0) {
    return fly.post(`/member/order_${role}/confirm`, { spec_id, buy_num, is_cart })
  },
  // 购物车列表订单信息
  getConfirmCartInfo(role, is_cart = 1) {
    return fly.post(`/member/order_${role}/confirm`, { is_cart })
  },
  // 结算立即购买 客户角色: member dealer agent
  buyNow(spec_id, buy_num, address_id, role, remark, is_cart = 0) {
    return fly.post(`/member/order_${role}/submit`, { spec_id, buy_num, address_id, remark, is_cart })
  },
  // 结算购物车 客户角色: member dealer agent
  buyCart(role, address_id, is_cart = 1) {
    return fly.post(`/member/order_${role}/submit`, { address_id, is_cart })
  },
  // 取消订单 客户角色: member dealer agent
  cancalOrder(role, order_id) {
    return fly.post(`/member/order_${role}/cancel`, { order_id })
  },
  // 确认收货 客户角色: member dealer agent
  confirm(role, id) {
    return fly.post(`/member/order_${role}/receive`, { id })
  },
  // 订单详情 客户角色: member dealer agent
  orderDetails(role, order_id) {
    return fly.get(`/member/order_${role}/info`, { order_id })
  },
  // 获取订单列表 客户角色: member dealer agent
  getOrderList(role, page, rows, screen) {
    return fly.get(`/member/order_${role}/lists`, { page, rows, screen })
  },
  // 获取客户订单
  getOrderListClient(page, rows, screen) {
    return fly.get(`/member/order_member/index`, { page, rows, screen })
  },
  // 客户订单发货
  deliverClient(order_id, express_number) {
    return fly.post(`/member/order_member/deliver`, { order_id, express_number })
  },
  // 获取经销商订单
  getOrderListDealer(page, rows, screen) {
    return fly.get(`/member/order_dealer/index`, { page, rows, screen })
  },
  // 经销商订单发货
  deliverDealer(order_id, express_number) {
    return fly.post(`/member/order_dealer/deliver`, { order_id, express_number })
  }
  // // 获取购物车信息
  // getCartInfo(cartIds) {
  //   return fly.post('/api/Cart/GetCartProduct', cartIds)
  // },
  // // 获取默认地址
  // getDefaultAddress() {
  //   return fly.post('/api/MemberAddress/LoadDefualt')
  // },
  // // 结算积分兑换
  // buyExchange(AddressId, GoodsId, GoodsCount) {
  //   return fly.post('/api/integralOrder/CreateOrder', { AddressId, GoodsId, GoodsCount })
  // },
  // // 获取支付单
  // getOrder(id) {
  //   return fly.post('/api/ProductOrder/GetPayOrder', id)
  // },
  // // 获取时间段
  // getTimes() {
  //   return fly.get('/api/DeliveryTime/GetTimes')
  // },
  // // 退款
  // refund(orderId) {
  //   return fly.post('/api/ProductOrder/RefundOrder', orderId)
  // },
  // // 获取积分订单列表
  // getExchangeOrderList(page, pageSize, status, memberId) {
  //   return fly.get('/api/integralOrder/OrderList', { page, pageSize, status, memberId })
  // },
  // // 积分订单确认收货
  // confirmGetExchange(id) {
  //   return fly.post('/api/integralOrder/ConfirmReceipt', id)
  // },
  // // 积分订单详情
  // exchangeOrderDetail(orderId) {
  //   return fly.get('/api/integralOrder/GetOneOrder', { orderId })
  // },
  // // 积分流水
  // exchangeRecord(page, pageSize, type, isIncome) {
  //   return fly.get('/api/integralOrder/IntegralDetail', { page, pageSize, type })
  // },
  // // 获取自提地址
  // getSelfGetInfo() {
  //   return fly.get('/api/SystemSettings/GetPickUpInfo')
  // }
}
export default requestApi
