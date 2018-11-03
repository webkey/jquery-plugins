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
	stripCssComments = require('gulp-strip-css-comments'), // Удалить комментарии (css)
	babel = require('gulp-babel')
	;

gulp.task('htmlCompilation', function () { // Таск формирования ДОМ страниц
	return gulp.src(['src/__*.html'])
		.pipe(fileinclude({
			filters: {
				markdown: markdown.parse
			}
		}))
		.pipe(rename(function (path) {
			path.basename = path.basename.substr(2);
		}))
		.pipe(htmlbeautify({
			"indent_with_tabs": true,
			"max_preserve_newlines": 0
		}))
		.pipe(gulp.dest('./src/'));
});

/// Таск для переноса normalize.css и его минификации
gulp.task('compressNormalizeCss', function () {
	return gulp.src('src/libs/normalize-css/normalize.css')
		.pipe(gulp.dest('src/sass/base/'))
		.pipe(cssnano())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('src/sass/base/'));
});

gulp.task('sassCompilation', ['compressNormalizeCss'], function () { // Создаем таск для компиляции sass файлов
	return gulp.src('src/sass/**/*.+(scss|sass)') // Берем источник
		.pipe(sourcemaps.init())
		.pipe(sass({
			outputStyle: 'expanded', // nested (default), expanded, compact, compressed
			indentType: 'tab',
			indentWidth: 1,
			precision: 3,
			linefeed: 'lf' // cr, crlf, lf or lfcr
		}).on('error', sass.logError)) // Преобразуем Sass в CSS посредством gulp-sass
		.pipe(replace('../../', '../')) /// в css файлах меняем пути к файлам с ../../ на ../
		.pipe(autoprefixer([
			'last 5 versions', '> 1%', 'ie >= 9', 'and_chr >= 2.3' //, 'ie 8', 'ie 7'
		], {
			cascade: true
		})) // Создаем префиксы
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('./src/css')) // Выгружаем результата в папку src/css
		.pipe(browserSync.reload({
			stream: true
		})); // Обновляем CSS на странице при изменении
});

gulp.task('mergeCssLibs', function () { // Таск для мержа css библиотек
	return gulp.src([
		'src/css/temp/*.css' // see gulpfile-special.js
		// , 'src/libs/highlightjs/styles/default.css'
		// , 'src/libs/highlightjs/styles/tomorrow.css'
		// , 'src/libs/highlightjs/styles/idea.css'
		// , 'src/libs/highlightjs/styles/foundation.css'
		, 'src/libs/highlightjs/styles/github-gist.css'
		// , 'src/lib/plugin/file.css'
	]) // Выбираем файлы для конкатенации
		.pipe(concatCss("src/css/libs.css", {
			rebaseUrls: false
		}))
		.pipe(gulp.dest('./')) // Выгружаем в папку src/css несжатую версию
		.pipe(cssnano()) // Сжимаем
		.pipe(rename({suffix: '.min'})) // Добавляем суффикс .min
		.pipe(gulp.dest('./')); // Выгружаем в папку src/css сжатую версию
});

/// Таск для переноса normalize
gulp.task('normalize', function () {
	return gulp.src('src/libs/normalize-scss/sass/**/*.+(scss|sass)')
		.pipe(stripCssComments())
		// .pipe(removeEmptyLines())
		.pipe(gulp.dest('src/_temp/'));
});

gulp.task('copyLibsScriptsToJs', ['copyJqueryToJs', 'copyJqueryUiJs', 'copyJqueryUiCss'], function () { // Таск для мераж js библиотек
	return gulp.src([
		'src/libs/device.js/lib/device.min.js' // определение устройств
		, 'src/libs/jquery-smartresize/jquery.debouncedresize.js' // "умный" ресайз
		, 'src/libs/highlightjs/highlight.pack.min.js' // подсветка кода
		, 'src/libs/clipboard/dist/clipboard.min.js' // копирование в буфер
	])
		.pipe(concat('libs.js')) // Собираем их в кучу в новом файле libs.min.js
		.pipe(gulp.dest('src/js'))
		.pipe(rename({suffix: '.min'}))
		.pipe(uglify()) // Сжимаем JS файл
		.pipe(gulp.dest('src/js')); // Выгружаем в папку src/js
});

gulp.task('copyJqueryToJs', function () { // Таск для копирования jquery в js папку
	return gulp.src([
		'src/libs/jquery/dist/jquery.min.js'
	])
		.pipe(gulp.dest('src/js'));
});

// Таск для копирования jquery-ui в js папку
gulp.task('copyJqueryUiJs', function () {
	return gulp.src([
		'src/libs/jquery-ui/jquery-ui.min.js'
	])
		.pipe(gulp.dest('src/js/jquery-ui'));
});

gulp.task('copyJqueryUiCss', function () {
	return gulp.src([
		, 'src/libs/jquery-ui/themes/base/base.css'
		, 'src/libs/jquery-ui/themes/base/spinner.css'
	])
		.pipe(concatCss("jquery-ui.css", {
			rebaseUrls: false
		}))
		.pipe(gulp.dest('src/js/jquery-ui'));
});
// Таск для копирования jquery-ui в js папку (конец)

// babel
// gulp.task('babelJsConvert', function () {
// 	gulp.src('src/js/common-ms-rolls.js')
// 		.pipe(babel({
// 			presets: ['env']
// 		}))
// 		.pipe(gulp.dest('src/js/babel/'))
// });

gulp.task('browserSync', function (done) { // Таск browserSync
	browserSync.init({
		server: {
			baseDir: "./src"
		},
		notify: false // Отключаем уведомления
	});
	browserSync.watch(['src/*.html', 'src/js/**/*.js', 'src/includes/**/*.json']).on("change", browserSync.reload);
	done();
});

gulp.task('watch', ['normalize', 'browserSync', 'htmlCompilation', 'sassCompilation', 'mergeCssLibs', 'copyLibsScriptsToJs'], function () {
	gulp.watch(['src/_tpl_*.html', 'src/__*.html', 'src/includes/**/*.json'], ['htmlCompilation']); // Наблюдение за tpl
	// файлами в папке include
	gulp.watch('src/sass/**/*.+(scss|sass)', ['sassCompilation']); // Наблюдение за sass файлами в папке sass
	// for babel
	// gulp.watch('src/js/**/*.js', ['babelJsConvert']); // Наблюдение за sass файлами в папке sass
});

gulp.task('default', ['watch']); // Назначаем таск watch дефолтным

/************************************************************
 * Minify js plugins
 ************************************************************/

gulp.task('minifyJsPlugins', function () {
	return gulp.src('src/js/plugins/jquery.ms-clap.js')
		.pipe(rename({suffix: '.min'}))
		.pipe(uglify({
			output: {
				comments: /^!/
			}
		})) // Сжимаем JS файл
		.pipe(gulp.dest('src/js/plugins.min')); // Выгружаем в папку src/js
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

gulp.task('build', ['cleanDistFolder', 'htmlCompilation', 'copyImgToDist', 'sassCompilation', 'mergeCssLibs', 'normalize', 'copyLibsScriptsToJs'], function () {

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

gulp.task('cleanDistFolder', function () {
	return del.sync(['dist/']); // Удаляем папку dist
});

gulp.task('clearCache', function () { // Создаем такс для очистки кэша
	return cache.clearAll();
});