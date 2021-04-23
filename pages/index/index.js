// index.js
// 获取应用实例
const app = getApp()
import request from '../../api/index'
import userAuth from '../../utils/userAuth' // 登录获取token

Page({
  data: {
    isLogin: false,
    navOpacity: 0,
    titleColor: '#fff',
    capsuleToTop: app.globalData.capsuleToTop,
    indicatorDots: false,
    autoplay: true,
    interval: 3000,
    duration: 500,
    page: 1,
    pageSize: 10,
    totalPage: 0,
    swiperList: [],
    classArr: [],
    goodsList: [],
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName') // 如需尝试获取用户信息可改为false
  },
  onLoad() {
    this.checkTokenAuth()
  },
  onShow: function () {
    this.setData({
      isLogin: app.globalData.isLogin
    })
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
      this.getCarouseList()
      this.getClassList()
      this.getRecommendList()
    } else {
      // token 不存在
      app.globalData.isLogin = false
      this.setData({
        isLogin: false
      })
    }
  },
  openLoginPage() {
    // wx.navigateTo({ url: '/pages/regist/regist' })
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
  // 购买普通商品
  buyGood(e) {
    const { id } = app.tapData(e)
    wx.navigateTo({ url: '/pages/goodDetail/goodDetail?type=normal&id=' + id })
  },
  // 获取轮播
  getCarouseList() {
    request.getCarouseList().then((res) => {
      this.setData({
        swiperList: res.data.list
      })
    })
  },
  // 获取分类
  getClassList() {
    request.getClassList().then((res) => {
      this.setData({
        classArr: res.data.list
      })
      app.globalData.classList = this.data.classArr
    })
  },
  // 获取推荐列表
  getRecommendList(type) {
    request.getRecommendList(this.data.page, this.data.pageSize).then((res) => {
      this.data.totalPage = res.data.page_total
      let tempCommon = this.data.goodsList
      const resList = res.data.list
      if (type === 'down') {
        tempCommon.push(...resList)
        this.setData({
          goodsList: tempCommon
        })
      } else {
        this.setData({
          goodsList: resList
        })
      }
    })
  },
  // 触底加载
  onReachBottom() {
    if (this.data.page < this.data.totalPage) {
      this.data.page += 1
      this.getRecommendList('down')
    }
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
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
  onPullDownRefresh: function () {
    this.setData({
      page: 1,
      totalPage: 0,
      goodsList: []
    })
    this.checkTokenAuth()
    setTimeout(() => {
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 400)
  }
})
