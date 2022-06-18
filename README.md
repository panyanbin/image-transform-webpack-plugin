# Image-Transform-Webpack-Plugin

## 描述

> 注意：在node中，请使用`image-transform-plugin`包，`image-transform-webpack-plugin`是基于此包进行webpack的plugin封装使用。

基于 sharp 库，把图片转换输出多张不同格式的图片，支持 SVG/PNG/JPEG/WebP/TIFF 转 PNG/JPEG/WebP/TIFF



## 安装

```bash
npm i image-transform-webpack-plugin -D
```



## webpack plugin使用

webpack打包完成后，自动把 progress.svg 输出两张图: png 图和 jpeg 图

```js
const { ImageTransformWebpackPlugin } = require("image-transform-webpack-plugin");
const { ImageTransformFormat } = require("image-transform-plugin");

module.exports = {
  //...
  plugins: [
    // ...other plugin
    new ImageTransformWebpackPlugin({
      input: "./assets/progress.svg",
      output: [
        {
          file: "./dist/progress.png",
          format: ImageTransformFormat.PNG,
          width: 800,
        },
        {
          file: "./dist/progress.jpeg",
          format: ImageTransformFormat.JPEG,
        },
      ],
    }),
  ],
};
```

## 配置

更多配置信息请查看`image-transform-plugin`包的说明。

