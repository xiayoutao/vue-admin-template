# tms-admin


## 命令行
```
启动
npm run dev

打包
npm run build

打包生成报告
npm run build -- --report
```

## 开发注意事项
> 图片资源放在assets目录下  
> 重写elementui的样式统一放在src/styles/resetElement.scss文件中

### element组件使用阿里图标库，如下
```
<el-button icon="iconfont icon-phone_fill"></el-button>
```

## 项目结构
```
├── dist                      打包文件
├── public                    静态文件资源
└── src
    ├── api                   接口文件
    ├── assets                图片资源
    ├── components            公共组件
    ├── constants             常亮
    ├── directives            Vue自定义指令
    ├── layouts               项目布局组件
    ├── mixins                Vue混合
    ├── plugins               Vue自定义插件
    ├── router                路由文件
    ├── store                 状态管理
    ├── styles                样式表
    ├── utils                 工具类
    ├── views                 页面
    │   ├── common            通用页面
    │   ├── dashboard.vue     首页
    │   └── ...
    │── .env.development      本地环境
    │── .env.production       正式环境
    │── .env.release          预发布环境
    │── .eslintignore
    │── .eslintrc.js          eslint规则
    │── .env.release          预发布环境
    │── .gitignore
    │── .prettierignore
    │── .prettierrc.js        prettier规则
    │── .stylelintignore
    │── .stylelintrc.js       stylelint规则。配置有点问题
    │── babel.config.js
    │── package.json
    │── README.md
    │── tsconfig.json
    └── vue.config.js
```