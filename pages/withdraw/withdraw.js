const app = getApp()
import request from '../../api/personal'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isPushing: false,
    typeList: [
      {
        text: '银行卡',
        value: 'AMT'
      },
      {
        text: '支付宝',
        value: 'ALI'
      }
    ],
    updataForm: {
      type: 'AMT',
      apply_amount: undefined,
      account: undefined,
      realname: undefined,
      bank: undefined,
      cashMin: undefined,
      cashShouxu: undefined
    }
  },
  changeType(e) {
    this.setData({
      ['updataForm.type']: e.detail
    })
  },
  setInputVal(e) {
    app.setData(e, this)
  },
  getAccountInfo() {
    request.getAccountInfo(this.data.updataForm.type).then((res) => {
      this.setData({
        updataForm: { ...this.data.updataForm, ...res.data.info[0] }
      })
    })
  },
  confirmWithdraw() {
    const { apply_amount, realname, account, type, bank } = this.data.updataForm
    if (!apply_amount) return app.toastFail('请输入提现金额')
    if (!realname) return app.toastFail('请输入真实姓名')
    if (!account) return app.toastFail('请输入账号或卡号')
    if (type === 'AMT' && !bank) return app.toastFail('请输入开户行')
    this.setData({
      isPushing: true
    })
    request
      .withdrawApply(this.data.updataForm)
      .then((res) => {
        this.setData({
          isPushing: false
        })
        setTimeout(() => {
          wx.redirectTo({
            url: '/pages/withdrawRecord/withdrawRecord',
            success: function () {
              const pages = getCurrentPages()
              const beforePage = pages[pages.length - 2]
              // 对上个页面数据进行操作
              beforePage.getUserInfo()
              beforePage.getRewardList()
            }
          })
        }, 300)
      })
      .catch((err) => {
        this.setData({
          isPushing: false
        })
      })
  },
  openRecord() {
    wx.navigateTo({ url: `/pages/withdrawRecord/withdrawRecord` })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      cashMin: Number(options.cashMin),
      cashShouxu: Number(options.cashShouxu)
    })
    this.getAccountInfo()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {}
})
