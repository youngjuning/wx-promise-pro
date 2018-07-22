---
sidebar: auto
---

## match(type,str)

### 参数说明

|  参数  |  类型  | 必填 |      说明      |
| ------ | ------ | ---- | -------------- |
|  type  | String |  是  |      类型      |
| String | String |  是  | 要匹配的字符串 |

### 返回值

通过校验，返回 `true`，否则返回 `false`

### 支持的类型

1. type= chinese：匹配中文字符
2. type= email：匹配email地址
3. type= url：匹配url地址
4. type= phoneNumber：匹配手机号码
5. type= cardid：匹配身份证号
6. type= mail：匹配邮编号

### demo

```js
if (!wx.pro.match('phoneNumber',wxPhoneNumber)) {
 wx.pro.showTopTips({
   content: '请输入正确的手机号！',
   duration: 3000
 },this)
}
```
