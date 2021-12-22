/*
 * @Author: your name
 * @Date: 2020-08-12 18:18:35
 * @LastEditTime: 2020-12-03 09:39:25
 * @LastEditors: 赵婷婷
 * @Description: In User Settings Edit
 * @FilePath:
 */
module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: [
    [
      'import',
      {
        libraryName: 'view-design',
        libraryDirectory: 'src/components',
      },
    ],
  ],
};
