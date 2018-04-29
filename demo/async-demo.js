import regeneratorRuntime from '/utils/regenerator-runtime'
import './utils/wxPromise'

App({
  onLaunch: function () {
    this.asyncFunc('youngjuning').then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    }).finally(() => {
      wx.hideLoading()
    })
  },

  /**
   * 异步函数使用demo
   * 当内部有异步操作的时候可以使用，目前不推荐全面在小程序中代替 Promise
   * async 函数调用的时候支持 finally
   */
  asyncFunc: async function(username){
    let userInfo
    try {
      await this.getUserInfo().then(res => {
        userInfo = res
      })
      return userInfo
    } catch (e) {
      throw e
    }
  },

  /**
   * 异步函数
   */
  getUserInfo (){
    wx.showLoading({
      title: '资料获取中...',
      mask: true
    })
    return new Promise((resolve, reject) =>{
      wx.pro.login().then(res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        let code = res.code
        // 可以将 res 发送给后台解码出 unionId
        wx.pro.getUserInfo().then(userInfo => {
          wx.pro.setStorage({
            key: 'userInfo',
            data: res.userInfo
          }).then(res => {
            resolve(userInfo)
          }, err => {
            reject('存储用户信息失败！')
          })
          // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
          // 所以此处加入 callback 以防止这种情况
          if (this.userInfoReadyCallback) {
            this.userInfoReadyCallback(res)
          }
        })
      }, err => {
        reject('登录失败：',err)
      })
    })
  }
})
