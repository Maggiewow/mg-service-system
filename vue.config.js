/*
 * @Author: your name
 * @Date: 2020-07-24 09:12:36
 * @LastEditTime: 2022-03-11 15:23:40
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

    // 下载sass-resources-loader 设置less文件全局变量
    const oneOfsMap = config.module.rule('less').oneOfs.store;
    oneOfsMap.forEach((item) => {
      item
        .use('sass-resources-loader')
        .loader('sass-resources-loader')
        .options({
          // 这里填入你的样式文件地址
          resources: './src/assets/css/common.less',
        })
        .end();
    });
  },
  css: {
    extract: false,
    // css预设器配置项
    loaderOptions: {
      less: {
        // 若 less-loader 版本小于 6.0，请移除 lessOptions 这一级，直接配置选项。
        modifyVars: {
          // 初始化可直接覆盖变量
          '@error-color': '#1890FF',
        },
        javascriptEnabled: true,
      },
    },
  },
  devServer: {
    // proxy: 'https://user.shandian8.com',
    proxy: 'https://shandianyun.iqilu.com',
  },
};
