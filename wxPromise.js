/*
* wxPromise
* https://github.com/youngjuning/wxPromise
*
* NPM INSTALL
* https://www.npmjs.com/package/wx-promise-pro
*
* Copyright 2018, youngjuning
* http://www.wakeuptocode.me
*
* Licensed under the MIT license:
* https://opensource.org/licenses/MIT
*/

// 判断是否是再mpvue里执行
const isMpvue = (that) => {
  if (that && that.$mp) {
    return true
  }
  return false
}

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

// 以下是没有 success、fail、complete 属性的api
// 1、...Sync【√】
// 2、on...【√】
// 3、create... 除了 createBLEConnection【√】
// 4、...Manager【√】
// 5、pause...【√】
// 6、stopRecord、stopVoice、stopBackgroundAudio、stopPullDownRefresh【√】
// 7、hideKeyboard、hideToast、hideLoading、showNavigationBarLoading、hideNavigationBarLoading【√】
// 8、canIUse、navigateBack、closeSocket、pageScrollTo、drawCanvas【√】
wx.pro = {}
const wxPromise = () => {
  for (let key in wx) {
    if (wx.hasOwnProperty(key)) {
      if (/^on|^create|Sync$|Manager$|^pause/.test(key) && key !== 'createBLEConnection' || key === 'stopRecord' || key === 'stopVoice' || key === 'stopBackgroundAudio' || key === 'stopPullDownRefresh' || key === 'hideKeyboard' || key === 'hideToast' || key === 'hideLoading' || key === 'showNavigationBarLoading' || key === 'hideNavigationBarLoading' || key === 'canIUse' || key === 'navigateBack' || key === 'closeSocket' || key === 'closeSocket' || key === 'pageScrollTo' || key === 'drawCanvas') {
        wx.pro[key] = wx[key]
      } else {
        wx.pro[key] = promisify(wx[key])
      }
    }
  }

  /**
   * 正则匹配
   * @param  {[string]} type [类型]
   * @param  {[string]} str  [要匹配的字符串]
   */
  wx.pro.match = (type,str) => {
    let reg = ''
    if (type === 'chinese') { // 匹配中文字符
      reg = /[\u4e00-\u9fa5]/gm
    } else if (type === 'email') { // 匹配email地址
      reg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
    } else if (type === 'url') { // 匹配URL地址
      reg = /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i
    } else if (type === 'phoneNumber') { // 匹配手机号码
      reg = /^(0|86|17951)?(13[0-9]|14[579]|15[012356789]|16[56]|17[1235678]|18[0-9]|19[89])\s{0,1}[0-9]{4}\s{0,1}[0-9]{4}$/
    } else if (type === 'cardid') { // 匹配身份证号
      reg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/
    } else if (type === 'mail') { // 匹配邮编号
      reg = /^[1-9]\d{5}(?!\d)$/
    }
    if (reg.test(str)) {
      return true
    } else {
      return false
    }
  },

  // 顶部提示框
  wx.pro.showTopTips = (option,that) => {
    return new Promise((resolve, reject) =>{
      if (!option) {reject('缺少配置项！')}
      if (!option.content) {reject('option.content属性是必须的')}
      
      const inMpvue = isMpvue(that)
      
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
        // mpvue中直接调用that.topTips 来修改data
        if (inMpvue) {
          that.topTips = {
            content: that.topTips.content,
            show: false,
            timeout: 0
           }
        } else { 
          that.setData({
            'topTips.show': false,
            'topTips.timeout': 0
          },() => {
            resolve()
          })
        }
      }, option.duration)
      // 展示出topTips
      if (inMpvue) {
        that.topTips = {
          show: true,
          content: option.content, // content属性必选
          timeout // 把超时定时器赋值给topTip对象
        }
      } else {
        that.setData({
          topTips: {
            show: true,
            content: option.content, // content属性必选
            timeout // 把超时定时器赋值给topTip对象
          }
        })
      }
    })
  }

  // 初始化 echarts
  wx.pro.initChart = (option,echarts) => {
    return (canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      })
      canvas.setChart(chart)
      chart.setOption(option)
      return chart
    }
  },

  // echarts 延迟加载模式初始化
  wx.pro.lazyInitChart = (option,echarts,componentId,that) => {
    return new Promise((resolve,reject,canvas,width,height) => {
      that.selectComponent(componentId).init((canvas, width, height) => {
        // 获取组件的 canvas、width、height 后的回调函数
        // 在这里初始化图表
        const chart = echarts.init(canvas, null , {
          width: width,
          height: height
        })
        chart.setOption(option)

        // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
        that.chart = chart

        // 注意这里一定要返回 chart 实例，否则会影响事件处理等
        resolve(chart)
      })
    })
  },

  /**
   * 更新 echarts
   * echats 没有提供 update 的方法，因此我们利用 clear() 和 setOption() api 组合实现了这个功能
   */
  wx.pro.updateChart = (chart,option) => {
    // 在chart.setOption之前用chart.clear来清除之前的图表，否则会出现一个非常奇怪的图表
    chart.clear()
    // option 是在网络请求之后异步动态获取的
    chart.setOption(option)
    // 因为不是 dispose，所以不需要重新绑定到this上，也不需要再次返回实例
  }

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
  }
}

wxPromise();

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
!(function(global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      module.exports = runtime;
    }
    return;
  }

  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  var ContinueSentinel = {};

  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      context[delegate.resultName] = info.value;

      context.next = delegate.nextLoc;

      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      return info;
    }

    context.delegate = null;
    return ContinueSentinel;
  }

  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  (function() { return this })() || Function("return this")()
);
