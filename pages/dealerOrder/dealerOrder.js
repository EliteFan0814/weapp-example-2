// pages/order/order.js
// import personalRequest from '../../api/personal'
import request from '../../api/order'
import pay from '../../utils/pay'
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    capsuleToTop: app.globalData.capsuleToTop,
    tabList: [],
    page: 1,
    totalPage: 1,
    orderId: '',
    list: [],
    userType: 'dealer',
    status: 'all',
    active: '0',
    selectedId: undefined,
    expressNum: undefined,
    idDelivering: false,
    remark: '',
    deliverDialog: false,
    scrollTop: 0,
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      status: options.status || 'all'
    })
    this.getData()
  },
  onShow() {},
  getData(type) {
    const { page, status } = this.data
    request.getOrderListDealer(page, 10, status).then((res) => {
      const { list, screens, page_total } = res.data
      this.data.totalPage = page_total
      this.setData({
        tabList: screens
      })
      let tempCommon = this.data.list
      const resList = list
      if (type === 'down') {
        tempCommon.push(...resList)
        this.setData({
          list: tempCommon
        })
      } else {
        this.setData({
          list: resList
        })
      }
    })
  },
  // 触底加载
  onReachBottom() {
    if (this.data.page < this.data.totalPage) {
      this.data.page += 1
      this.getData('down')
    }
  },
  onChange(e) {
    let { index, name } = e.detail
    this.setData({
      status: name,
      page: 1,
      list: []
    })
    this.getData()
  },
  openClick(e) {
    const { item, index } = e.currentTarget.dataset
    if (item.orderDetails.length == 0) return
    const { list } = this.properties
    list[index]['isOpen'] = !list[index]['isOpen']
    this.setData({
      list
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
  async cancelOrder(e) {
    let { id } = e.currentTarget.dataset
    const res = await app.showModal('提示', '确定取消订单吗？')
    if (res) {
      request.cancalOrder(id).then((res) => {
        app.toastSuccess('取消订单成功')
        this.getData()
      })
    }
  },
  // 确认收货
  async confirmOrder(e) {
    let { id } = e.currentTarget.dataset
    const res = await app.showModal('提示', '是否确认收货？')
    if (res) {
      request.confirm(id).then((res) => {
        app.toastSuccess('收货成功')
        self.getData()
      })
    }
  },
  // 填写快递单号
  openConfirmDialog(e) {
    const { id } = app.tapData(e)
    this.setData({
      expressNum: '',
      deliverDialog: true,
      selectedId: id
    })
  },
  confirmDeliver() {
    if (!this.data.expressNum) return app.toastFail('请输入快递单号')
    this.setData({
      idDelivering: true
    })
    request
      .deliverDealer(this.data.selectedId, this.data.expressNum)
      .then((res) => {
        this.setData({
          deliverDialog: false,
          idDelivering: false
        })
        setTimeout(() => {
          this.getData()
        }, 300)
      })
      .catch((err) => {
        this.setData({
          idDelivering: false
        })
      })
  },
  // 取消发货
  cancelDeliver() {
    this.setData({
      deliverDialog: false,
      selectedId: ''
    })
  },
  // 打开详情
  openOrderDetail(e) {
    wx.navigateTo({
      url: `/pages/dealerOrderDetails/dealerOrderDetails?userType=${this.data.userType}&id=${e.currentTarget.dataset.id}`
    })
  },
  getPhone() {
    personalRequest.getPhone().then((res) => {
      this.setData({
        phone: res.value.value
      })
    })
  },
  makePhone() {
    wx.makePhoneCall({
      phoneNumber: this.data.phone
    })
  },

  // 申请退款
  refund(e) {
    let { id } = e.currentTarget.dataset
    this.setData({
      orderId: id,
      deliverDialog: true
    })
  },
  inputChange(e) {
    app.setData(e, this)
  },
  refundCancel() {
    this.setData({
      deliverDialog: false,
      remark: ''
    })
  },

  submit() {
    const { remark, orderId } = this.data
    if (!remark) {
      return app.toastFail('请输入退款原因')
    } else {
      orderRequest.refund({ remark, orderId }).then((res) => {
        if (res.success) {
          app.toastSuccess('申请成功')
          this.setData({ deliverDialog: false })
          this.getData()
        }
      })
    }
  }
})
