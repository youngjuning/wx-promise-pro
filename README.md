# wxPromise

强大的、优雅的 小程序 Promise 库

## 使用方法

将 `wxPromise.js` copy 到 utils 目录中，然后在 `app.js` 中引入： `import './utils/wxPromise.js'`。

本库分为两个部分，一部分是将微信小程序原有的API promise 化，一部分是我自己封装的常用方法。两部分的方法都是挂载在 `wx.pro` 对象下，使用的时候直接使用 `wx.pro` 对象调用即可。

## 支持的微信 API

> 后续会补全常用的 API ，如果你觉得常用的 API 没有收录，可以发issue，也可以 fork。

| api                       | 解释                                                               |
| ------------------------- | ------------------------------------------------------------------ |
| wx.login                  | 调用接口 `wx.login()` 获取临时登录凭证（code）                     |
| wx.getUserInfo            | 获取用户信息，withCredentials 为 true 时需要先调用 `wx.login` 接口 |
| wx.request                | 发起网络请求                                                       |
| wx.getSystemInfo          | 异步获取系统信息                                                   |
| wx.getImageInfo           | 根据图片路径获取图片信息                                           |
| wx.previewImage           | 预览图片                                                           |
| wx.saveImageToPhotosAlbum | 将图片保存到系统相册                                               |
| wx.chooseVideo            | 拍摄视频或从手机相册中选视频，返回视频的临时文件路径               |
| wx.canvasToTempFilePath   | 当前画布指定区域的内容导出生成指定大小的图片，并返回文件路径       |

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
