'use strict';

// 实现这个项目的构建任务
const del = require('del')
const { src, dest, series, parallel } = require('gulp')

const loadPlugins = require('gulp-load-plugins')
const plugins = loadPlugins()

const cwd = process.cwd()

let config = {
    baseSrc: 'src',
    ouput: 'dist',
    css: 'assets/styles/*.css',
    js: 'assets/js/*.js',
    html: 'views/*.html',
    img: 'assets/img/*{.jpg, .jpeg, svg, .png}',
    public: 'public'
}

try {
    config = Object.assign({}, config, require(cwd + '/path.config.js'))
} catch (err) {}

// 清楚
const clean = () => {
    return del([config.ouput])
}

// css样式编译
const style = () => {
    return src(config.css, { base: cwd, cwd: config.baseSrc })
            .pipe(plugins.cleanCss())
            .pipe(dest(config.ouput))
}

// 图片编译
const img = () => {
    return src(config.img, { base: config.baseSrc, cwd: config.baseSrc })
            .pipe(plugins.imagemin())
            .pipe(dest(config.ouput))
}

// js脚本编译
const scripts = () => {
    return src(config.js, { base: config.baseSrc, cwd: config.baseSrc })
            .pipe(plugins.uglify())
            .pipe(dest(config.ouput))
}

// html编译
const pages = () => {
    return src(config.html, { base: config.baseSrc, cwd: config.baseSrc })
            .pipe(plugins.htmlmin({ collapseWhitespace: true, minifyCSS: true,   minifyJS: true}))
            .pipe(dest(config.ouput))
}

// 额外文件拷贝
const extra = () => {
    return src('**/**', { base: config.public, cwd: config.public })
            .pipe(dest(config.ouput))
}

const compose = parallel(style, pages, scripts, img, extra)

const minFile = series(clean, compose)

module.exports = {
    minFile
}
