# vue-admin-template

English | [简体中文](./README-zh.md)

> A minimal vue admin template with Element UI & axios & iconfont & permission control & lint

**Live demo:** http://panjiachen.github.io/vue-admin-template


**The current version is `v4.0+` build on `vue-cli`. If you want to use the old version , you can switch branch to [tag/3.11.0](https://github.com/PanJiaChen/vue-admin-template/tree/tag/3.11.0), it does not rely on `vue-cli`**

## Build Setup

```bash
# clone the project
git clone https://github.com/PanJiaChen/vue-admin-template.git

# enter the project directory
cd vue-admin-template

# install dependency
npm install

# develop
npm run dev
```

This will automatically open http://localhost:9528

## Build

```bash
# build for test environment
npm run build:stage

# build for production environment
npm run build:prod
```

## Advanced

```bash
# preview the release environment effect
npm run preview

# preview the release environment effect + static resource analysis
npm run preview -- --report

# code format check
npm run lint

# code format check and auto fix
npm run lint -- --fix
```

Refer to [Documentation](https://panjiachen.github.io/vue-element-admin-site/guide/essentials/deploy.html) for more information

## Demo

![demo](https://github.com/PanJiaChen/PanJiaChen.github.io/blob/master/images/demo.gif)

## Extra

If you want router permission && generate menu by user roles , you can use this branch [permission-control](https://github.com/PanJiaChen/vue-admin-template/tree/permission-control)

For `typescript` version, you can use [vue-typescript-admin-template](https://github.com/Armour/vue-typescript-admin-template) (Credits: [@Armour](https://github.com/Armour))

## Related Project

- [vue-element-admin](https://github.com/PanJiaChen/vue-element-admin)

- [electron-vue-admin](https://github.com/PanJiaChen/electron-vue-admin)

- [vue-typescript-admin-template](https://github.com/Armour/vue-typescript-admin-template)

- [awesome-project](https://github.com/PanJiaChen/vue-element-admin/issues/2312)

## Browsers support

Modern browsers and Internet Explorer 10+.

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari |
| --------- | --------- | --------- | --------- |
| IE10, IE11, Edge| last 2 versions| last 2 versions| last 2 versions

## License

[MIT](https://github.com/PanJiaChen/vue-admin-template/blob/master/LICENSE) license.

Copyright (c) 2017-present PanJiaChen


## 基于花裤衩的template改造 如果你是新clone的temolate项目请按照下方的操作

# 1 删除多余的路由只保留一个login和dashboard
    ---router/index.js

# 2 关闭eslint校验 （很烦）
    ---vue.config.js   30行的 lintOnSave改为false  

# 3 在src/api文件夹下 新建一个index.js
     在这个index.js文件中  导入request方法（用于请求接口）：import request from '@/utils/request'
     
     在里面写自己的登录接口 用户详情接口
     例子:  
     // 登录
     export function login(data) {
          return request({
           url: '/admin/api/login',
           method: 'post',
           data
         })
       }

# 4 更改登录、获取用户信息、获取路由等api---找到store/modules/user.js
    引入api/index.js(引入接口获取数据api)

    改造34行的结构赋值根据后台要求看传入的是什么key
    例子:
    const { loginame, password } = userInfo

    改造36行的 login方法的key值:根据后台要求更改
    例子:
    login({ loginame: loginame.trim(), password: password }).then.......

# 5 改造login/index.vue
    登录页面的用户名和密码的key值要与后台需要的一致
    第 15 行和第 77 行的username和password:改成你第5步刚修改的key要保持一致

# 6 改造反向代理  修改vue.config.js 
    在第39行下面添加属于你项目的反向代理
    例子:
       proxy:{
      //配置跨域
      '/api':{
        target:'https://demo.it98k.cn',
        //ws:true,
        changeOrigin:true,
        pathRewrite:{
          '^api':"/"
        }
      }
    },

    注释掉 before: require('./mock/mock-server.js') 这是项目自带的mock数据
    
# 7 修改.env.development文件的第5行改成配置跨域的地址
    例子:
    VUE_APP_BASE_API = '/api'
# 8 修改src/utils/request.js ：请求拦截携带 X-Token 改成我们自己后端需要的 token; 响应拦截中 49行根据后台返回的成功字段修改 这里我们后端是200
    修改 requset.js 第22行改成自己项目的token
    例子:config.headers['token'] = getToken()

    例子:
    if (res.code !== 200) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
    }

# 9 修改src/store/modules/user.js
   顶部的@/api/index中 增加获取用户信息的接口
   例子:
   import { login, getUserInfo, getMoveRouter } from '@/api/index'
   
   修改49行的getInfo方法,将原来的请求用户信息的api替换成我们自己写的接口api方法getUserInfo
   在store/modules/user.js 新增action 路由获取的方法

    例子:
   getRouter({ commit, state }) {
        return new Promise((resolve, reject) => {
            //根据项目需求是否需要传值
            getMoveRouter().then(response => {
                const menus = response.data
                menus.push(
                    { path: '/404', component: "404", hidden: true }, 
                    { path: '*', redirect: "/404", hidden: true }
                )
                commit('SET_MENUS', menus) //保存路由
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },

   记得 在获取路由的请求当中增加2个404页面
   例子:
   menus.push(
          { path: '/404', component: "404", hidden: true },
          { path: '*', redirect: "/404", hidden: true }
        )
   在mutations中增加保存路由表的方法
   例子:
    SET_MENUS:(state,menus)=>{
    state.menus = menus
  }

  在getDefaultState = () 添加menus的字段
  例子:
  return {
    token: getToken(),
    name: '',
    avatar: '',
    menus: [], //存放路由列表
  }

# 10 登录成功后如果看不到页面中的name就继续修改src/store/modules/user.js
    查看返回的是不是name 不是就替换成自己的name变量
    头像不展示:  修改Navbar.vue 第10行删除avatar变量后面的后缀

# 11 在src/router文件夹下 新建两个开发环境和生产环境的js
  例子:
  _import_development.js  //开发环境
  内容为:
  module.exports = file => require('@/views/' + file + '.vue').default

  _import_production.js  //生产环境
  内容为:
  module.exports = file => () => import('@/views/' + file + '.vue')

# 12 在src/permission.js 引入第14步 新建的文件
 在第8行添加获取组件的方法
 const _import= require('./router/_import_'+process.env.NODE_ENV) //获取组件的方法
 引入封装的Layout
 import Layout from '@/layout'
 
 将请求用户信息方法下面的next() 注释掉  
 
 添加 await store.dispatch('user/自己的获取路由方法') 在请求用户信息方法下面

# 13 修改store/getters.js
    增加 menus: state => state.user.menus,

# 14  在permission.js 中请求路由方法下面添加两个方法 修改try的内容
    两个方法：----------------
    function filterAsyncRouter(asyncRouterMap) { //遍历后台传来的路由字符串，转换为组件对象
        const accessedRouters =_.filter(asyncRouterMap, route => {
            if (route.component) {
            if (route.component === 'Layout') { //Layout组件特殊处理
                route.component = Layout
            } else {
                route.component = _import(route.component)
            }
            }
            if (route.children && route.children.length) {
            route.children = filterAsyncRouter(route.children)
            }
            return true
        })
        return accessedRouters
    }
    ------------------------------------------------------------------
    function routerGo(to, next) {
        const getRouter = filterAsyncRouter(store.getters.menus) // 过滤路由
        router.addRoutes(getRouter) // 动态添加路由
        global.antRouter = getRouter // 将路由数据传递给全局变量，做侧边栏菜单渲染工作
        next({...to, replace: true})
    }
    ------------------------------------------------------------------
    try中内容修改为：
    // 获取用户信息
    await store.dispatch('user/getInfo')
    // 获取路由
    await store.dispatch('user/getRouter')
    if(store.getters.menus.length < 1) {
        global.antRouter = []
        next()
    }
    routerGo(to, next)

# 15 找到src/layout/components/Slidebar/index.vue 修改修改左侧路由导航routes()的内容：
   return this.$router.options.routes.concat(global.antRouter)

<!-- 新建文件的时候 记得看后台的返回的路径 而不是过滤后的 -->

# 16  后台数据格式
  {
    "code": 200,
    "data": [
        {
            "_id": "5f608dbed100b605c9a25b4b",  //路由id
            "hidden": false,  //true 的话不会展示
            "permissions": "",
            "sort": 99,  //排序
            "pid": "0",  //上级的id
            "type": "1",//路由级别  1级路由
            "title": "系统管理", //路由的名称
            "path": "/system", //文件路径名
            "component": "Layout",  // 一级的路由component 必须为Layout
            "redirect": "noRedirect",
            "alwaysShow": true,   //如果为true 就会在只有一级路由的时候也展示跟菜单 false 在只有一级路由的情况下 只展示子路由
            "date": "2020-09-15T09:47:42.953Z",
            "__v": 0,
            "meta": {
                "title": "系统管理",
                "icon": "el-icon-s-platform", //icon图标
                "roles": []
            },
            //子路由
            "children": [
                {
                    "_id": "5f608dd6d100b605c9a25b4c",
                    "hidden": false,
                    "permissions": "",
                    "sort": 10,
                    "pid": "5f608dbed100b605c9a25b4b",
                    "type": "2",
                    "title": "菜单管理",
                    "path": "/system/menu",
                    "component": "system/menu/index",
                    "name": "menu",
                    "date": "2020-09-15T09:48:06.415Z",
                    "__v": 0,
                    "meta": {
                        "title": "菜单管理",
                        "icon": "el-icon-menu",
                        "roles": [
                            "edit",
                            "add"
                        ]
                    },
                    "hasChildren": 0
                },
                {
                    "_id": "5f62181ac63b430480071e81",
                    "hidden": false,
                    "permissions": "",
                    "sort": 7,
                    "pid": "5f608dbed100b605c9a25b4b",
                    "type": "2",
                    "title": "角色管理",
                    "path": "/system/roles",
                    "component": "system/roles/index",
                    "name": "roles",
                    "date": "2020-09-16T13:50:18.142Z",
                    "__v": 0,
                    "meta": {
                        "title": "角色管理",
                        "icon": "el-icon-s-flag",
                        "roles": [
                            "add",
                            "edit",
                            "delete"
                        ]
                    },
                    "hasChildren": 0
                },
                {
                    "_id": "5f63658b0fa6424b794d15ce",
                    "hidden": false,
                    "permissions": "",
                    "sort": 8,
                    "pid": "5f608dbed100b605c9a25b4b",
                    "type": "2",
                    "title": "用户管理",
                    "path": "/system/user",
                    "component": "system/user/index",
                    "name": "user",
                    "date": "2020-09-17T13:32:59.379Z",
                    "__v": 0,
                    "meta": {
                        "title": "用户管理",
                        "icon": "el-icon-user-solid",
                        "roles": [
                            "add",
                            "edit",
                            "delete"
                        ]
                    },
                    "hasChildren": 0
                }
            ],
        }
    ]
    "message": "获取路由成功"
}

# vue_admin_template
