# wx-promise-pro
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-3-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

✨强大、优雅的微信小程序异步库🚀

[![npm](https://img.shields.io/npm/v/wx-promise-pro.svg)](https://www.npmjs.com/package/wx-promise-pro) [![npm](https://img.shields.io/npm/dt/wx-promise-pro.svg)](https://www.npmjs.com/package/wx-promise-pro) [![Financial Contributors on Open Collective](https://opencollective.com/wx-promise-pro/all/badge.svg?label=financial+contributors)](https://opencollective.com/wx-promise-pro)

[![NPM](https://nodei.co/npm/wx-promise-pro.png?compact=true)](https://nodei.co/npm/wx-promise-pro/)

## 优势

- 方便集成：一处引用，处处使用
- 把微信小程序所有异步 API promise 化并挂在到`wx.pro` 对象下
- 支持 ES2018 `finally` 特性
- 支持 TypeScript 开发

## 安装

> 你也可以直接把 `dist` 目录下的 `wx-promise-pro.js` 拷贝到项目里使用

```bash
$ npm i wx-promise-pro -S
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

## 贡献者 ✨

感谢如下贡献者的贡献 ([emoji key](https://allcontributors.org/docs/en/emoji-key))：
<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/wss534857356"><img src="https://avatars0.githubusercontent.com/u/13204332?s=60&v=4" width="100px;" alt=""/><br /><sub><b>Shenshun Weng</b></sub></a><br /><a href="https://github.com/youngjuning/wx-promise-pro/commits?author=youngjuning" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/kala888"><img src="https://avatars2.githubusercontent.com/u/1215976?v=4" width="100px;" alt=""/><br /><sub><b>kala888</b></sub></a><br /><a href="https://github.com/youngjuning/wx-promise-pro/commits?author=kala888" title="Code">💻</a></td>
    <td align="center"><a href="https://upupming.site"><img src="https://avatars1.githubusercontent.com/u/24741764?v=4" width="100px;" alt=""/><br /><sub><b>Yiming Li</b></sub></a><br /><a href="https://github.com/youngjuning/wx-promise-pro/issues?q=author%3Aupupming" title="Bug reports">🐛</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->
