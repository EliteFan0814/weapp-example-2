import { flyForToken } from './request'
import authConfig from './authConfig'

const app = getApp()
let token = wx.getStorageSync('token')
// 获取微信code
function getWxCode() {
  return new Promise((resolve, reject) => {
    wx.login({
      success(res) {
        if (res.code) {
          resolve(res.code)
        } else {
          console.log('获取微信code失败' + res.errMsg)
          reject()
        }
      }
    })
  })
}
// 用code 获取注册登录相关的 openid session_key
async function code4Info() {
  try {
    const code = await getWxCode()
    const temp = {}
    // 写入code
    temp[authConfig.codeName] = code
    // 如果需要推广，写入推广码
    if (authConfig.haveInvite) {
      temp[authConfig.inviteCodeName] = authConfig.inviteCode
    }
    const res = await flyForToken.post(authConfig.loginUrl, temp)
    const { data: response, code: stateCode } = res.data
    return response
  } catch (err) {}
}
// 用code换取token和其他信息
async function code2Token() {
  try {
    const code = await getWxCode()
    const temp = {}
    // 写入code
    temp[authConfig.codeName] = code
    // 如果需要推广，写入推广码
    if (authConfig.haveInvite) {
      temp[authConfig.inviteCodeName] = authConfig.inviteCode
    }
    const res = await flyForToken.post(authConfig.loginUrl, temp)
    // 拿到返回的有用信息
    console.log('res', res)
    const { data: response, code: stateCode } = res.data
    const page = getCurrentPages().pop()
    if (page == undefined || page == null) return
    //通过返回的code值转向不同状态
    if (stateCode === 1) {
      // 状态1 存储 openid session_key 用于注册
      wx.setStorageSync('openid', response.openid)
      wx.setStorageSync('session_key', response.session_key)
      const tokenRes = response.token.token
      return {
        token: tokenRes
      }
    } else if (stateCode === 0) {
      return false
    } else {
      throw '未知错误'
    }
  } catch (err) {
    console.log('用code换取token出错', err)
  }
}
// 判断是登录 还是 注册
async function setTokenSync() {
  try {
    token = wx.getStorageSync('token')
    if (!token) {
      // token 不存在，跳转登录
      const res = await code4Info()
      if (res) {
        wx.setStorageSync('openid', res.openid)
        wx.setStorageSync('session_key', res.session_key)
      }
      return false
      // const page = getCurrentPages().pop()
      // if (page == undefined || page == null) return
      // // 如果当前页面是 pages/regist/regist
      // if (page.route !== 'pages/regist/regist') {
      //   wx.redirectTo({ url: 'pages/regist/regist' })
      // }
    } else {
      return token
    }
  } catch (err) {
    console.log('没有token', err)
    app.globalData.isLogin = false
  }
}
// 只检查 token 是否存在
function onlyCheckToken() {
  return wx.getStorageSync('token') || false
}
// 删除token
function clearHaveToken() {
  wx.removeStorageSync('token')
  wx.removeStorageSync('openid')
  token = ''
}

export default {
  setTokenSync,
  code4Info,
  clearHaveToken,
  onlyCheckToken
}
