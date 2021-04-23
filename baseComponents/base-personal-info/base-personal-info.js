// baseComponents/base-personal-info/base-personal-info.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    userInfo: {
      type: Object,
      value: {}
    },
    isLogin: {
      type: Boolean,
      value: false
    },
    showRight: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    handleSetting(e) {
      this.triggerEvent('handleTap')
    },
    handleLogin() {
      this.triggerEvent('handleLogin')
    }
  }
})
