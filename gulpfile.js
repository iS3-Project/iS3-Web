/**
 * @file The config file for gulp.
 * @author Lin Xiaodong<linxdcn@gmail.com>
 */
var gulp = require('gulp');
var minifycss = require('gulp-minify-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var jshint = require('gulp-jshint');
var connect = require('gulp-connect');

var jsOrder = [
    'app/js/core/iS3.js',
    'app/js/basic/*.js',
    'app/js/core/projectDef/ProjectDef.js',
    'app/js/core/projectDef/*.js',
    'app/js/core/*.js',
    'app/js/layertree/Layertree.js',
    'app/js/layertree/*.js',
    'app/js/layertree/layerContainer/BasicContainer.js',
    'app/js/layertree/layerContainer/*.js',
    'app/js/toolbar/Toolbar.js',
    'app/js/toolbar/*.js',
    'app/js/format/format.js',
    'app/js/format/*.js',
    'app/js/**/*.js'
];

gulp.task('jshint', function () {
    return gulp.src('app/js/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('concatcss', function () {
    return gulp.src('app/css/**/*.css')
        .pipe(concat('webgis-debug.css'))
        .pipe(gulp.dest('build/css'));
});

gulp.task('concatjs', function () {
    return gulp.src(jsOrder)
        .pipe(concat('webgis-debug.js'))
        .pipe(gulp.dest('build/js'));
});

gulp.task('minifycss', function () {
    return gulp.src('app/css/**/*.css')
        .pipe(concat('webgis.min.css'))
        .pipe(minifycss())
        .pipe(gulp.dest('build/css'));
});

gulp.task('minifyjs', function () {
    return gulp.src(jsOrder)
        .pipe(concat('webgis.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('build/js'));
});

gulp.task('copydebughtml', function () {
    gulp.src('app/index-debug.html')
        .pipe(concat('index.html'))
        .pipe(gulp.dest('build'));

    gulp.src('./config.json')
        .pipe(gulp.dest('build'));
});

gulp.task('copyhtml', function () {
    gulp.src('app/*.html')
        .pipe(gulp.dest('build'));

    gulp.src('./config.json')
        .pipe(gulp.dest('build'));
});

gulp.task('copyexternal', function () {
    gulp.src('external/**/*')
        .pipe(gulp.dest('build/external'));
});

gulp.task('copyimg', function () {
    gulp.src('app/img/*.*')
        .pipe(gulp.dest('build/img'));
});

gulp.task('copyall', function () {
    gulp.start('copyhtml', 'copyexternal', 'copyimg');
});

gulp.task('watch', function () {
    gulp.watch('app/js/**/*.js', function () {
        gulp.run('concatjs');
    });
    gulp.watch('app/css/**/*.css', function () {
        gulp.run('concatcss');
    });
    gulp.watch('app/*.*', function () {
        gulp.run('copydebughtml');
    });
});

gulp.task('connect', function () {
    connect.server({
        root: 'build',
        port: 9080,
        livereload: true
    });
});

gulp.task('reload', function () {
    gulp.watch(['build/*.html', 'build/js/**/*.js', 'build/css/**/*.css'], function () {
        connect.reload();
    });
});
/*
gulp.task('default', ['jshint'], function () {
    gulp.start('concatjs', 'concatcss', 'minifyjs', 'minifycss', 'copyall');
});

gulp.task('debug', ['jshint'], function () {
    gulp.start('concatjs', 'concatcss', 'copydebughtml', 'copyexternal', 'copyimg', 'connect', 'reload', 'watch');
});

gulp.task('build', ['jshint'], function () {
    gulp.start('concatjs', 'concatcss', 'minifyjs', 'minifycss', 'copyall');
});
*/

gulp.task('default', function () {
    gulp.start('concatjs', 'concatcss', 'minifyjs', 'minifycss', 'copyall');
});

gulp.task('debug', function () {
    gulp.start('concatjs', 'concatcss', 'copydebughtml', 'copyexternal', 'copyimg', 'connect', 'reload', 'watch');
});