// baseComponents/base-swiper/base-swiper.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //
    swiperHeight: {
      type: Number,
      value: 270
    },
    // 是否显示面板默认指示点
    indicatorDots: {
      type: Boolean,
      value: true
    },
    // 是否自动播放
    autoplay: {
      type: Boolean,
      value: true
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
    },
    //
    swiperList: {
      type: Array,
      value: []
    }
  },
  externalClasses: ['dots-style'],
  /**
   * 组件的初始数据
   */
  data: {
    showDots: true,
    currentPage: 0 // 当前页
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleTap(e) {
      this.triggerEvent('tapItem', e.currentTarget.dataset.id)
    },
    changeSwiper(e) {
      this.setData({
        currentPage: e.detail.current
      })
    }
  }
})
