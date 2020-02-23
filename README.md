# wx-promise-pro

✨强大、优雅的微信小程序异步库🚀

[![npm](https://img.shields.io/npm/v/wx-promise-pro.svg)](https://www.npmjs.com/package/wx-promise-pro) [![npm](https://img.shields.io/npm/dt/wx-promise-pro.svg)](https://www.npmjs.com/package/wx-promise-pro) [![Financial Contributors on Open Collective](https://opencollective.com/wx-promise-pro/all/badge.svg?label=financial+contributors)](https://opencollective.com/wx-promise-pro)

[![NPM](https://nodei.co/npm/wx-promise-pro.png?compact=true)](https://nodei.co/npm/wx-promise-pro/)

## 优势

- 方便集成：一处引用，处处使用
- 把微信小程序所有异步 API promise 化并挂在到`wx.pro` 对象下
- 支持 ES2018 `finally` 特性
- 支持 TypeScript 开发

## 安装

```bash
$ npm i wx-promise-pro
# or
$ yarn add wx-promise-pro
```

## 初始化

```js
import { promisifyAll, promisify } from 'wx-promise-pro'
// promisify all wx‘s api
promisifyAll()
// promisify single api
promisify(wx.getSystemInfo)().then(console.log)
```

## 示例代码

```js
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
  wx.pro.hideLoading()
})
```

## Contributors

This project exists thanks to all the people who contribute.
<a href="https://github.com/youngjuning/wx-promise-pro/graphs/contributors"><img src="https://opencollective.com/wx-promise-pro/contributors.svg?width=890&button=false" /></a>


|                           作者微信                           |                           知识星球                           |                           赞赏作者                           |
| :----------------------------------------------------------: | :----------------------------------------------------------: | :----------------------------------------------------------: |
| <img src="https://i.loli.net/2020/02/22/q2tLiGYvhIxm3Fl.jpg" width="200px"/> | <img src="https://i.loli.net/2020/02/22/AQzLmDPopb1ufsG.png" width="200px"/> | <img src="https://i.loli.net/2020/02/23/q56X1eYZuITQpsj.png" width="200px"/> |
