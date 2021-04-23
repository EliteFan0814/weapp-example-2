//获取应用实例
const app = getApp()
import personalRequest from '../../api/personal'
import request from '../../api/cart'
import Dialog from '@vant/weapp/dialog/dialog'
import userAuth from '../../utils/userAuth' // 登录获取token

Page({
  data: {
    code: 1,
    msg: 'ok',
    myCart: {},
    userType: undefined,
    isLogin: app.globalData.isLogin
  },
  // 获取个人信息
  async getUserInfoAsync() {
    try {
      const res = await personalRequest.getUserInfo()
      const { info, param } = res.data
      this.setData({
        userType: info.type
      })
    } catch (err) {}
  },
  onLoad: async function () {
    this.setData({
      isLogin: app.globalData.isLogin
    })
    await this.checkTokenAuth()
  },
  onShow() {
    this.setData({
      isLogin: app.globalData.isLogin
    })
    if (this.data.isLogin) {
      this.getData()
    }
  },
  onHide: function () {
    clearInterval(app.timer)
  },
  async checkTokenAuth() {
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
  },
  getData() {
    request.getCartList().then((res) => {
      let flag = false
      res.data.myCart.list.map((item) => {
        if (item.is_sel) {
          flag = true
        }
      })
      Object.assign(res.data.myCart, { is_other_sel: flag })
      if (res.data.myCart.list.length < 1) {
        res.data.myCart.is_all_sel = 0
      }
      this.setData({
        myCart: res.data.myCart
      })
    })
  },
  handleCartNum(e) {
    const { id } = app.tapData(e)
    request
      .cartAdd(id, e.detail)
      .then((res) => {
        if (res.code == 1) {
          this.getData()
        } else {
          app.toastFail(res.msg)
        }
      })
      .catch((err) => {})
  },
  // 添加数量
  onPlus(e) {
    let spec_id = e.currentTarget.dataset.id
    this.selNum(spec_id, 1)
  },
  // 减少数量
  onMinus(e) {
    let spec_id = e.currentTarget.dataset.id
    this.selNum(spec_id, -1)
  },
  selNum(spec_id, num) {
    clickNum({
      spec_id,
      num
    }).then((res) => {
      if (res.code == 1) {
        this.getData()
      } else {
        app.toastFail(res.msg)
      }
    })
  },

  // 单选商品
  onChage(e) {
    let spec_id = e.currentTarget.dataset.id
    let type = e.currentTarget.dataset.type
    let newdata = !!type ? 0 : 1
    request.cartSingleSelect(spec_id).then((res) => {
      if (res.code == 1) {
        this.getData()
      } else {
        app.toastFail(res.msg)
      }
    })
  },

  // 删除商品
  delGoods(e) {
    Dialog.confirm({
      title: '删除',
      message: '是否要删除改商品'
    })
      .then(() => {
        let spec_id = e.currentTarget.dataset.id
        request.cartDeleteByOne(spec_id).then((res) => {
          if (res.code == 1) {
            app.toastSuccess('删除成功')
            // info().then((res) => {
            //   wx.setStorageSync('cartNum', res.data.info.cart_num)
            // })
            this.getData()
          } else {
            app.toastFail(res.msg)
          }
        })
      })
      .catch(() => {})
  },

  // 全选商品
  selAll() {
    let newdata = !!this.data.myCart.is_all_sel ? 0 : 1
    request.cartAllSelect(newdata).then((res) => {
      if (res.code == 1) {
        this.getData()
      } else {
        app.toastFail(res.msg)
      }
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
  confirmCartOrder() {
    wx.navigateTo({
      url: `/pages/confirmOrder/confirmOrder?type=cart`
    })
  }
})
