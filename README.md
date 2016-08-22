# raytracer
本项目的目的是用react es6 webpack实现光线反射和雾化效果的算法。


##效果图
![image](https://github.com/rainsilence0911/raytracer/blob/master/standalone/image/snipshot.png)

## 功能
三维视角上下旋转

球体高光

球体上下左右移动

环境雾化效果（远的雾强，近的雾弱）

无任何图片，所有像素皆由片段着色器生成

## What is standalone version
standalone版本是此项目的原型，功能已经全部实现。可在所有支持webgl的浏览器上双击打开运行

## What is reactES6 version
react version 先开个坑，还没时间去做。预计用webpack的raw-loader去模块化vertex shader和fragment shader文件