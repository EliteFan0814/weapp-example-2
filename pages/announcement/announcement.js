// pages/personal/personal.js
const app = getApp()
import request from '../../api/personal'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    capsuleToTop: app.globalData.capsuleToTop,
    // navOpacity: 0,
    // titleColor: '#fff',
    page: 1,
    pageSize: 10,
    totalPage: 0,
    articleList: []
  },
  //   onPageScroll: function (e) {
  //     let a = e.scrollTop / 60
  //     if (a <= 0) {
  //       this.setData({
  //         titleColor: '#fff'
  //       })
  //     }
  //     if (a >= 1) {
  //       a = 1
  //       this.setData({
  //         titleColor: '#000'
  //       })
  //     }
  //     this.setData({
  //       navOpacity: a
  //     })
  //   },
  getNoticeList(type) {
    request.noticeList(this.data.page, this.data.pageSize).then((res) => {
      this.data.totalPage = res.data.page_total
      let tempCommon = this.data.articleList
      const resList = res.data.list
      if (type === 'down') {
        tempCommon.push(...resList)
        this.setData({
          articleList: tempCommon
        })
      } else {
        this.setData({
          articleList: resList
        })
      }
    })
  },
  // 触底加载
  onReachBottom() {
    if (this.data.page < this.data.totalPage) {
      this.data.page += 1
      this.getNoticeList('down')
    }
  },
  // 文章内页
  openDetail(e) {
    const { id } = app.tapData(e)
    wx.navigateTo({
      url: `/pages/announcementDetail/announcementDetail?id=${id}`
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getNoticeList()
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
