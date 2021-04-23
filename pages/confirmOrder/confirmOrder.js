import request from '../../api/order'
import personalRequest from '../../api/personal'
// import pay from '../../utils/pay'
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userType: '',
    integral: 0,
    latitude: undefined,
    longitude: undefined,
    radio: 'WX',
    cartIdList: [],
    cartInfoList: [],
    address: {},
    addressId: undefined,
    addressStatus: false,
    activeId: undefined,
    getWay: 'autoGet',
    selfGetInfo: undefined,
    isGetPositionAuth: false,
    mainActiveIndex: 0,
    timeSelectList: [
      {
        text: '今天',
        children: [
          { text: '15:00', id: 1 },
          { text: '16:00', id: 2 },
          { text: '17:00', id: 3 }
        ]
      },
      {
        text: '明天',
        children: [
          { text: '15:00', id: 1 },
          { text: '16:00', id: 2 },
          { text: '17:00', id: 3 }
        ]
      }
    ],
    total: 0,
    isPushing: false,
    buyNowProd: {},
    buyNowSpec: {},
    buyNowNum: 0,
    goodId: undefined,
    confirmInfo: {},
    goodInfo: {},
    orderfee: 0,
    number: 0,
    balance: 0,
    haveDefault: undefined,
    defaultAddress: {}
  },
  // 获取个人信息
  async getUserInfoAsync() {
    try {
      const {
        data: { info: info }
      } = await personalRequest.getUserInfo()
      this.setData({
        balance: info.amount,
        userType: info.type
      })
    } catch (err) {}
  },
  // 获取购物车信息
  getCartInfo() {
    request.getCartInfo(this.data.cartIdList).then((res) => {
      this.setData({
        cartInfoList: res.value
      })
      this.computeTotal()
    })
  },
  // 立即购买 获取商品信息
  getConfirmInfo() {
    if (this.data.type === 'buyNow') {
      request.getConfirmNowInfo(this.data.userType, this.data.goodId, this.data.number).then((res) => {
        const tempRes = res.data.list[0]
        this.setData({
          confirmInfo: tempRes,
          goodInfo: tempRes.spec_info,
          orderfee: res.data.order_fee,
          address: res.data.address || '',
          addressId: res.data.address ? res.data.address.id : ''
        })
      })
    } else if (this.data.type === 'cart') {
      request
        .getConfirmCartInfo(this.data.userType)
        .then((res) => {
          this.setData({
            cartInfoList: res.data.list,
            orderfee: res.data.order_fee,
            address: res.data.address || '',
            addressId: res.data.address ? res.data.address.id : ''
          })
        })
        .catch((err) => {})
    }
  },
  // 计算总金额
  computeTotal() {
    let total = 0
    if (this.data.type === 'cart') {
      this.data.cartInfoList.map((item) => {
        total = total + item.totalPrice
      })
    } else if (this.data.type === 'buyNow') {
      total = this.data.buyNowSpec.specialPrice * this.data.buyNowNum
    } else if (this.data.type === 'exchange') {
      total = this.data.buyNowProd.integral * this.data.buyNowNum
    }
    this.setData({
      total: total.toFixed(2)
    })
  },
  // 获取默认地址
  getDefaultAddress() {
    request.getDefaultAddress().then((res) => {
      if (res.value.status) {
        this.setData({
          address: res.value,
          addressId: res.value.id,
          addressStatus: res.value.status
        })
      }
    })
  },
  // 打开选择地址
  openAddress() {
    let type = 'select'
    if (this.data.type === 'exchange') {
      type = 'exchangeSelect'
    }
    wx.navigateTo({
      url: `/pages/addressList/addressList?type=${type}`
    })
  },
  // 确认订单
  confirmOrder() {
    const { goodId, number, addressId, userType } = this.data
    if (!addressId) return app.toastFail('请选择收货地址')
    if (this.data.balance < this.data.orderfee) return app.toastFail('余额不足')
    this.setData({
      isPushing: true
    })
    if (this.data.type === 'buyNow') {
      // 立即购买
      request
        .buyNow(goodId, number, addressId, userType)
        .then((res) => {
          app.toastSuccess('购买成功')
          setTimeout(() => {
            wx.redirectTo({ url: `/pages/order/order?userType=${userType}&status=unuse` })
            this.setData({
              isPushing: false
            })
          }, 300)
        })
        .catch((err) => {
          this.setData({
            isPushing: false
          })
        })
    } else if (this.data.type === 'cart') {
      // 购物车购买
      request
        .buyCart(userType, addressId)
        .then((res) => {
          app.toastSuccess('购买成功')
          setTimeout(() => {
            wx.redirectTo({ url: `/pages/order/order?status=unuse&userType=${userType}` })
            this.setData({
              isPushing: false
            })
          }, 300)
        })
        .catch((err) => {
          this.setData({
            isPushing: false
          })
        })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    await this.getUserInfoAsync()
    this.setData({
      goodId: options.id,
      number: options.num,
      type: options.type
    })
    this.getConfirmInfo()
  }
})
