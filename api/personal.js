import { fly } from '../utils/request'

const requestApi = {
  // 登录
  login(openid, phone, thumb, nickname, spread_code) {
    return fly.post('member/pub/login', { openid, phone, thumb, nickname, spread_code })
  },
  // 获取个人信息
  getUserInfo() {
    return fly.get('/member/member/info')
  },
  // 公告列表
  noticeList(page, rows, cate = 'notice') {
    return fly.get('/member/article/lists', { page, rows, cate })
  },
  // 公告详情
  noticeInfo(id) {
    return fly.get('/member/article/info', { id })
  },
  // 奖金账户记录
  rewardList(page, rows, type = 'reward') {
    return fly.get('/member/member_bill/lists', { page, rows, type })
  },
  // 我的账单记录
  billList(page, rows, type) {
    return fly.get('/member/member_bill/lists', { page, rows, type })
  },
  // 转账到余额
  withdrawToBalance(money) {
    return fly.post('/member/member/transfer', { money })
  },
  // 申请提现
  withdrawApply(data) {
    return fly.post('/member/cash/apply', data)
  },
  // 获取账户信息
  getAccountInfo(type) {
    return fly.get('/member/cash_account/lists', { type })
  },
  // 我的团队
  teamList(page, row) {
    return fly.get('/member/member/team', { page, row })
  },
  // 绑定手机
  bindPhone(session, encryptedData, iv) {
    return fly.post('/member/pub/phone', { session, encryptedData, iv })
  },
  // 注册新用户
  registNewMember(open_id, phone, nickname, thumb, spread_code) {
    return fly.post('/member/pub/register', { open_id, phone, nickname, thumb, spread_code })
  },
  // 提现记录
  getWithdrawRecord(page, rows) {
    return fly.get('/member/cash/lists', { page, rows })
  }
}
export default requestApi
