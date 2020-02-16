if(!Promise.prototype.finally) {
  Promise.prototype.finally = function (callback) {
    let P = this.constructor
    return this.then(
      value  => P.resolve(callback()).then(() => value),
      reason => P.resolve(callback()).then(() => { throw reason })
    )
  }
}

// 把普通函数变成promise函数
const promisify = (api) => {
  return (options, ...params) => {
    return new Promise((resolve, reject) => {
      api(Object.assign({}, options, {
        success: resolve,
        fail: reject
      }), ...params)
    })
  }
}

// 以下是没有 success、fail、complete 属性的api
// 1、...Sync【√】
// 2、on...【√】
// 3、create... 除了 createBLEConnection【√】
// 4、...Manager【√】
// 5、pause...【√】
// 6、stopRecord、stopVoice、stopBackgroundAudio、stopPullDownRefresh【√】
// 7、hideKeyboard、hideToast、hideLoading、showNavigationBarLoading、hideNavigationBarLoading【√】
// 8、canIUse、navigateBack、closeSocket、pageScrollTo、drawCanvas【√】
// TODO: 搞成数组，然后 for in 换成 Object.keys(wx).forEach()
wx.pro = {}
const wxPromise = () => {
  for (let key in wx) {
    if (/^on|^create|Sync$|Manager$|^pause/.test(key) && key !== 'createBLEConnection' || key === 'stopRecord' || key === 'stopVoice' || key === 'stopBackgroundAudio' || key === 'stopPullDownRefresh' || key === 'hideKeyboard' || key === 'hideToast' || key === 'hideLoading' || key === 'showNavigationBarLoading' || key === 'hideNavigationBarLoading' || key === 'canIUse' || key === 'navigateBack' || key === 'closeSocket' || key === 'closeSocket' || key === 'pageScrollTo' || key === 'drawCanvas') {
      wx.pro[key] = wx[key]
    } else {
      wx.pro[key] = promisify(wx[key])
    }
  }
}

wxPromise()
