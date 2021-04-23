// pages/class/class.js
const app = getApp()
import { getElementWH } from '../../utils/baseTools'
import indexRequest from '../../api/index'
import userAuth from '../../utils/userAuth' // 登录获取token

Page({
  /**
   * 页面的初始数据
   */
  data: {
    titleColor: '#fff',
    capsuleToTop: app.globalData.capsuleToTop,
    headerHeight: 0,
    selectedClassIndex: 0,
    classList: app.globalData.classList,
    isLogin: app.globalData.isLogin
  },
  // 检查 token 是否存在
  async checkTokenAuth() {
    const token = await userAuth.setTokenSync()
    if (token) {
      // token 存在
      app.globalData.isLogin = true
      this.setData({
        isLogin: true
      })
      this.getClassList()
    } else {
      // token 不存在
      app.globalData.isLogin = false
      this.setData({
        isLogin: false
      })
    }
  },
  // 获取分类
  getClassList() {
    indexRequest.getClassList().then((res) => {
      this.setData({
        classList: res.data.list
      })
      app.globalData.classList = this.data.classList
    })
  },
  openSearch() {
    wx.navigateTo({
      url: '/pages/search/search'
    })
  },
  openLoginPage() {
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        const { nickName, avatarUrl } = res.userInfo
        app.globalData.wxNickname = nickName
        app.globalData.wxThumb = avatarUrl
        app.globalData.hasWxUserInfo = true
        this.setData({
          hasUserInfo: true
        })
        app.navigateTo('/pages/regist/regist', {
          nickname: nickName,
          thumb: avatarUrl
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getClassList()
    this.setData({
      isLogin: app.globalData.isLogin
    })
    this.checkTokenAuth()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    if (this.data.isLogin) {
      getElementWH('#base-header').then((res) => {
        this.setData({
          headerHeight: res.height + 50
        })
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      isLogin: app.globalData.isLogin,
      classList: app.globalData.classList,
      selectedClassIndex: app.globalData.selectedClassIndex || 0
    })
    if (this.data.isLogin) {
      this.getClassList()
    }
  },
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
