// pages/myTeam/myTeam.js
import request from '../../api/personal'
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    totalPage: 1,
    teamList: [],
    account: {},
    capsuleToTop: app.globalData.capsuleToTop
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData()
    this.getInfo()
  },

  onShow() {
    // this.getInfo()
  },
  getInfo() {
    //获取个人信息
    request.getUserInfo().then((res) => {
      if (res.success) {
        this.setData({
          account: res.value.account
        })
      }
    })
  },
  getData(type) {
    const { page, teamList } = this.data
    request.teamList(page, 10).then((res) => {
      this.data.totalPage = res.data.page_total
      const resList = res.data.list
      let tempCommon = teamList
      if (type === 'down') {
        tempCommon.push(...resList)
        this.setData({
          teamList: tempCommon
        })
      } else {
        this.setData({
          teamList: resList
        })
      }
    })
  },

  onReachBottom() {
    if (this.data.page < this.data.totalPage) {
      this.data.page += 1
      this.getData('down')
    }
  }
})
