# wxPromise

强大的、优雅的 小程序 Promise 库，wxPromise 不仅仅把微信小程序所有异步 API promise 化，还把许多优雅的解决方案封装成方法挂载到 `wx.pro` 对象下。所以在 wxPromise 中，pro 既有 promise 的含义又有扩展的意思。

## 使用NPM

如果你在小程序项目中使用的 NPM 来作为包管理器，那么可以直接使用 npm 来安装 `wx-promise-pro`

```bash
npm i wx-promise-pro -D
```

## 普通使用方法

将 `wxPromise.js` copy 到 utils 目录中，然后在 `app.js` 中引入： `import './utils/wxPromise.js'`。

本库分为两个部分，一部分是将微信小程序原有的API promise 化，一部分是我自己封装的常用方法。两部分的方法都是挂载在 `wx.pro` 对象下，使用的时候直接使用 `wx.pro` 对象调用即可。

## 支持所有的微信小程序 异步API

在老版本中，需要手动注册 api ，才能支持，这样模式弊端很明显（升级效率极低）。

从 2.0.0 开始，我们引入了下面这段代码，来一劳永逸地支持所有的 异步 api。开发者无需关心兼容与否，只要是 `wx` 支持的 api， `wx.pro` 全部支持：

```js
// 将 promise 方法 挂载到 wx.pro 对象上
for (var variable in wx) {
  if (wx.hasOwnProperty(variable)) {
    wx.pro[variable] = promisify(wx[variable])
  }
}
```

> 注意：小程序API并不是所有的 API 都是异步的，目前 wxPromise 还没有过滤所有的同步API，预计会在 2.5.0 版本全部过滤掉。建议用户调用同步API的时候，不使用 wx.pro 对象，给大家带来不便请多谅解。

### 示例代码

```js
// 演示 wxPromise 的能力
wx.pro.request({
  url: 'https://cnodejs.org/api/v1/topics',
  data: {},
  method: 'GET',
  header: {'content-type': 'application/json'}
}).then((res) => {
  console.log(res)
}, (error) => {
  console.log(error)
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

* [ ] 完善扩展 API 的文档
* [ ] 排除所有的同步 API，让用户可以彻底抛弃 wx 对象
* [ ] 支持 ES2017 的 [async 函数](http://t.cn/RyUUVvA)
* [x] 支持 ES2018 的 [finally](http://t.cn/RuJyewc)

## 赞赏

赞赏是对我最大的支持！！

<img src="http://t.cn/RuiUQbr">
