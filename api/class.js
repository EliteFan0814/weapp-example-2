import { fly } from '../utils/request'

const requestApi = {
  // 获取分类列表
  getClassList() {
    return fly.get('/api/ProductType/List')
  },
  //获取单个分类列表
  getClassItemList(page, rows = 10, cate_id) {
    return fly.get('/member/goods/lists', { page, rows, cate_id })
  }
}
export default requestApi
