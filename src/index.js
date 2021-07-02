import { asyncMethods } from './methods'

// polyfill for finally
if(!Promise.prototype.finally) {
  Promise.prototype.finally = function (callback) {
    let P = this.constructor
    return this.then(
      value  => P.resolve(callback()).then(() => value),
      reason => P.resolve(callback()).then(() => { throw reason })
    )
  }
}

// core method
export const promisify = (api) => {
  return (args = {}) => {
    return new Promise((resolve, reject) => {
      api({
        fail: reject,
        success: resolve,
        ...args,
      })
    })
  }
}

export const promisifyAll = () => {
  wx.pro = {}
  Object.keys(wx).forEach(key => {
    if (asyncMethods.indexOf(key) >= 0) {
      wx.pro[key] = promisify(wx[key])
    } else if (key !== 'createSignal' && key !== "lanDebug") {
      wx.pro[key] = wx[key]
    }
  })
}
