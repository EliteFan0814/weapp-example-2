import userAuth from '../../utils/userAuth'
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    servePhone: undefined,
    isPushing: false
  },
  callServer(e) {
    const { phone } = app.tapData(e)
    wx.makePhoneCall({
      phoneNumber: phone, //仅为示例，并非真实的电话号码
      success() {},
      fail() {}
    })
  },
  // 重新登录
  async reLogin() {
    this.setData({
      isPushing: true
    })
    try {
      const token = await userAuth.setTokenSync()
      if (token) {
        wx.switchTab({ url: '/pages/index/index' })
      } else {
        app.toastFail('登录失败，请联系客服')
      }
      this.setData({
        isPushing: false
      })
    } catch (err) {
      this.setData({
        isPushing: false
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      servePhone: options.phone
    })
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
