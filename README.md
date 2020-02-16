# wx-promise-pro

:sparkles:强大、优雅的小程序异步库:rocket: 小程序promise

[![npm](https://img.shields.io/npm/v/wx-promise-pro.svg)](https://www.npmjs.com/package/wx-promise-pro) [![npm](https://img.shields.io/npm/dt/wx-promise-pro.svg)](https://www.npmjs.com/package/wx-promise-pro) [![Financial Contributors on Open Collective](https://opencollective.com/wx-promise-pro/all/badge.svg?label=financial+contributors)](https://opencollective.com/wx-promise-pro)

[![NPM](https://nodei.co/npm/wx-promise-pro.png?compact=true)](https://nodei.co/npm/wx-promise-pro/)

## 优势

- 方便集成：一处引用，处处使用
- 把微信小程序所有异步 API promise 化并挂在到`wx.pro` 对象下。

## 使用

### 普通使用方法

将 `wxPromise.min.js` copy 到 utils 目录中，然后在 `app.js` 中引入： `import './utils/wxPromise.min.js'`。

### 使用NPM

```bash
npm i wx-promise-pro
```

然后使用 nodejs（`require('wx-promise-pro')`）或者 ES6 Moudle（`import 'wx-promise-pro'`） 的方式引入。

### 支持 async、await

页面引入 regeneratorRuntime: `import regeneratorRuntime from '/utils/regenerator-runtime.js'`

## 支持所有的微信小程序异步API

使用 wxPromise 开发者无需关心兼容与否，只要是 `wx` 支持的 api，`wx.pro` 全部支持。

**示例代码：**

```js
// 演示 wxPromise 的能力
wx.pro.showLoading({
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

## Contributors

### Code Contributors

This project exists thanks to all the people who contribute. <!--[[Contribute](CONTRIBUTING.md)].-->
<a href="https://github.com/youngjuning/wx-promise-pro/graphs/contributors"><img src="https://opencollective.com/wx-promise-pro/contributors.svg?width=890&button=false" /></a>

### Financial Contributors

Become a financial contributor and help us sustain our community. [[Contribute](https://opencollective.com/wx-promise-pro/contribute)]

#### Individuals

<a href="https://opencollective.com/wx-promise-pro"><img src="https://opencollective.com/wx-promise-pro/individuals.svg?width=890"></a>

#### Organizations

Support this project with your organization. Your logo will show up here with a link to your website. [[Contribute](https://opencollective.com/wx-promise-pro/contribute)]

<a href="https://opencollective.com/wx-promise-pro/organization/0/website"><img src="https://opencollective.com/wx-promise-pro/organization/0/avatar.svg"></a>
<a href="https://opencollective.com/wx-promise-pro/organization/1/website"><img src="https://opencollective.com/wx-promise-pro/organization/1/avatar.svg"></a>
<a href="https://opencollective.com/wx-promise-pro/organization/2/website"><img src="https://opencollective.com/wx-promise-pro/organization/2/avatar.svg"></a>
<a href="https://opencollective.com/wx-promise-pro/organization/3/website"><img src="https://opencollective.com/wx-promise-pro/organization/3/avatar.svg"></a>
<a href="https://opencollective.com/wx-promise-pro/organization/4/website"><img src="https://opencollective.com/wx-promise-pro/organization/4/avatar.svg"></a>
<a href="https://opencollective.com/wx-promise-pro/organization/5/website"><img src="https://opencollective.com/wx-promise-pro/organization/5/avatar.svg"></a>
<a href="https://opencollective.com/wx-promise-pro/organization/6/website"><img src="https://opencollective.com/wx-promise-pro/organization/6/avatar.svg"></a>
<a href="https://opencollective.com/wx-promise-pro/organization/7/website"><img src="https://opencollective.com/wx-promise-pro/organization/7/avatar.svg"></a>
<a href="https://opencollective.com/wx-promise-pro/organization/8/website"><img src="https://opencollective.com/wx-promise-pro/organization/8/avatar.svg"></a>
<a href="https://opencollective.com/wx-promise-pro/organization/9/website"><img src="https://opencollective.com/wx-promise-pro/organization/9/avatar.svg"></a>
