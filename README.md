# mall

> Vue+Node.js+MongoDB实现简易商城网站

## 功能描述
主要功能包括用户登录、登出，商品价格筛选、加入购物车、从购物车中删除、配送地址选择、订单提交、订单完成等一系列购物功能

## 技术栈
前端：<br>
Vue：实现商城前端页面开发<br>
vuex: 状态管理<br>
Vue-router: 实现路由跳转<br>
Webpack:模块化打包<br>

后台：<br>
Node.js：采用express框架<br>

数据库：<br>
MongodDB<br>

## 运行效果图
图1：程序主界面，展示商品列表，实现按价格筛选商品，实现价格升序、降序<br>
![https://github.com/wangxianh/Mall/blob/master/gif/6.gif](https://github.com/wangxianh/Mall/blob/master/gif/6.gif)<br><br>
图2：用户登录、登出，在未登录状态下无法加入购物车<br>
![https://github.com/wangxianh/Mall/blob/master/gif/3.gif](https://github.com/wangxianh/Mall/blob/master/gif/3.gif)<br><br>
图3：商品加入购物车、确认订单、提交订单、订单完成流程<br>
![https://github.com/wangxianh/Mall/blob/master/gif/1.gif](https://github.com/wangxianh/Mall/blob/master/gif/1.gif)<br><br>
图4：删除购物车中商品<br>
![https://github.com/wangxianh/Mall/blob/master/gif/4.gif](https://github.com/wangxianh/Mall/blob/master/gif/4.gif)<br>

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
