# raytracer
本项目的目的是用react es6 webpack实现光线反射和雾化效果的算法。


##效果图
![image](https://github.com/rainsilence0911/raytracer/blob/master/standalone/image/snipshot.png)

## 功能
三维视角上下旋转

球体高光

球体上下左右移动

球体光线反射倒影

环境雾化效果（远的雾强，近的雾弱）

无任何图片，所有像素皆由片段着色器生成

## What is standalone version
standalone版本是此项目的原型，功能已经全部实现。可在所有支持webgl的浏览器上双击打开运行

## What is reactES6 version
用react进行了重构，用webpack的raw-loader去模块化vertex shader和fragment shader文件。将html的控制逻辑和canvas的绘画逻辑解藕

代码总共分为三层：

gl目录下的原创轻量级webgl绘图引擎

framework层:util,manager,event文件夹下，包与包之间互相独立，不存在互相依赖

应用层: component,observer文件夹下，两个package之间依然互相独立，不存在互相依赖，但是会依赖bootstrap的代码


## How to install
Standalone版本直接双击test.html就可以运行

es6版本用了webpack+hot deploy plugin作为开发环境

1）进入webpack.config.js的目录

2) npm install

3) npm run hot-dev-server

4) open browser and input http://localhost:8080