const gulp = require('gulp')
const browserSync = require('browser-sync').create() // bs服务
const { createProxyMiddleware } = require('http-proxy-middleware') // api代理中间件

const dev = require('./build/gulp.dev')
const prod = require('./build/gulp.prod')

const { proxy, proxyUser } = require('./build/config')
const proxyArr = []
proxy.table.forEach(key => {
  proxyArr.push(createProxyMiddleware(key, {
    target: proxy.target,
    changeOrigin: true
  }))
})
// proxyUser.table.forEach(key => {
//   proxyArr.push(createProxyMiddleware(key, {
//     target: proxyUser.target,
//     changeOrigin: true
//   }))
// })

gulp.task('html', prod.htmlAll) // 打包html
gulp.task('css', prod.cssAll) // 打包css
gulp.task('js', prod.jsAll) // 打包js
gulp.task('image', prod.imageAll) // 打包js
gulp.task('lib', prod.lib) // 打包js
gulp.task('build', gulp.parallel('html','js', 'css', 'image', 'lib')) // 打包html、js、css、image等资源

// 开发环境-实时监听修改的文件，并打包输出到dist
gulp.task('default', async() => {
  gulp.watch(['src/app/**/*.html']).on('change', dev.html) // 监控html
  gulp.watch(['src/app/**/*.enter.js', 'src/app/**/*/*.js']).on('change', dev.js) // 监控js
  gulp.watch(['src/app/**/*.enter.scss']).on('change', dev.css) // 监控css
  gulp.watch(['src/common/images/*', 'src/app/**/images/*']).on('change', dev.image) // 监控image
  gulp.watch(['src/lib/**/*']).on('change', dev.lib) // 监控lib
  
  // bs服务
  let currentFile = ''
  gulp.watch(['dist/*.html', 'dist/css/*.css', 'dist/js/*.js']).on('change', async function(path) {
    let filename = '' // 修改的文件
    let indexFile = '' // bs监控的html文件
    const type = path.split('.')[1] // 文件类型

    // 修改的是html文件，bs直接监控html文件
    if (type === 'html') {
      filename = path.split('\\')[1]
      indexFile = filename
    } else {
      // 修改的非html文件，bs监控其对应的html文件
      filename = path.split('\\')[2]
      indexFile = path.split('\\')[2].split('.')[0] + '.html'
    }

    // 修改公用样式，reload common.css
    if (filename.indexOf('common') > -1) {
      if (browserSync.active) {
        browserSync.reload('css/common.css')
      }
      return
    }

    // 第一次编辑的文件，bs监控其html
    if (!currentFile) {
      currentFile = indexFile
    }

    //未开启bs时，初始化bs
    if (!browserSync.active) {
      browserSync.init({
        server: {
          baseDir: 'dist',
          index: indexFile,
          middleware: proxyArr
        }
      })
    } else {
      // 已开启bs，并编辑同一个资源文件时，直接reload
      if(currentFile === indexFile) {
        let path = ''
        if (type === 'html') {
          path = filename
        } else {
          path = type + '/' + filename
        }
        browserSync.reload(path)
      } else {
        // 编辑其他页面资源时，先退出当前bs，重新初始化
        browserSync.exit()
        // 更新bs监控的文件
        currentFile = indexFile
        browserSync.init({
          server: {
            baseDir: 'dist',
            index: indexFile,
            middleware: proxyArr
          }
        })
      }
    }
  })
})