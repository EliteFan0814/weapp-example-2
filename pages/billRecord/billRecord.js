import request from '../../api/personal'
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabList: [
      { label: '余额账单', value: 'amount' },
      { label: '佣金账单', value: 'reward' }
    ],
    recordList: [],
    page: 1,
    totalPage: 0,
    active: 'amount',
    userType: undefined
  },
  getRecordList(type) {
    const { page, active } = this.data
    request.billList(page, 10, active).then((res) => {
      this.data.totalPage = res.data.page_total
      let tempCommon = this.data.recordList
      const resList = res.data.list
      if (type === 'down') {
        tempCommon.push(...resList)
        this.setData({
          recordList: tempCommon
        })
      } else {
        this.setData({
          recordList: resList
        })
      }
    })
  },
  onReachBottom() {
    if (this.data.page < this.data.totalPage) {
      this.data.page += 1
      this.getRecordList('down')
    }
  },
  // 处理点击 tab
  handleChangeTab(e) {
    this.setData({
      active: e.detail.name,
      page: 1,
      totalPage: 0,
      recordList: []
    })
    this.getRecordList()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ userType: options.userType })
    this.getRecordList()
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
