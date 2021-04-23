// pages/login/login.js
import request from '../../api/personal'
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    hasUserInfo: true,
    mobileAuth: false,
    phone: undefined,
    nickname: undefined,
    thumb: undefined,
    openid: undefined,
    spread_code: undefined,
    phone: undefined,
    showLogin: true,
    isGetting: false,
    needSpreadCode: false,
    isPushing: false
  },
  // 点击获取微信昵称头像并更新到后台
  // getWxUserInfo() {
  //   wx.getUserProfile({
  //     desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
  //     success: (res) => {
  //       const { nickName, avatarUrl } = res.userInfo
  //       app.globalData.wxNickname = nickName
  //       app.globalData.wxThumb = avatarUrl
  //       app.globalData.hasWxUserInfo = true
  //       this.setData({
  //         hasUserInfo: true
  //       })
  //     }
  //   })
  // },
  // 获取并绑定手机号
  async getPhoneNumber(e) {
    try {
      this.setData({ isGetting: true })
      if (e.detail.errMsg.indexOf('ok') > -1) {
        // 绑定手机号
        const openid = wx.getStorageSync('openid')
        const sessionKey = wx.getStorageSync('session_key')
        const { wxNickname, wxThumb } = app.globalData
        const res = await request.bindPhone(sessionKey, e.detail.encryptedData, e.detail.iv)
        const loginRes = await request.login(openid, res.data.phone, wxThumb, wxNickname)
        if (loginRes.data.is_register) {
          // 需要传 spreadCode 才能登录
          this.setData({
            needSpreadCode: loginRes.data.is_register ? true : false,
            mobileAuth: true,
            phone: res.data.phone,
            isGetting: false
          })
        } else if (loginRes.data.mytoken) {
          // 可以直接登录，直接存储 token 进行登录
          wx.setStorageSync('token', loginRes.data.mytoken.token)
          app.toastSuccess('登录成功')
          app.globalData.isLogin = true
          this.setData({ isGetting: false })
          setTimeout(() => {
            wx.switchTab({
              url: '/pages/index/index',
              success: function () {
                const page = getCurrentPages().pop()
                page.onLoad()
              },
              fail: function (err) {
                console.log(err)
              }
            })
          }, 400)
        }
      } else {
        app.toastFail('拒绝绑定手机，可能影响小程序正常使用')
        this.setData({ isGetting: false })
      }
    } catch (err) {
      this.setData({ isGetting: false })
    }
  },
  // 处理注册/登录
  handleRegist() {
    if (!this.data.spread_code) return app.toastFail('请输入邀请码')
    this.setData({
      isPushing: true
    })
    const openid = wx.getStorageSync('openid')
    const { wxNickname, wxThumb } = app.globalData
    request
      .login(openid, this.data.phone, wxThumb, wxNickname, this.data.spread_code)
      .then((res) => {
        const { mytoken } = res.data
        if (mytoken.token) {
          wx.setStorageSync('token', mytoken.token)
          app.toastSuccess('登录成功')
          setTimeout(() => {
            wx.switchTab({
              url: '/pages/index/index',
              success: function () {
                const page = getCurrentPages().pop()
                page.onLoad()
              },
              fail: function (err) {
                console.log(err)
              }
            })
          }, 400)
        }
        this.setData({
          isPushing: false
        })
      })
      .catch((err) => {
        this.setData({
          isPushing: false
        })
      })
    // const { openid, phone, nickname, thumb, spread_code } = this.data
    // if (!this.data.spread_code) return app.toastFail('请输入邀请码')
    // request
    //   .registNewMember(openid, phone, nickname, thumb, spread_code)
    //   .then((res) => {
    //     const { code, token, msg } = res.data.mytoken
    //     if (code === 4) {
    //       wx.setStorageSync('token', token.token)
    //       setTimeout(() => {
    //         wx.switchTab({
    //           url: '/pages/index/index',
    //           success: function () {
    //             const page = getCurrentPages().pop()
    //             if (page == undefined || page == null) return
    //             page.onLoad()
    //           }
    //         })
    //       }, 300)
    //     } else if (code === 3) {
    //       wx.showToast({
    //         title: msg,
    //         icon: 'none',
    //         duration: 1000
    //       })
    //     }
    //   })
    //   .catch((err) => {})
  },
  onChange(e) {
    app.setData(e, this)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.setData({
    //   nickname: app.globalData.wxNickname || '',
    //   thumb: app.globalData.wxThumb || '',
    //   hasUserInfo: true || false
    // })
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
