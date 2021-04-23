// pages/orderDetails/orderDetails.js
import personalRequest from '../../api/personal'
import request from '../../api/order'
import wxPosition from '../../utils/authPosition'

import pay from '../../utils/pay'
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    userType: undefined,
    info: {},
    orderList: [],
    orderLog: [],
    phone: '',
    refundDialog: false,
    remark: '',
    selfGetInfo: undefined,
    isGetPositionAuth: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    this.setData({
      id: options.id,
      userType: options.userType
    })
    this.getInfo()
  },

  getInfo() {
    request.orderDetails(this.data.userType, this.data.id).then((res) => {
      this.setData({
        info: res.data.info,
        orderList: res.data.order_item,
        orderLog: res.data.order_log
      })
    })
  },

  makePhone() {
    wx.makePhoneCall({
      phoneNumber: this.data.phone
    })
  },
  pay(e) {
    let { id } = e.currentTarget.dataset
    this.setData({ isPushing: true })
    orderRequest.getOrder(JSON.stringify(id)).then((res) => {
      const payInfo = res.value.prepayObj
      pay
        .wxPay(payInfo)
        .then((res) => {
          app.toastSuccess('支付成功！')
          this.setData({
            isPushing: false
          })
        })
        .catch((err) => {
          app.toastFail('支付失败！')
          this.setData({
            isPushing: false
          })
        })
        .catch((err) => {
          app.toastFail('支付失败！')
          this.setData({
            isPushing: false
          })
        })
    })
  },
  // 取消订单
  async cancelOrder(e) {
    let { id } = e.currentTarget.dataset
    const res = await app.showModal('提示', '确定取消订单吗？')
    if (res) {
      request.cancalOrder(this.data.userType, id).then((res) => {
        app.toastSuccess('取消订单成功')
        this.getInfo()
        this.refreshPrePage()
      })
    }
  },
  // 确认收货
  async confirmOrder(e) {
    let { id } = e.currentTarget.dataset
    const res = await app.showModal('提示', '是否确认收货？')
    if (res) {
      request.confirm(this.data.userType, id).then((res) => {
        app.toastSuccess('收货成功')
        this.getInfo()
        this.refreshPrePage()
      })
    }
  },
  // 刷新上个界面数据
  refreshPrePage() {
    const pages = getCurrentPages()
    const beforePage = pages[pages.length - 2]
    // 对上个页面数据进行操作
    beforePage.getData()
  },
  // 申请退款
  refund(e) {
    let { id } = e.currentTarget.dataset
    this.setData({
      id,
      refundDialog: true
    })
  },
  inputChange(e) {
    app.setData(e, this)
  },
  refundCancel() {
    this.setData({
      refundDialog: false,
      remark: ''
    })
  },

  submit() {
    const { remark, id } = this.data
    if (!remark) {
      return app.toastFail('请输入退款原因')
    } else {
      orderRequest.refund({ remark, orderId: id }).then((res) => {
        if (res.success) {
          app.toastSuccess('申请成功')
          this.setData({ refundDialog: false })
          setTimeout(() => {
            wx.navigateBack()
          }, 1000)
        }
      })
    }
  }
})
