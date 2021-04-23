// pages/bonus/bonus.js
const app = getApp()
import request from '../../api/personal'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    capsuleToTop: app.globalData.capsuleToTop,
    navOpacity: 0,
    titleColor: '#fff',
    reward: 0,
    userInfo: undefined,
    page: 1,
    pageSize: 10,
    cashMin: undefined,
    cash_shouxu: undefined,
    rewardList: [],
    userType: undefined
  },
  getUserInfo() {
    request
      .getUserInfo()
      .then((res) => {
        const { info, param } = res.data
        this.setData({
          reward: info.reward,
          cashMin: param.cash_min,
          cashShouxu: param.cash_shouxu
        })
      })
      .catch((err) => {})
  },
  getRewardList(type) {
    request.rewardList(this.data.page, this.data.pageSize).then((res) => {
      this.data.totalPage = res.data.page_total
      let tempCommon = this.data.rewardList
      const resList = res.data.list
      if (type === 'down') {
        tempCommon.push(...resList)
        this.setData({
          rewardList: tempCommon
        })
      } else {
        this.setData({
          rewardList: resList
        })
      }
    })
  },
  // 触底加载
  onReachBottom() {
    if (this.data.page < this.data.totalPage) {
      this.data.page += 1
      this.getRewardList('down')
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userType: options.userType
    })
    this.getUserInfo()
    this.getRewardList()
  },
  onPageScroll: function (e) {
    let a = e.scrollTop / 60
    if (a <= 0) {
      this.setData({
        titleColor: '#fff'
      })
    }
    if (a >= 1) {
      a = 1
      this.setData({
        titleColor: '#000'
      })
    }
    this.setData({
      navOpacity: a
    })
  },
  openToBalance() {
    wx.navigateTo({ url: `/pages/withdrawToBalance/withdrawToBalance` })
  },
  openWithdraw() {
    wx.navigateTo({ url: `/pages/withdraw/withdraw?cashMin=${this.data.cashMin}&cashShouxu=${this.data.cashShouxu}` })
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
