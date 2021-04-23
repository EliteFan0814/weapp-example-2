// baseComponents/base-class-swiper/base-class-swiper.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 类别表
    classArr: {
      type: Array,
      value: [] //[{ className: '示例', classImg: 'https://dummyimage.com/80x80/000/fff' }]
    },
    // 每页分类个数
    pageNum: {
      type: Number,
      value: 10
    },
    //每页行数
    pageRows: {
      type: Number,
      value: 2
    },
    // 自动切换时间间隔
    interval: {
      type: Number,
      value: 5000
    },
    // 滑动动画时长
    duration: {
      type: Number,
      value: 500
    }
  },
  data: {
    classList: [], // 分页好的类名列表
    showDots: true, //是否显示自定义 dots
    swiperHeight: 0, // 分页高度
    currentPage: 0, // 当前页
    itemWidth: 20 // 默认每项宽度
  },
  // 数据监听器
  observers: {
    // 监听传入的classArr，并将其分页
    classArr(classArr) {
      this.setData({
        classList: this.sliceArray(classArr, this.data.pageNum)
      })
      if (classArr.length) {
        // 创建 wxml 查询对象 获取高度
        let query = this.createSelectorQuery()
        query
          .select('.class-list')
          .boundingClientRect((res) => {
            this.setData({
              swiperHeight: res.height
            })
          })
          .exec()
      }
    },
    // 监听传入的个数和行数计算出单个 item 占据宽度
    'pageNum,pageRows'(pageNum, pageRows) {
      const itemWidth = (100 / (pageNum / pageRows)).toFixed(2)
      this.setData({
        itemWidth: itemWidth
      })
    }
  },
  // 组件生命周期
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    }
  },
  methods: {
    // 打开对应分类页面
    openClassPage(e) {
      const { index, pageindex } = app.tapData(e)
      //  以下为打开对应分类页面的 todo 内容
      app.globalData.selectedClassIndex = index + pageindex * 4
      wx.switchTab({
        url: '/pages/class/class',
        success: function (e) {
          var page = getCurrentPages().pop()
          if (page == undefined || page == null) return
          page.onLoad()
        }
      })
    },
    // 分类页滑动事件
    changeSwiper(e) {
      this.setData({
        currentPage: e.detail.current
      })
    },
    //分类表分页处理 targetArray：目标数组 number：每页个数
    sliceArray(targetArray, number) {
      const page = Math.ceil(targetArray.length / number)
      const returnArr = []
      for (let i = 0; i < page; i++) {
        returnArr[i] = targetArray.slice(i * number, (i + 1) * number)
      }
      return returnArr
    }
  }
})
