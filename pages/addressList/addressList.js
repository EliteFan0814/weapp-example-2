import request from '../../api/address'
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    addressList: [],
    defaultId: undefined,
    type: undefined
  },
  getAddressList() {
    request.getAddressList().then((res) => {
      res.data.list.map((item) => {
        if (item.is_default) {
          this.setData({
            defaultId: item.id
          })
        }
      })
      this.setData({
        addressList: res.data.list
      })
    })
  },
  // 新增/修改地址
  changeAddress(e) {
    const { type, info } = app.tapData(e)
    const infoStr = JSON.stringify(info)
    let url = ''
    if (type === 'add') {
      url = `/pages/addressEdit/addressEdit?title=${'新增地址'}&type=${'add'}`
    } else {
      url = `/pages/addressEdit/addressEdit?title=${'修改地址'}&type=${'edit'}&info=${infoStr}`
    }
    wx.navigateTo({ url })
  },
  // 修改默认地址
  setDefault(e) {
    request
      .setDefault(e.detail)
      .then((res) => {
        this.setData({ defaultId: e.detail })
        app.toastSuccess('设置成功！')
      })
      .catch((err) => {
        app.toastFail('设置默认地址失败！')
      })
  },
  // 删除地址
  async deleteAddress(e) {
    const res = await app.showModal('删除', '确认删除该地址？')
    const { id } = app.tapData(e)
    if (res) {
      request
        .delete(id)
        .then((res) => {
          app.toastSuccess('删除成功！')
          this.getAddressList()
        })
        .catch((err) => {
          app.toastFail('删除失败！')
        })
    }
  },
  changeData() {
    this.getAddressList()
  },
  // 选择地址
  selectAddress(e) {
    if (this.data.type) {
      const { info } = app.tapData(e)
      const pages = getCurrentPages()
      const beforePage = pages[pages.length - 2]
      if (beforePage) {
        beforePage.setData({
          address: info,
          addressId: info.id
        })
        wx.navigateBack({
          delta: 1
        })
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      type: options.type || ''
    })
    this.getAddressList()
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
