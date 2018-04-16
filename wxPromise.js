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

wx.pro = {}

const wxPromise = () => {
  // 将 promise 方法 挂载到 wx.pro 对象上
  for (var variable in wx) {
    if (wx.hasOwnProperty(variable)) {
      wx.pro[variable] = promisify(wx[variable])
    }
  }
  
  // 顶部提示框
  wx.pro.showTopTips = (option,that) => {
    return new Promise((resolve, reject) =>{
      if (!option) {reject('缺少配置项！')}
      if (!option.content) {reject('option.content属性是必须的')}
      // 如果topTips属性不存在就初始化为一个对象
      let topTips = that.data.topTips || {}

      // 如果已经有一个定时器在了，就清理掉先
      if (topTips.timeout) {
        clearTimeout(topTips.timeout)
        topTips.timeout = 0
      }

      // 如果没有设置duration则默认3000ms
      if (option.duration === undefined) {
        option.duration = 3000
      }

      // 设置超时定时器，定时关闭topTips
      var timeout = setTimeout(() => {
        that.setData({
          'topTips.show': false,
          'topTips.timeout': 0
        },() => {
          resolve()
        })
      }, option.duration)

      // 展示出topTips
      that.setData({
        topTips: {
          show: true,
          content: option.content, // content属性必选
          timeout // 把超时定时器赋值给topTip对象
        }
      })
    })
  }
}

wxPromise()
