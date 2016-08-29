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

## 原理
1. 球和线的交点

要渲染图形，最简单的莫过于球了。

球在数学中的定义:

|| Surface - Center || = radius
 
而我们看到的球其实是以我们眼睛为起点产生的射线组成的视椎体和球表面的交点集合。

直线方程在解析几何中如下定义：

F(x) = origin + distance * direction (1)

其中origin是直线经过的点，distance是距离，是个数字，direction是单位向量，仅仅表示距离

上面的直线方程可以理解为经过origin，方向为direction的点集。
 
球方程两边平方，得

pow(surface - center, 2) = radius * radius (2)

经(1)(2)式联立：

pow(origin -center + distance * direction, 2) = radius * radius

设v = origin-center

pow(v, 2) + 2 * distance * direction * v + pow(distance * direction, 2) = pow(radius, 2)
 
direction是单位向量，平方=1

上式等于

pow(v, 2) + 2 * distance * direction * v + pow(direction, 2) = pow(radius, 2)
 
经二次曲线万能求根公式

a = 1

b = 2 * distance * direction * v

c = pow(v, 2) - pow(radius, 2)

d = pow(b, 2) - 4 * a * c
 
这里有几个限制。

1. dot(direction, v)必须小于0。因为方向是不一样的。如果>=0代表摄像机反向的镜像。

2. d >=0

3. 由于求的是距离，所以distance必须要>0，否则就是direction有问题。

4. 由于求的是最短距离，所以只需要求一个根

最后的求距离的式子整理如下：

    distance = - direction * v - sqrt(pow(direction * v, 2) - pow(v, 2) + pow(radius, 2))
