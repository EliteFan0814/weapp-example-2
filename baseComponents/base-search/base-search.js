// baseComponents/base-btn/base-btn.js
Component({
  properties: {
    showImg: {
      type: Boolean,
      value: true
    },
    title:{
      type:String,
      value:'请输入关键字'
    }
  },
  // 向外暴露css class 类，方便父组件接管自定义组件样式
  externalClasses: ['search-style'],
  data: {},
  methods: {
    handleTap() {
      this.triggerEvent('handleTap')
    }
  }
})
