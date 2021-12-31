/*
 * @Author: your name
 * @Date: 2020-08-12 18:18:35
 * @LastEditTime: 2021-12-31 18:11:57
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
