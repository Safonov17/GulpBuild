const gulp = require("gulp");
const less = require("gulp-less");
const rename = require("gulp-rename");
const cleanCSS = require("gulp-clean-css");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");
const concat = require("gulp-concat");
const del = require("del");

// Пути к начальным файлам и файлам назначения
const paths = {
  styles: {
    src: "src/styles/**/*.less",
    dest: "dist/css/",
  },
  scripts: {
    src: "src/scripts/**/*.js",
    dest: "dist/js/",
  },
};

// функция, удаляющая папку dist
function clean() {
  return del(["dist"]);
}

// Обработка стилей
function styles() {
  return gulp.src(paths.styles.src)
  // Компиляция less файлов
    .pipe(less())
    // Минификация и оптимизация less файлов
    .pipe(cleanCSS())
    // Переименовываем файлы
    .pipe(rename({
      basename: 'main',
      suffix: '.min'
    }))
    .pipe(gulp.dest(paths.styles.dest));
}

// Обработка скрипта
function scripts() {
  return gulp
    .src(paths.scripts.src, {
      sourcemaps: true,
    })
    // Преобразование кода в старый формат
    .pipe(babel())
    // Сжатие и оптимизация JS кода
    .pipe(uglify())
    // Объединение файлов скрипта в один, под названием main.min.js
    .pipe(concat("main.min.js"))
    .pipe(gulp.dest(paths.scripts.dest));
}

// Отслеживание изменений
function watch() {
  gulp.watch(paths.styles.src, styles)
  gulp.watch(paths.scripts.src, scripts)
}

// Объединяем все предыдущие операции в одну последовательную операцию. Используем внутри последовательной операции параллельную операцию для обработки файлов стилей и скриптов
const build = gulp.series(clean, gulp.parallel(styles, scripts), watch)

// Экспортируем команды, чтобы использовать их в gulp
exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.watch = watch;
exports.build = build;
exports.default = build;
