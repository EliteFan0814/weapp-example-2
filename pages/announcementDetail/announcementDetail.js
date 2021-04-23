// pages/personal/personal.js
const app = getApp()
import request from '../../api/personal'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    capsuleToTop: app.globalData.capsuleToTop,
    id: undefined,
    title: undefined,
    noticeDetail: undefined,
    createTime: undefined
  },
  /**
   * 生命周期函数--监听页面加载
   */
  getNoticeDetail() {
    request.noticeInfo(this.data.id).then((res) => {
      let { title, content, create_time } = res.data.info
      content = content ? content.replace(/\<img/gi, '<img class="rich-img" ') : ''
      this.setData({
        title: title,
        noticeDetail: content,
        createTime: create_time
      })
    })
  },
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    this.getNoticeDetail()
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
