// app.js
App({
  onLaunch() {
    // 登录
    // wx.login({
    //   success: (res) => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //   }
    // })
  },
  globalData: {
    isLogin: false,
    userInfo: null,
    classList: undefined,
    wxNickname: undefined, // 获取的微信昵称
    wxThumb: undefined, // 获取的微信头像
    hasWxUserInfo: false, // 是否授权微信昵称头像
    selectedClassIndex: 0,
    capsuleToTop: wx.getSystemInfoSync()['statusBarHeight'] + 6 // 手机状态栏高度
  },
  // input双向绑定
  setData(e, _this) {
    const name = e.currentTarget.dataset.name
    _this.setData({
      // e.detail.value为小程序原生 input 返回值 e.detail 为 vant 返回值
      [name]: typeof e.detail.value == 'undefined' ? e.detail : e.detail.value
    })
  },
  // 获取tap点击后传入的数据
  tapData(e) {
    return e.currentTarget.dataset
  },
  //失败提示
  toastFail(e) {
    wx.showToast({
      title: e,
      icon: 'none'
    })
  },
  //成功提示
  toastSuccess(e) {
    wx.showToast({
      title: e
    })
  },
  // 交互弹框
  showModal(title, content) {
    return new Promise((reslove, reject) => {
      wx.showModal({
        title,
        content,
        success(res) {
          if (res.confirm) {
            reslove(true)
          } else if (res.cancel) {
            reslove(false)
          }
        }
      })
    })
  },
  //封装 wx.navigateTo 打开页面
  navigateTo(url, queryStringObj) {
    let queryStr = ''
    Object.keys(queryStringObj).map((item, index, arr) => {
      queryStr = queryStr + item + '=' + queryStringObj[item]
      if (index < arr.length - 1) {
        queryStr = queryStr + '&'
      }
    })
    wx.navigateTo({
      url: `${url}?${queryStr}`
    })
  }
})
