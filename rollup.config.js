import babel from 'rollup-plugin-babel'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import json from 'rollup-plugin-json'
import { terser } from 'rollup-plugin-terser'

// 输入
const input = 'src/index.js'

// 插件
const plugins = [
  json(),
  babel({
    exclude: 'node_modules/**',
  }),
  nodeResolve(), // 告诉 Rollup 如何查找外部模块
  commonjs(), // 将 CommonJS 转换成 ES2015 模块
  terser(), // 压缩文件
]

const config = {
  input,
  output: {
    file: 'dist/wx-promise-pro.js',
    format: 'es',
    sourcemap: true,
  },
  plugins,
}

export default config
