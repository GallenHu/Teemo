const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const browserSync = require('browser-sync');
const runSequence = require('run-sequence');
const del = require('del');

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

const styleDir = 'src/styles';
const scriptDir = 'src/scripts';
const tempDir = '.tmp';
const outputDir = 'dist';

gulp.task('styles', () => {
  const AUTOPREFIXER_BROWSERS = [
    'ie >= 8',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10',
  ];

  return (
    gulp
      .src([`${styleDir}/*.less`, `${styleDir}/*.css`])
      .pipe($.newer(`${tempDir}/styles`))
      .pipe($.sourcemaps.init())
      // less
      .pipe($.less())
      .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
      .pipe($.sourcemaps.write())
      .pipe(gulp.dest(`${tempDir}/styles`))
      // concat
      .pipe($.order([
        `${tempDir}/styles/normalize.css`,
        `${tempDir}/styles/main.css`
      ], { base: __dirname }))
      .pipe($.concatCss('style.css'))
      .pipe(gulp.dest(`${outputDir}/styles`))
  );
});

gulp.task("scripts", () => {
  return gulp
    .src([`${scriptDir}/zepto.min.js`, `${scriptDir}/baidusug.js`, `${scriptDir}/main.js`])
    .pipe($.newer(`${tempDir}/scripts`))
    .pipe($.sourcemaps.init())
    .pipe($.concat("main.js"))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(`${outputDir}/scripts`));
});

gulp.task('clean', () => del([tempDir, 'dist/*', '!dist/.git'], { dot: true }));

gulp.task('bs', () => {
  browserSync({
    notify: false,
    // Customize the Browsersync console logging prefix
    logPrefix: 'WSK',
    // Allow scroll syncing across breakpoints
    scrollElementMapping: ['main', '.mdl-layout'],
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: [outputDir, 'src'],
    port: 3000,
  });
  gulp.watch(['src/*.html'], reload);
  gulp.watch(['src/scripts/*.js'], ['scripts', reload]);
  gulp.watch(['src/styles/*.{less,css}'], ['styles', reload]);
});

gulp.task('serve', (cb) => {
  runSequence('clean', 'styles', 'scripts', 'bs', cb);
});

gulp.task("rev", () => {
  return gulp
    .src(["dist/**/*.css", "dist/**/*.js"])
    .pipe($.rev())
    .pipe(gulp.dest("dist/"))
    .pipe($.rev.manifest())
    .pipe(gulp.dest("dist/"));
});
gulp.task("replace", function() {
  gulp
    .src(["dist/*.json", "./src/index.html"])
    .pipe(
      $.revCollector({
        replaceReved: true // 热更新
      })
    )
    .pipe(gulp.dest("./dist"));
});

gulp.task("move", function () {
  gulp
    .src(["src/lib/**"])
    .pipe(gulp.dest("./dist/lib"));

    gulp
    .src(["src/images/**"])
    .pipe(gulp.dest("./dist/images"));
});


gulp.task('default', ['clean'], (cb) => runSequence('styles', 'scripts', 'rev', 'replace', 'move', cb));
