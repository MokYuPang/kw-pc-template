## 多页面应用的前端开发框架

### 服务
使用`gulp@4.0.2`+`browser-sync@2.26.13`搭建开发环境服务，实现hot-reload资源，`webpack@4.44.2`+`babel@7.12.3`编译打包ES6+

### 开启服务
* `gulp` 或者 `npm run dev`
* 编辑页面保存，生成dist后服务自动初始化并打开浏览器
* 首次使用先打包所有的资源`gulp build` 或者 `npm run build`

### 打包所有资源
`gulp build`或者`npm run build`

### 打包工具
* gulp@4.0.2

实现功能: 
```bash
1、搭建开发环境服务：实时编译更新html、css，实时更新js
2、单独打包css
3、单独打包html
4、单独打包图片
5、打包所有的资源
```

* webpack@4.44.2

实现功能：
```bash
1、压缩打包js
2、`babel@7.12.3`编译js文件，可用es6、es7编写脚本
```

### html
* 单独打包所有的html： `gulp html`
* 开发环境：监控变更的html及其引用资源，如js、css、图片，并输出到dist目录
* 首次变更资源，服务器自动开启新的浏览器窗口查看视图监控
* 重复变更同个页面资源时，只hot-reload
* 公共html放在`common/include`目录下，引用方式：`@@include('*.html'[, options])`, options为需要传入`*.html`的参数，无则不传
* html文件创建规则：文件放在`src/app/**/`下，比如首页文件路径为`src/app/index/index.html`，登录页为`src/app/login/login.html`
* `*.html`引用js、css文件方式，直接引用dist打包好的js、css, 即`<link href="css/*.css"> <script src="js/*.js"></script>`

### js
* 单独打包所有的js：`gulp js`
* 公共js放在`common/js`目录下，`*.enter.js`引用公共js：`import '../../common/js/*.js'`
* 任何的其它脚本引用都通过`import`命令引入到`*.enter.js`中
* 页面主要的js文件命名规则：一级名称与html文件名一直，二级名称为enter，如首页的脚本为`index.enter.js`，路径与html同级，为`src/app/index/index.enter.js`

### css
* 单独打包所有的js：`gulp css`
* 命名规则与js一致
* 任何的样式文件应用都通过`@import '文件名';`引入到`*.enter.scss`中

### image、icons
* 单独打包所有的image：`gulp image`
* 单独打包所有的icons：`gulp icons`
* 所有的image图片放在`common/images`目录下
* 所有icons放在`common/icons`目录下
* img标签引用图片：`<img src="image/demo.jpg">` 样式引用背景图片`background: url('/image/code.png') no-repeat 100%/100%;`

### common
* 修改`common/**`目录下的文件时，要使所有引用到的文件更新，则重新打包所有资源：`gulp build`
