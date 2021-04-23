import request from '../../api/good'
import index from '../../api/index'
import personal from '../../api/personal'

const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 500,
    swiperList: 5,
    showDialog: false,
    id: undefined,
    swiperList: [],
    timeData: {},
    goodInfo: {},
    goodSpec: [],
    selectedId: undefined,
    selectedNumber: 1,
    selectedSpec: {},
    activeTab: 'detail',
    goodContent: '',
    buyRecord: [],
    infoAuth: false,
    mobileAuth: false
  },
  //
  handleChangeTab(e) {},
  getGoodInfo() {
    request.getGoodInfo(this.data.id).then((res) => {
      const temp = res.data.info.content ? res.data.info.content.replace(/\<img/gi, '<img class="rich-img" ') : ''
      this.setData({
        goodInfo: res.data.info,
        goodContent: temp,
        swiperList: res.data.pic_arr,
        goodSpec: res.data.spec_arr,
        selectedSpec: res.data.spec_arr[0],
        selectedId: res.data.spec_arr[0].spec_id
      })
    })
  },
  // 购物数量
  handleBuyNum(e) {
    this.setData({
      selectedNumber: e.detail
    })
  },
  // 加入购物车
  handleCart(e) {
    const { info, num } = app.tapData(e)
    request
      .addToCart(info.spec_id, num)
      .then((res) => {
        app.toastSuccess('添加成功！')
        this.setData({
          showDialog: false
        })
      })
      .catch((err) => {})
  },
  // 立即购买
  handleBuy(e) {
    const { prod, spec, num } = app.tapData(e)
    wx.navigateTo({
      url: `/pages/confirmOrder/confirmOrder?type=buyNow&id=${spec.spec_id}&num=${num}`
    })
  },
  //选择规格
  handleSelect(e) {
    const { info } = app.tapData(e)
    this.setData({
      selectedId: info.spec_id,
      selectedSpec: info
    })
  },
  // 打开购物车
  openCart() {
    wx.switchTab({
      url: '/pages/cart/cart'
    })
  },
  // 打开首页
  openIndex() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  handleClose() {
    this.setData({
      showDialog: !this.data.showDialog
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ id: options.id })
    this.getGoodInfo()
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
  onShareAppMessage: function (res) {
    // const inviteCode = app.globalData.userInfo ? app.globalData.userInfo.inviteCode : ''
    // return {
    //   title: this.data.goodInfo.title,
    //   path: `/pages/goodDetail/goodDetail?id=${this.data.id}&inviteCode=${inviteCode}`
    // }
  }
})
