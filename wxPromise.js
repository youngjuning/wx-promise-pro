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
// ...Sync 没有 success、fail、complete 属性
// wx.on... 没有 success、fail、complete 属性
// wx.create... 除了 wx.createBLEConnection 都没有 success、fail、complete 属性
// getRecorderManager、stopRecord、pauseVoice、stopVoice、pauseBackgroundAudio、stopBackgroundAudio、getBackgroundAudioManager 都没有 success、fail、complete 属性
const wxPromise = () => {
  // 将 promise 方法 挂载到 wx.pro 对象上
  for (let variable in wx) {
    if (wx.hasOwnProperty(variable)) {
      if (/^on|^create|Sync$/.test(variable) && variable !== 'createBLEConnection' || variable === 'getRecorderManager' || variable === 'stopRecord' || variable === 'pauseVoice' || variable === 'stopVoice' || variable === 'pauseBackgroundAudio' || variable === 'stopBackgroundAudio' || variable === 'getBackgroundAudioManager') {
        wx.pro[variable] = wx[variable]
      } else {
        wx.pro[variable] = promisify(wx[variable])
      }
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

  // 初始化 echarts
  wx.pro.initChart = (option,echarts) => {
    return (canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      canvas.setChart(chart)
      chart.setOption(option)
      return chart
    }
  },

  // 把当前画布指定区域的内容导出生成指定大小的图片，并返回文件路径
  // TODO: 增加更多的参数配置
  wx.pro.canvasToTempFilePath = (canvasContext) => {
    return new Promise((resolve, reject) =>{
      canvasContext.draw(true, () => {
        wx.canvasToTempFilePath({
          canvasId: 'card',
          success: (res) => {
            resolve(res)
          },
          fail: (err)=> {
            reject(err)
          }
        })
      })
    })
  }
}

wxPromise()
