// baseComponents/base-header.js
const app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 是否使用导航头高度
    useHeight: {
      type: Boolean,
      value: true
    },
    title: {
      type: String,
      value: '标题'
    },
    titleColor: {
      type: String,
      value: '#000'
    },
    navOpacity: {
      type: Number,
      value: 1
    },
    showLeft: {
      type: Boolean,
      value: true
    },
    iconColor: {
      type: String,
      value: '#000'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    capsuleToTop: app.globalData.capsuleToTop,
    navOpacity: 0,
    canBack: true,
    headerHeight: 38 + app.globalData.capsuleToTop
  },
  // 组件生命周期
  lifetimes: {
    created: function () {},
    attached: function () {
      // 在组件实例进入页面节点树时执行
      this.getPages()
      this.setHeaderHeight()
    },
    ready: function () {
      // this.setHeaderHeight()
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    }
  },
  // 组件所在页面生命周期
  pageLifetimes: {
    show: function () {
      // 页面被展示
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    handleBack() {
      if (this.data.showLeft) {
        if (this.data.canBack) {
          wx.navigateBack({
            delta: 1
          })
        } else {
          wx.switchTab({ url: '/pages/index/index' })
        }
      }
    },
    getPages() {
      const pages = getCurrentPages()
      if (pages.length <= 1) {
        this.setData({
          canBack: false
        })
      } else {
        this.setData({
          canBack: true
        })
      }
    },
    // 设置导航头的占位高度
    setHeaderHeight() {
      if (this.data.useHeight) {
        // 创建 wxml 查询对象 获取高度
        let query = this.createSelectorQuery()
        query
          .select('.header')
          .boundingClientRect((res) => {
            this.setData({
              headerHeight: res.height
            })
          })
          .exec()
      } else {
        this.setData({
          headerHeight: 0
        })
      }
    }
  }
})
