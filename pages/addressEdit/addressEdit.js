import request from '../../api/address'
// import wxPosition from '../../utils/authPosition'
import areaList from '../../utils/areaList'

const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    autosize: {
      maxHeight: 100
    },
    showDialog: false,
    areaList: areaList,
    isGetPositionAuth: false,
    title: '',
    type: '',
    info: {
      linkman: '',
      contact: '',
      adcode: '',
      address: '',
      address_detail: ''
    },
    rules: [
      { name: 'linkman', message: '请输入联系人' },
      { name: 'contact', message: '请输入联系电话' },
      { name: 'address', message: '请选择地区' },
      { name: 'address_detail', message: '请输入详细地址' }
    ]
  },
  //
  inputChange(e) {
    app.setData(e, this)
  },
  // 打开选址
  openMap(e) {
    this.setData({
      showDialog: !this.data.showDialog
    })
  },
  // 关闭弹框
  closeDialog() {
    this.setData({
      showDialog: false
    })
  },
  // 确认选择地址
  confirmAddress(e) {
    let area = ''
    e.detail.values.map((item) => {
      area += item.name + ' '
    })
    this.setData({
      ['info.adcode']: e.detail.values[e.detail.values.length - 1].code,
      ['info.address']: area,
      showDialog: false
    })
  },
  // 确认提交
  confirm() {
    const res = this.validate(this.data.rules)
    if (res) {
      if (this.data.type === 'edit') {
        request
          .edit(this.data.info)
          .then((res) => {
            app.toastSuccess('修改成功')
            this.changeParentData()
          })
          .catch((err) => {})
      } else {
        request
          .add(this.data.info)
          .then((res) => {
            app.toastSuccess('添加成功')
            this.changeParentData()
          })
          .catch((err) => {})
      }
    }
  },
  // 修改上一页面数据 返回上一页
  changeParentData() {
    const pages = getCurrentPages()
    if (pages.length > 1) {
      const beforePage = pages[pages.length - 2]
      beforePage.changeData()
      setTimeout(() => {
        wx.navigateBack({
          delta: 1
        })
      }, 300)
    }
  },
  // 验证
  validate(rules) {
    for (let i = 0; i < rules.length; i++) {
      if (!this.data.info[rules[i].name]) {
        app.toastFail(rules[i].message)
        return false
      }
    }
    return true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (o) {
    if (o.type === 'edit') {
      const tempInfo = JSON.parse(o.info)
      this.setData({
        info: tempInfo
      })
    }
    this.setData({
      title: o.title,
      type: o.type
    })
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
