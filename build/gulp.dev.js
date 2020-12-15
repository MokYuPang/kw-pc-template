const gulp = require('gulp')
const util = require('gulp-util') // 打印信息
const sass = require('gulp-sass') // 编译sass
const fileInclude = require('gulp-file-include') // 文件模块化
const rename = require("gulp-rename") // 重置输出路径

const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')
const postcss = require('gulp-postcss')

const webpack = require('webpack')
const webpackConf = require('./webpack.config')

// 打包html
async function html(path) {
  await gulp.src(path)
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

// webpack打包js
async function js(path) {
  const pathArr = path.split('\\')
  const entry = {}
  if (path.indexOf('app\\')) {
    entry[pathArr[2]] = './' + pathArr.slice(0, 3).join('/') + '/' + pathArr[2] + '.enter.js'    
  }
  webpackConf.entry = entry
  webpack(webpackConf, function(err, stats) {
    if (err) {
      console.log(err)
      util.log(util.colors.red('[Error]'), err.toString())
    }
  })
}

// 打包css
async function css(path) {
  await gulp.src(path)
  .pipe(sass().on('error', sass.logError))
  .pipe(postcss([
    autoprefixer(),
    cssnano
  ]))
  .pipe(rename(function(path) {
    return {
      dirname: '/',
      basename: path.basename.split('.')[0],
      extname: path.extname
    }
  }))
  // .pipe(cleancss())
  .pipe(gulp.dest('dist/css'))
}

// 拷贝image
async function image(path) {
  await gulp.src(path)
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

//拷贝lib
async function lib(path) {
  await gulp.src(path)
  .pipe(rename(function(path) {
    return {
      dirname: path.dirname.split('\\')[2],
      basename: path.basename,
      extname: path.extname
    }
  }))
  .pipe(gulp.dest('dist/lib'))
}

module.exports = {
  html,
  js,
  css,
  image,
  lib
}