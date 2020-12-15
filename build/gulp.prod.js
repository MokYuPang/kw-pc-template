const gulp = require('gulp')
const util = require('gulp-util') // 打印信息
const cleancss = require('gulp-clean-css')
const sass = require('gulp-sass') // 编译sass
const autoprefixer = require('autoprefixer')
const sprites = require('postcss-sprites') //图标合并
const cssnano = require('cssnano')
const postcss = require('gulp-postcss')
const imagemin = require('gulp-imagemin')
const fileInclude = require('gulp-file-include') // 文件模块化
const rename = require("gulp-rename") // 重置输出路径
const glob = require('glob')

const webpack = require('webpack')
const webpackConf = require('./webpack.config')

// 拷贝页面模板
async function htmlAll() {
  await gulp.src('src/app/**/*.html')
  .pipe(fileInclude({ // HTML模板替换
    prefix: "@@",
    basepath: "./src/common/include/"
  }))
  .pipe(rename(function(name) {
    return {
      dirname: '/',
      basename: name.basename,
      extname: name.extname
    }
  }))
  .pipe(gulp.dest('dist'))
}

//使用webpack打包js
async function jsAll() {
  const entry = {}
  glob.sync('./src/**/**/*.enter.js').forEach(function(name) {
    const path = name.split('/')
    entry[path[path.length - 2]] = name
  })
  webpackConf.entry = entry
  webpack(webpackConf, function(err, stats) {
    if (err) {
      util.log(util.colors.red('[Error]'), err.toString())
    }
  })
}

// 拷贝css文件
async function cssAll() {
  await gulp.src(['src/app/**/*.enter.scss'])
  .pipe(sass().on('error', sass.logError))
  .pipe(postcss([
    autoprefixer(),
    cssnano
  ]))
  .pipe(rename(function(path) {
    return {
      dirname: '/',
      basename: path.dirname,
      extname: path.extname
    }
  }))
  .pipe(cleancss())
  .pipe(gulp.dest('dist/css'))
}

// 拷贝image
async function imageAll() {
  await gulp.src(['src/common/images/*', 'src/app/**/images/*'])
  // .pipe(imagemin())
  .pipe(rename(function(path) {
    return {
      dirname: '/',
      basename: path.basename,
      extname: path.extname
    }
  }))
  .pipe(gulp.dest('dist/image'))
}

// 拷贝icons
async function iconsAll() {
  await gulp.src(['src/common/icons/*', 'src/app/**/icons/*'])
  .pipe(
    sprites({
      spritePath: 'dist/icons/',
      filterBy: function(image) {
        if (image.url.indexOf('images/') === -1) {
          return Promise.resolve()
        }
        return Promise.reject()
      }
    })
  )
  .pipe(rename(function(path) {
    return {
      dirname: '/',
      basename: path.basename,
      extname: path.extname
    }
  }))
  .pipe(gulp.dest('dist/icons'))
}

//拷贝lib
async function lib() {
  await gulp.src('src/lib/**/*')
  .pipe(gulp.dest('dist/lib'))
}

module.exports = {
  htmlAll,
  jsAll,
  cssAll,
  imageAll,
  iconsAll,
  lib
}