'use strict';

var gulp = require('gulp'), // Подключаем Gulp
    sass = require('gulp-sass'), // Подключаем Sass пакет https://github.com/dlmanning/gulp-sass
    browserSync = require('browser-sync').create(), // Подключаем Browser Sync
    reload = browserSync.reload,
    concat = require('gulp-concat'), // Подключаем gulp-concat (для конкатенации файлов)
    uglify = require('gulp-uglifyjs'), // Подключаем gulp-uglifyjs (для сжатия JS)
    cssnano = require('gulp-cssnano'), // Подключаем пакет для минификации CSS
    concatCss = require('gulp-concat-css'),
    rename = require('gulp-rename'), // Подключаем библиотеку для переименования файлов
    del = require('del'), // Подключаем библиотеку для удаления файлов и папок
    imagemin = require('gulp-imagemin'), // Подключаем библиотеку для работы с изображениями
    pngquant = require('imagemin-pngquant'), // Подключаем библиотеку для работы с png
    cache = require('gulp-cache'), // Подключаем библиотеку кеширования
    autoprefixer = require('gulp-autoprefixer'), // Подключаем библиотеку для автоматического добавления префиксов
    sourcemaps = require('gulp-sourcemaps'), // Подключаем Source Map для дебагинга sass-файлов https://github.com/floridoo/gulp-sourcemaps
    fileinclude = require('gulp-file-include'),
    markdown = require('markdown'),
    htmlbeautify = require('gulp-html-beautify'), // Причесываем
    fs = require('fs'), // For compiling modernizr.min.js
    modernizr = require('modernizr'), // For compiling modernizr.min.js
    config = require('./modernizr-config'), // Path to modernizr-config.json
    replace = require('gulp-string-replace'),
    strip = require('gulp-strip-comments'),
    removeEmptyLines = require('gulp-remove-empty-lines'),
    babel = require('gulp-babel')
;

/**
 * @description Относительный путь
 * @type {{dist: string}}
 */
var path = {
  plugins: 'src/plugins',
  dist: 'dist',
  minPlugin: '_example-plugin/1', // Название и версия плагина, который нужно минифицировать. Например: 'drop/1'
  clearComments: '_example-plugin/1', // Название и версия плагина, в который нужно удалить комменты. Например: 'drop/1'
};

/**
 * @description Таск формирует ДОМ страниц
 */
gulp.task('htmlCompilation', function () {
  return gulp.src(['src/**/__*.html'], {base: './'})
      .pipe(fileinclude({
        filters: {
          markdown: markdown.parse
        }
      }))
      .pipe(rename(function (path) {
        path.basename = path.basename.substr(2);
      }))
      .pipe(htmlbeautify({
        // "indent_with_tabs": true,
        "indent_size": 2,
        "max_preserve_newlines": 0
      }))
      // .pipe(gulp.dest('./src/'));
      .pipe(gulp.dest('./'));
});

/**
 * @description Таск преобразует sass в css
 */
gulp.task('sassCompilation', function () {
  return gulp.src([
    '!src/libs/**/*.+(scss|sass)',
    '!src/sass/plugins/**/*.+(scss|sass)',
    'src/**/*.+(scss|sass)'
  ], {base: './'})
      .pipe(sourcemaps.init())
      .pipe(sass({
        outputStyle: 'expanded',
        indentType: 'space',
        indentWidth: 2,
        precision: 3,
        linefeed: 'lf'
      }).on('error', sass.logError))
      // .pipe(replace('../../', '../')) /// в css файлах меняем пути к файлам с ../../ на ../
      .pipe(autoprefixer([
        'last 5 versions', '> 1%', 'ie >= 10', 'and_chr >= 2.3'
      ], {
        cascade: true
      }))
      .pipe(sourcemaps.write('./'))
      // .pipe(gulp.dest('./src/css'))
      .pipe(gulp.dest('./'))
      .pipe(browserSync.reload({
        stream: true
      }));
});

/**
 * @description Таск для мержа css библиотек
 */
gulp.task('mergeCssLibs', function () {
  return gulp.src([
    'src/css/temp/*.css'
    , 'src/libs/highlightjs/styles/github-gist.css'
  ])
      .pipe(concatCss("src/sass/libs.css", {
        rebaseUrls: false
      }))
      .pipe(gulp.dest('./'))
      .pipe(cssnano())
      .pipe(rename({suffix: '.min'}))
      .pipe(gulp.dest('./'));
});

/**
 * @description Таск для мераж js библиотек
 */
gulp.task('copyLibsScriptsToJs', ['copyJqueryToJs', 'copyJqueryUiJs', 'copyJqueryUiCss'], function () {
  return gulp.src([
    'src/libs/device.js/lib/device.min.js' // определение устройств
    , 'src/libs/jquery-smartresize/jquery.debouncedresize.js' // "умный" ресайз
    , 'src/libs/highlightjs/highlight.pack.min.js' // подсветка кода
    , 'src/libs/clipboard/dist/clipboard.min.js' // копирование в буфер
  ])
      .pipe(concat('libs.js'))
      .pipe(gulp.dest('src/js'))
      .pipe(rename({suffix: '.min'}))
      .pipe(uglify())
      .pipe(gulp.dest('src/js'));
});

/**
 * @description Таск для копирования jquery в js папку
 */
gulp.task('copyJqueryToJs', function () {
  return gulp.src([
    'src/libs/jquery/dist/jquery.min.js'
  ])
      .pipe(gulp.dest('src/js'));
});

