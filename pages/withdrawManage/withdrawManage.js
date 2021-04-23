// pages/withdrawManage/withdrawManage.js
const app = getApp()

Page({
    /**
     * 页面的初始数据
     */
    data: {
        capsuleToTop: app.globalData.capsuleToTop,
        navOpacity: 0,
        activeTab: "ALI",
        titleColor: '#fff',
        account_AMT: "",
        account_ALI: '',
        bank: "",
        name_ALI: "",
        name_ANT: "",
        loading: false,
    },
    onPageScroll: function (e) {
        let a = e.scrollTop / 60
        if (a <= 0) {
            this.setData({
                titleColor: '#fff'
            })
        }
        if (a >= 1) {
            a = 1
            this.setData({
                titleColor: '#000'
            })
        }
        this.setData({
            navOpacity: a
        })
    },
    onChange() {

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {},

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