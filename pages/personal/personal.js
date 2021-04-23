import userAuth from '../../utils/userAuth'
const app = getApp()
import request from '../../api/personal'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isLogouting: false,
    isLogin: app.globalData.isLogin,
    capsuleToTop: app.globalData.capsuleToTop,
    navOpacity: 0,
    titleColor: '#fff',
    userType: undefined,
    userInfo: undefined,
    servePhone: undefined,
    supAgentPhone: undefined,
    orderList: [
      // { img: '/static/img/personal/pending.png', name: '待付款', value: 1, isMakePhone: false },
      { img: '/static/img/personal/stocking.png', name: '待发货', value: 'unuse', isMakePhone: false },
      { img: '/static/img/personal/sending.png', name: '待收货', value: 'delivery', isMakePhone: false },
      { img: '/static/img/personal/end.png', name: '已完成', value: 'finish', isMakePhone: false },
      { img: '/static/img/personal/complain.png', name: '投诉', value: 5, isMakePhone: true }
    ],
    operationList: [
      {
        img: '/static/img/personal/address.png',
        name: '收货地址',
        url: '/pages/addressList/addressList',
        value: 1
      },
      {
        img: '/static/img/personal/notice.png',
        name: '平台公告',
        url: '/pages/announcement/announcement',
        value: 2
      },
      // {
      //   img: '/static/img/personal/bonus.png',
      //   name: '奖金账户',
      //   roles: ['agent', 'dealer'],
      //   url: '/pages/bonus/bonus',
      //   value: 3
      // },
      // {
      //   img: '/static/img/personal/withdraw.png',
      //   name: '提现账户',
      //   roles: ['agent', 'dealer'],
      //   url: '/pages/withdrawManage/withdrawManage',
      //   value: 4
      // },
      {
        img: '/static/img/personal/order.png',
        name: '客户订单',
        roles: ['agent', 'dealer'],
        url: '/pages/clientOrder/clientOrder',
        value: 5
      },
      {
        img: '/static/img/personal/order.png',
        name: '经销商订单',
        roles: ['agent'],
        url: '/pages/dealerOrder/dealerOrder',
        value: 6
      },
      // {
      //   img: '/static/img/personal/qrcode.png',
      //   name: '推广码',
      //   roles: ['agent', 'dealer'],
      //   url: '/pages/spread/spread',
      //   value: 7
      // },
      {
        img: '/static/img/personal/team.png',
        name: '我的团队',
        roles: ['agent', 'dealer'],
        url: '/pages/team/team',
        value: 8
      }
    ],
    filterOperationList: []
  },
  // 获取个人信息
  async getUserInfoAsync() {
    try {
      const res = await request.getUserInfo()
      const { info, param } = res.data
      // 进行角色权限过滤
      const filterOperationList = []
      this.data.operationList.map((item) => {
        if (item.roles) {
          if (item.roles.includes(info.type)) {
            filterOperationList.push(item)
          }
        } else {
          filterOperationList.push(item)
        }
      })
      this.setData({
        userType: info.type,
        userInfo: info,
        filterOperationList,
        servePhone: param.kefu,
        supAgentPhone: info.parent_phone || ''
      })
    } catch (err) {
      console.log(err)
    }
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
  jumpPage(e) {
    const { url, spreadCode } = e.currentTarget.dataset
    if (url) {
      wx.navigateTo({
        url: url + `?spreadCode=${spreadCode}`,
        success: function (res) {}
      })
    } else {
      app.toastFail('暂未上线，敬请期待')
    }
  },
  openBillRecord() {
    // app.navigateTo('/pages/billRecord/billRecord', { status: 7 })
    app.navigateTo('/pages/billRecord/billRecord', { userType: this.data.userType })
  },
  openOrder(e) {
    const { status, isMakePhone } = app.tapData(e)
    if (!isMakePhone) {
      wx.navigateTo({ url: `/pages/order/order?userType=${this.data.userType}&status=${status}` })
    } else {
      wx.makePhoneCall({
        phoneNumber: this.data.servePhone, //仅为示例，并非真实的电话号码
        success() {},
        fail() {}
      })
    }
  },
  // 复制
  copyText(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '复制失败',
          icon: 'none'
        })
      }
    })
  },
  makeCall(e) {
    const { phone } = app.tapData(e)
    wx.makePhoneCall({
      phoneNumber: phone, //仅为示例，并非真实的电话号码
      success() {},
      fail() {}
    })
  },
  openBonus() {
    wx.navigateTo({
      url: `/pages/bonus/bonus?userType=${this.data.userType}`
    })
  },
  async checkTokenAuth() {
    try {
      const token = await userAuth.setTokenSync()
      if (token) {
        // token 存在
        app.globalData.isLogin = true
        this.setData({
          isLogin: true
        })
        await this.getUserInfoAsync()
      } else {
        // token 不存在
        app.globalData.isLogin = false
        this.setData({
          isLogin: false
        })
      }
    } catch (err) {
      console.log(err)
    }
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
  async handleLogout() {
    const res = await app.showModal('提示', '是否退出登录')
    if (res) {
      userAuth.clearHaveToken()
      const page = getCurrentPages().pop()
      page.onLoad()
      // wx.switchTab({
      //   url: '/pages/index/index',
      //   success: function () {
      //     const page = getCurrentPages().pop()
      //     page.onLoad()
      //   }
      // })
    }
  },
  onLoad: async function (options) {
    this.setData({
      isLogin: app.globalData.isLogin
    })
    this.checkTokenAuth()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      isLogin: app.globalData.isLogin
    })
    if (this.data.isLogin) {
      this.checkTokenAuth()
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
  onPullDownRefresh: function () {
    this.getUserInfoAsync()
    setTimeout(() => {
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 400)
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {}
})
