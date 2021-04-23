import { fly } from '../utils/request'

const requestApi = {
  // 获取地址列表
  getAddressList() {
    return fly.get('/member/address/lists')
  },
  // 添加地址
  add(data) {
    return fly.post('/member/address/add', data)
  },
  // 修改地址
  edit(data) {
    return fly.post('/member/address/edit', data)
  },
  // 删除地址
  delete(id) {
    return fly.post('/member/address/del', { id })
  },
  // 设置默认地址
  setDefault(id) {
    return fly.post('/member/address/set', { id })
  }
}
export default requestApi
