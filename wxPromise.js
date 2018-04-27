// 把普通函数变成promise函数
const promisify = (api) => {
  return (options, ...params) => {
    return new Promise((resolve, reject) => {
      api(Object.assign({}, options, {
        success: resolve,
        fail: reject
      }), ...params)
      Promise.prototype.finally = function (callback) {
        let P = this.constructor
        return this.then(
          value  => P.resolve(callback()).then(() => value),
          reason => P.resolve(callback()).then(() => { throw reason })
        )
      }
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
  for (let key in wx) {
    if (wx.hasOwnProperty(key)) {
      if (/^on|^create|Sync$/.test(key) && key !== 'createBLEConnection' || key === 'getRecorderManager' || key === 'stopRecord' || key === 'pauseVoice' || key === 'stopVoice' || key === 'pauseBackgroundAudio' || key === 'stopBackgroundAudio' || key === 'getBackgroundAudioManager') {
        wx.pro[key] = wx[key]
      } else {
        wx.pro[key] = promisify(wx[key])
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

  // 保存图片到系统相册。需要用户授权 scope.writePhotosAlbum
  wx.pro.saveImageToPhotosAlbum = (tempFilePath) => {
    return new Promise((resolve, reject) =>{
      wx.getSetting({
        success: (res) => {
          if (!res.authSetting['scope.writePhotosAlbum']) {
            // 没有授权，向用户发起授权请求
            wx.authorize({
              scope: 'scope.writePhotosAlbum',
              success: () => {
                // 用户同意授权，调用 api 保存图片
                wx.saveImageToPhotosAlbum({
                  filePath: tempFilePath,
                  success(res) {
                    resolve(res)
                  },
                  fail(err) {
                    reject(err)
                  }
                })
              },
              fail: err => {
                // 用户拒绝授权,提醒用户打开设置页面
                wx.hideLoading()
                wx.pro.showModal({
                  title: '温馨提示',
                  content: '请授权系统使用保存图片接口',
                  confirmText: '知道了',
                  showCancel: false
                }).then(res => {
                  wx.openSetting()
                })
              }
            })
          } else {
            // 已经授权，直接调用 api 保存图片
            wx.saveImageToPhotosAlbum({
              filePath: tempFilePath,
              success(res) {
                resolve(res)
              },
              fail(err) {
                reject(err)
              }
            })
          }
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
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
  },

  /**
   * 小程序 canvas 写字自动换行解决方案
   * @param  {[string]} text     [在画布上输出的文本]
   * @param  {[number]} x        [绘制文本的左上角x坐标位置]
   * @param  {[number]} y        [绘制文本的左上角y坐标位置]
   * @param  {[number]} column   [一行多少字,如果为0，则代表不自动换行]
   * @param  {[number]} maxWidth [需要绘制的最大宽度，可选]
   */
  wx.pro.fillText = (canvasContext,text,x,y,column,maxWidth) => {
    if (column === 0) {
      if (maxWidth) {
        canvasContext.fillText(text,x,y,maxWidth)
      } else {
        canvasContext.fillText(text,x,y)
      }
      return
    }
    let rows = 0
    if (text.length%column >0) {
      rows = parseInt(text.length/column)+1
    } else {
      rows = parseInt(text.length/column)
    }
    let index = 0
    for (var i = 0; i < rows; i++) {
      let rowText = text.substring(i*column,i*column+column)
      if (/\n/.test(rowText) || rowText.length > column) {
        rowText = rowText.split('\n')
        console.log(rowText)
        rowText.forEach(item => {
          index ++
          if (maxWidth) {
            canvasContext.fillText(item,x,y+(i+index)*column,maxWidth)
          } else {
            canvasContext.fillText(item,x,y+(i+index)*column)
          }
        })
      } else {
        if (maxWidth) {
          canvasContext.fillText(rowText,x,y+(i+index)*column,maxWidth)
        } else {
          canvasContext.fillText(rowText,x,y+(i+index)*column)
        }
      }
    }
  }
}

wxPromise()
