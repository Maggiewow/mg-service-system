/*
 * @Author: your name
 * @Date: 2020-07-24 09:12:36
 * @LastEditTime: 2021-04-25 15:04:45
 * @LastEditors: 赵婷婷
 * @Description: In User Settings Edit
 * @FilePath: \sucai-modal\vue.config.js
 */
const path = require('path');
function resolve(dir) {
  return path.resolve(__dirname, dir);
}

var webpack = require('webpack');
// const BASE_URL = process.env.NODE_ENV === 'production' ? '/dist/' : './';

module.exports = {
  // publicPath: BASE_URL,
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html',
    },
  },
  productionSourceMap: false,
  configureWebpack: {
    output: {
      libraryExport: 'default',
    },
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        '@': resolve('src'),
        _c: resolve('src/components'),
      },
    },
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        plupload: 'plupload',
      }),
    ],
  },
  devServer: {
    port: 8091,
    hot: true,
    open: 'Google Chrome',
  },
  chainWebpack: (config) => {
    config.module
      .rule('js')
      .include.add('/packages')
      .end()
      .use('babel')
      .loader('babel-loader')
      .tap((options) => {
        return options;
      });
  },
  css: {
    extract: false,
  },
  devServer: {
    // proxy: 'https://user.shandian8.com',
    proxy: 'https://shandianyun.iqilu.com',
  },
};
