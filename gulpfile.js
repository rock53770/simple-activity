var gulp = require('gulp');
var bs = require('browser-sync').create();
var zip = require('gulp-zip');
var less = require('gulp-less');
var proxy = require('http-proxy-middleware');
var clean = require('gulp-clean');
var sequence = require('run-sequence');


gulp.task('server', function() {
    var files = [
        'page/**/*.html',
        'css/**/*.less',
        'js/**/*.js'
    ];
    bs.watch(files, function (event, file) {
        if (event === "change") {
            bs.reload();
        }
    });

    gulp.watch('css/**/*.less', ['less']);

    // 提供过滤器以被重新加载阻止不需要的文件
    gulp.task('less', function () {
        return gulp.src('css/**/*.less')
            .pipe(less())
            .pipe(gulp.dest('css'))
            // .pipe(bs.stream({match: "**/*.css"}));
    });
    gulp.start('less');

    bs.init({
        server: {
            baseDir: "./",
            middleware:  proxy("/api", {
                // target: 'http://192.168.129.192:8081',
                // target: 'http://prepinsuranceapixxb.bz-ins.com/',
                target: 'http://wxtest.bz-ins.com/',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '/api'
                }
            })
        },
        open: "external"
    });
});



var files = [
    'page/**/*',
    'css/**/*.css',
    'images/**/*',
    'img/**/*',
    'plugins/**/*',
    'index.html'
];
gulp.task("copyFile", function () {
    return gulp.src(files, {base: '.'})
        .pipe(gulp.dest("dist"))
})
//清空dist目录
gulp.task("clean", function () {
    console.log('清空 dist 目录下的资源')
   return gulp.src('dist/*', {
        read: false
    })
     .pipe(clean({
        force: true
    }));
})
//生成生产war包
gulp.task("package", function () {
    gulp.src(['dist/**']).pipe(zip('dist.zip')).pipe(gulp.dest('dist'));
    console.info('package ok!');
});


gulp.task('copy', function (callback) {
    sequence('clean', 'copyFile',callback)
})
gulp.task('default', ["server"]);



