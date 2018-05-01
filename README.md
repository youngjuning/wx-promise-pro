# wxPromise

强大的、优雅的 小程序 Promise 库，wxPromise 不仅仅把微信小程序所有异步 API promise 化，还把许多优雅的解决方案封装成方法挂载到 `wx.pro` 对象下。所以在 wxPromise 中，pro 既有 promise 的含义又有扩展的意思。

## 普通使用方法

将 `wxPromise.js` copy 到 utils 目录中，然后在 `app.js` 中引入： `import './utils/wxPromise.min.js'`。

本库分为两个部分，一部分是将微信小程序原有的API promise 化，一部分是我自己封装的常用方法。两部分的方法都是挂载在 `wx.pro` 对象下，使用的时候直接使用 `wx.pro` 对象调用即可。

如果想要支持 async 和 await，请仔细阅读 **支持 async和await** 这一节。

## 使用NPM

如果你在小程序项目中使用的 NPM 来作为包管理器，或者你使用 mpvue 开发小程序，那么可以直接使用 npm 来安装 `wx-promise-pro`

```bash
npm i wx-promise-pro -D
```

然后使用 nodejs（`require('wx-promise-pro')`）或者 ES6 Moudle（`import 'wx-promise-pro'`） 的方式引入。

## 支持 async、await

> 由于 wxPromise 是直接内置了 regenerator-runtime，所以推荐使用压缩版，体积不到10k

全局引入 regeneratorRuntime: `import regeneratorRuntime from '/utils/wxPromise.min.js'`

> 注意：导入 regeneratorRuntime 和原本 `wx.pro` 对象是不冲突的，你如果用不到 async 函数，那么可以不导入 regeneratorRuntime

## 支持所有的微信小程序异步API

从 2.0.0 开始，我们引入了下面这段代码，来一劳永逸地支持所有的 异步 api。开发者无需关心兼容与否，只要是 `wx` 支持的 api，`wx.pro` 全部支持：

```js
// 将 promise 方法 挂载到 wx.pro 对象上
for (var variable in wx) {
  if (wx.hasOwnProperty(variable)) {
    wx.pro[variable] = promisify(wx[variable])
  }
}
```

### 示例代码

```js
// 演示 wxPromise 的能力
wx.showLoading({
  title: '加载中',
  mask: true
})
wx.pro.request({
  url: 'https://cnodejs.org/api/v1/topics',
  data: {},
  method: 'GET',
  header: {'content-type': 'application/json'}
}).then(res => {
  console.log(res)
}).catch(err => {
  console.log(err)
}).finally(() => {
  wx.hideLoading()
})
```

## 扩展的 API

### wx.pro.showTopTips(OBJECT,this)

#### OBJECT 参数说明

| 参数     | 类型   | 必填 | 说明                         |
| -------- | ------ | ---- | ---------------------------- |
| content  | String | 是   | 提示的内容                   |
| duration | Number | 否   | 提示持续的时间（默认3000ms） |

#### Bug & Tips

1. tip：第二个参数 this 是必填的，意思是传递当前页面的 this 给组件
2. 这个方法是需要视图层配合的，如果你使用的是 `weui-wxss`，那么在页面中引入下面的代码即可：

```html
<view class="weui-toptips weui-toptips_warn" wx:if="{{topTips.show}}">{{topTips.content}}</view>
```

3. 你如果没有使用 `weui-wxss` 也没关系，自己定义样式，只要数据绑定正确即可。

## TODO

* [x] 排除所有的同步 API，让用户可以彻底抛弃 wx 对象
* [x] 支持 ES2017 的 [async 函数](http://t.cn/RyUUVvA)
* [x] 支持 ES2018 的 [finally](http://t.cn/RuJyewc)
* [ ] 完善扩展 API 的文档

## 赞赏

赞赏是对我最大的支持！！

<img src="http://t.cn/RuKLpOz">

## License

MIT License

Copyright (c) 2018 youngjuning

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
