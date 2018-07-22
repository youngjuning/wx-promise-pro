---
sidebar: auto
---

## wx.pro.lazyInitChart 使用说明

### 文件架构

> option 一般很大，所以建议单独写出来

![image](https://user-images.githubusercontent.com/13204332/39611173-5b6a4dee-4f88-11e8-8db9-c13d9f8fd701.png)

### myCardp-option.js

因为可能需要在获取 option 之后进行其他操作，所以我们使用 Promise 对象封装了该方法。

```js
const getOption = (pv,uv) => {
  return new Promise((resolve, reject) =>{
    let option = {
      title: {
        text: '卡片访问量统计',
        left: 'center'
      },
      color: ['#37a2da'],
      tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      grid: {
        left: 20,
        right: 20,
        bottom: 15,
        top: 40,
        containLabel: true
      },
      xAxis: [{
        type: 'category',
        axisLine: {
          lineStyle: {
            color: '#999'
          }
        },
        data: ['人次', '人数'],
        axisLabel: {
          color: '#666'
        }
      }],
      yAxis: [{
        type: 'value',
        axisTick: {
          show: false
        },
        data: [10, 5],
        axisLine: {
          lineStyle: {
            color: '#999'
          }
        },
        axisLabel: {
          color: '#666'
        }
      }],
      series: [{
        type: 'bar',
        label: {
          normal: {
            show: true,
            position: 'inside'
          }
        },
        data: [{
            name: '人次',
            value: pv
          },
          {
            name: "人数",
            value: uv
          }
        ],
        itemStyle: {
          emphasis: {
            color: '#32c5e9'
          }
        }
      }]
    }
    resolve(option)
  })
}
export default getOption
```

### myChart.js

`AV.User.loginWithWeapp()` 是 leancloud 的小程序一键登录，我的场景是需要进入页面动态获取该用户的 pv，uv。你可以理解为一个网络请求。换成 `wx.pro.request(option).then()` 是一样的的

```js
import * as echarts from '../../utils/ec-canvas/echarts'
import getOption from './myCard-option.js'
import AV from '../../utils/av-weapp-min.js'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    ecdata: {
      // 将 lazyLoad 设为 true 后，需要手动初始化图表
      lazyLoad: true
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.lazyInitChart()
  },
  /**
   * 懒加载图表
   */
  lazyInitChart() {
    AV.User.loginWithWeapp().then(user => {
      let pv = user.get('cardSharing').pv
      let uv = user.get('cardSharing').uv
      getOption(pv,uv).then(option => {
        wx.pro.lazyInitChart(option,echarts,'#myCard',this).then((chart) => {
          return chart
        })
      })
    }).catch(err => {
      console.log(err)
    })
  }
})
```

### myCard.wxml

全局设置样式：

```css
.ec-container{
	width: 100%;
  height: 100%;
}
```

```html
<view class="ec-container">
  <ec-canvas id="myCard" canvas-id="myCard" ec="{{ecdata}}"></ec-canvas>
</view>
```

### 如何销毁实例

![image](https://user-images.githubusercontent.com/13204332/39611342-8dcd1856-4f89-11e8-9616-623d16a8b346.png)

如图，我们的API，执行了 `that.chart = chart`,因此你可以模仿官方demo封装一个方法：

目前我并没有封装这个方法到 api 中，因为使用比较灵活，用户可以自己在页面中封装：

```js
dispose: function () {
  if (this.chart) {
    this.chart.dispose()
  }
  this.setData({isDisposed: true})
}
```

你还可以像官方demo那样，在懒加载初始化成功后：

```js
/**
   * 懒加载图表
   */
  lazyInitChart() {
    AV.User.loginWithWeapp().then(user => {
      let pv = user.get('cardSharing').pv
      let uv = user.get('cardSharing').uv
      getOption(pv,uv).then(option => {
        wx.pro.lazyInitChart(option,echarts,'#myCard',this).then((chart) => {
          this.setData({
            isLoaded: true,
            isDisposed: false
          },() => {
            return chart
         })
        })
      })
    }).catch(err => {
      console.log(err)
    })
  }
})
```

因为我的理念是避免过度封装，所有使用起来还是很灵活的，如果有什么疑问，可以直接问我
