import { fly } from '../utils/request'

const requestApi = {
  // 获取购物车列表
  getCartList() {
    return fly.get('/member/cart/lists')
  },
  // 单选购物车商品
  cartSingleSelect(spec_id) {
    return fly.post('/member/cart/sel', { spec_id })
  },
  // 全选购物车
  cartAllSelect(state) {
    return fly.post('/member/cart/selAll', { state })
  },
  // 购物车数量
  cartAdd(spec_id, buy_num) {
    return fly.post('/member/cart/add', { spec_id, buy_num })
  },
  // 单个删除购物车
  cartDeleteByOne(spec_id) {
    return fly.post('/member/cart/del', { spec_id })
  }
}
export default requestApi