/**
 * @description Таски для копирования jquery-ui в js папку
 */
gulp.task('copyJqueryUiJs', function () {
  return gulp.src([
    'src/libs/jquery-ui/jquery-ui.min.js'
  ])
      .pipe(gulp.dest('src/js/jquery-ui'));
});
gulp.task('copyJqueryUiCss', function () {
  return gulp.src([
    'src/libs/jquery-ui/themes/base/base.css'
    , 'src/libs/jquery-ui/themes/base/spinner.css'
  ])
      .pipe(concatCss("jquery-ui.css", {
        rebaseUrls: false
      }))
      .pipe(gulp.dest('src/js/jquery-ui'));
});

// babel
// gulp.task('babelJsConvert', function () {
// 	gulp.src('src/js/example.js')
// 		.pipe(babel({
// 			presets: ['env']
// 		}))
// 		.pipe(gulp.dest('src/js/babel/'))
// });

/**
 * @description Таск browserSync
 */
gulp.task('browserSync', function (done) {
  browserSync.init({
    server: {
      baseDir: "./src"
    },
    open: false,
    notify: false
  });
  browserSync.watch(['!src/libs/**', 'src/**/_*.html', 'src/**/*.js', 'src/**/*.css', 'src/includes/**/*.json', 'src/includes/**/*.svg']).on("change", browserSync.reload);
  done();
});

/**
 * @description Таск наблюдения за изменением файлов
 */
gulp.task('watch', ['browserSync', 'htmlCompilation', 'sassCompilation', 'mergeCssLibs', 'copyLibsScriptsToJs'], function () {
  gulp.watch(['src/**/_tpl_*.html', 'src/**/__*.html', 'src/includes/**/*.json'], ['htmlCompilation']);
  gulp.watch([
    '!src/libs/**/*.+(scss|sass)',
    '!src/sass/plugins/**/*.+(scss|sass)',
    'src/**/*.+(scss|sass)'
  ], ['sassCompilation']);
});

/**
 * @description Таск watch определяем как дефолтный
 */
gulp.task('default', ['watch']);


/************************************************************
 * Clear comments
 ************************************************************/
/**
 * @description Таск удаления комментов в js файлах
 */
gulp.task('clearComments:create', ['clearComments:remove'], function () {
  return gulp.src(['src/plugins/' + path.clearComments + '/js/jquery.*.js'], {base: './'})
      .pipe(rename({suffix: '.nocomments'}))
      .pipe(strip({
        safe: true,
        // ignore: /^!/,
        trim: true
      }))
      // .pipe(removeEmptyLines())
      .pipe(gulp.dest('./'));
});
/**
 * @description Таск удаления минифицированых версий js файлов
 */
gulp.task('clearComments:remove', function () {
  return del.sync(['src/plugins/' + path.minPlugin + '/js/jquery.*.nocomments.js']);
});


/************************************************************
 * Minify js plugins
 ************************************************************/
/**
 * @description Таск минификации js файлов
 */
gulp.task('minifyJsPlugins:create', ['minifyJsPlugins:remove'], function () {
  return gulp.src(['src/plugins/' + path.minPlugin + '/js/jquery.*.js'], {base: './'})
      .pipe(rename({suffix: '.min'}))
      .pipe(uglify({
        output: {
          comments: /^.?!/
        }
      }))
      .pipe(gulp.dest('./'));
});
/**
 * @description Таск удаления минифицированых версий js файлов
 */
gulp.task('minifyJsPlugins:remove', function () {
  return del.sync(['src/plugins/' + path.minPlugin + '/js/jquery.*.min.js']);
});


/************************************************************
 * Create Distribution folder and move files to it
 ************************************************************/

gulp.task('copyImgToDist', function () {
  return gulp.src('src/img/**/*')
      .pipe(cache(imagemin({ // Сжимаем их с наилучшими настройками с учетом кеширования
        interlaced: true,
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        optimizationLevel: 7, //степень сжатия от 0 до 7
        use: [pngquant()]
      })))
      .pipe(gulp.dest('dist/img')); // Выгружаем на продакшен
});

gulp.task('build', ['cleanDistFolder', 'htmlCompilation', 'copyImgToDist', 'sassCompilation', 'mergeCssLibs', 'copyLibsScriptsToJs'], function () {

  gulp.src('src/css/*.css')
      .pipe(gulp.dest('dist/css'));

  gulp.src('src/fonts/**/*') // Переносим шрифты в продакшен
      .pipe(gulp.dest('dist/fonts'));

  gulp.src('src/assets/**/*') // Переносим дополнительные файлы в продакшен
      .pipe(gulp.dest('dist/assets'));

  gulp.src(['!src/js/temp/**/*.js', '!src/js/**/temp-*.js', 'src/js/*.js']) // Переносим скрипты в продакшен
      .pipe(gulp.dest('dist/js'));

  gulp.src(['!src/__*.html', '!src/ajax*.html', '!src/temp*.html', 'src/forms.html', '!src/_tpl_*.html', 'src/*.html']) // Переносим HTML в продакшен
      .pipe(gulp.dest('dist'));

  gulp.src(['src/*.png', 'src/*.ico', 'src/.htaccess']) // Переносим favicon и др. файлы в продакшин
      .pipe(gulp.dest('dist'));

});

/**
 * @description Таск удаления релизной папки
 */
gulp.task('cleanDistFolder', function () {
  return del.sync(['dist/']);
});

/**
 * @description Таск очистки кэша
 */
gulp.task('clearCache', function () {
  return cache.clearAll();
});