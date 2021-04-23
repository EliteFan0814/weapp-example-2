const app = getApp()
import request from '../../api/class'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 是否隐藏滚动条
    hideScrollBar: {
      type: Boolean,
      value: false
    },
    // 页面其他元素占据高度
    residueHeight: {
      type: Number,
      value: 0
    },
    classList: {
      type: Array,
      value: []
    },
    // 高亮的项
    propActiveItemIndex: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    activeItemIndex: 0, // 高亮的 item 角标
    activeClassId: undefined,
    headerHeight: 0,
    page: 1,
    totalPage: 0,
    classItemList: [],
    triggered: false
  },

  observers: {
    propActiveItemIndex(value) {
      this.setData({
        activeItemIndex: value,
        activeClassId: this.data.classList[value] ? this.data.classList[value].cate_id : ''
      })

      this.firstGetList()
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 处理左侧列表点击事件
    handleClick(e) {
      const { index, id } = e.currentTarget.dataset
      this.setData({
        activeItemIndex: index,
        activeClassId: id
      })
      app.globalData.selectedClassIndex = index
      this.firstGetList(false)
    },
    // 处理右侧点击
    openGoodDetail(e) {
      const { id } = e.currentTarget.dataset
      wx.navigateTo({ url: '/pages/goodDetail/goodDetail?type=normal&id=' + id })
    },
    // 首次获取列表内容
    firstGetList(freshFlag) {
      this.setData({
        triggered: freshFlag || false
      })
      request
        .getClassItemList(this.data.page, 10, this.data.activeClassId)
        .then((res) => {
          this.data.totalPage = res.data.page_total
          this.setData({
            classItemList: res.data.list,
            triggered: false
          })
        })
        .catch((err) => {
          this.setData({
            triggered: false
          })
        })
    },
    // 下拉获取新页面数据
    scrollLowerGetList(e) {
      if (this.data.page < this.data.totalPage) {
        this.data.page += 1
        request.getClassItemList(this.data.page, 10, this.data.activeClassId).then((res) => {
          this.data.totalPage = res.data.page_total
          let tempCommon = this.data.classItemList
          const resList = res.data.list
          tempCommon.push(...resList)
          this.setData({
            classItemList: tempCommon
          })
        })
      }
    },
    // 下拉刷新
    onRefresh() {
      this.firstGetList(true)
    }
  }
})
