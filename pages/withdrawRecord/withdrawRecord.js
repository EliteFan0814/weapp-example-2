import request from '../../api/personal'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    recordList: [],
    page: 1,
    pageSize: 10
  },
  getRecordList(type) {
    request.getWithdrawRecord(this.data.page, this.data.pageSize).then((res) => {
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
  // 触底加载
  onReachBottom() {
    if (this.data.page < this.data.totalPage) {
      this.data.page += 1
      this.getWithdrawRecord('down')
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {}
})
