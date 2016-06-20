// var elixir = require('laravel-elixir');
var gulp = require('gulp');
var watch = require('gulp-watch');
var connect = require('gulp-connect');
var shell = require('gulp-shell');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cssValidate = require('gulp-w3c-css');
var sass = require('gulp-sass');
var compass = require('gulp-compass');
var gutil = require('gulp-util');
var minifyCss = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
var notify = require('gulp-notify');
var jshint = require('gulp-jshint');
var imageOptim = require('gulp-imageoptim');
var imagemin = require('gulp-imagemin');
// var imageminPngcrush = require('imagemin-pngcrush');

//appName must be coincide with domain set in gasmask and homestead.yaml file
var appName = 'monster.app';


var output = 'public/skin/default/';
var cssOutputDir = output + 'css/';
var jsOutputDir = output + 'js/';
var imgOutputDir = output + 'images/';

var input = './resources/assets/';
var imgDir = input + 'img/';
var bowerDir = input + 'bower/';
var sassDir = input + 'sass/';
var mainSassFile = sassDir + 'main.scss';
var componentsSassFile = sassDir + 'components.scss';
var jsTestFiles = ['tests/js_tests/*.js'];
var jsAppFiles = [input + 'js/**/*.js', './resources/views/components/**/*.js'];

//relative to the bower directory
//currently not being used because main.scss file imports them automatically
var cssDependencies = [
  'bootstrap-sass-official/assets/stylesheets/',
  'fontawesome/scss/'
];

cssDependencies.forEach(function(path, i) {
  cssDependencies[i] = bowerDir + path;
});

//relative to bower directory
var jsDependencies = {
  headFiles: [
    'modernizr.js',
    'domready.js',
    'fingerprint.js',
    'webRTC.js',
    'websocket.module.js',
    'user_cookie.js'
  ],
  inputFiles: [
    'jquery/dist/jquery.js',
    'underscore/underscore.js',
    //'restive/restive.min.js',
    'gsap/src/minified/TweenMax.min.js',
    'isotope/dist/isotope.pkgd.min.js',
    'isotope-packery/packery-mode.pkgd.min.js',
    'jquery-touchswipe/jquery.touchSwipe.min.js',
    'waypoints/lib/jquery.waypoints.min.js',
    'flickity/dist/flickity.pkgd.js',
    'parsleyjs/dist/parsley.min.js',
    'ramjet/dist/ramjet.min.js',
    'lazysizes/lazysizes.min.js',
    'fine-uploader.js',
    'mediaelement/build/mediaelement-and-player.min.js'
  ]
};


jsDependencies.inputFiles.forEach(function (path, i) {
  jsDependencies.inputFiles[i] = bowerDir + path;
});

jsDependencies.headFiles.forEach(function (file, i){
  jsDependencies.headFiles[i] = input + 'head/' + file;
});

var ekkoDependencies = [input + 'ekko_assets/*.js'];

jsDependencies.inputFiles = jsDependencies.inputFiles.concat(ekkoDependencies);
console.log(jsDependencies);

gulp.task('coverage', function() {
  connect.server({
    root: './',
    port: 8000,
    fallback: 'spec.html',
    livereload: true
  });
});

//compile app sass files, concat and minify
gulp.task('sass-all', function(done) {
  gulp.src(mainSassFile)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
     .pipe(sass())
      .pipe(autoprefixer({
        browsers: ['last 3 versions'],
        cascade: false
      }))
      .pipe(minifyCss())
      .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(cssOutputDir));
    done();
});

//compile app sass files, concat and minify
gulp.task('sass-components', function(done) {
  gulp.src(componentsSassFile)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
     .pipe(sass())
      .pipe(autoprefixer({
        browsers: ['last 3 versions'],
        cascade: false
      }))
      .pipe(minifyCss())
      .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(cssOutputDir));
    done();
});

gulp.task('compass', function(done) {
  gulp.src(mainSassFile)
    .pipe(compass({
      css: cssOutputDir,
      sass: sassDir,
      image: imgOutputDir,
    }))
    .pipe(sourcemaps.init())
      .pipe(autoprefixer({
        browsers: ['last 3 versions'],
        cascade: false,
        remove: false
      }))
      .pipe(minifyCss())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(cssOutputDir));
  done();
});

//validate css file and check for errors
gulp.task('validate', function(done) {
  gulp.src(cssOutputDir + 'main.css')
    .pipe(notify())
    .pipe(cssValidate())
    .pipe(gutil.buffer(function(err){
      if(err){
        console.log(err);
      }
    }));
  done();
});

gulp.task('compile-css', ['sass-all', 'sass-components']);
//gulp.task('compile-css', ['sass-all', 'validate']);

//optimize image files
gulp.task('jpg-gif', function(done) {
  gulp.src([imgDir + '**/*.jpg', imgDir + '**/*.gif'])
    .pipe(imagemin())
    .pipe(gulp.dest(imgOutputDir));
  done();
});

gulp.task('png', function(done) {
  gulp.src(imgDir + '**/*.png')
    .pipe(imageOptim.optimize())
    .pipe(gulp.dest(imgOutputDir));
  done();
});

gulp.task('images', ['jpg-gif', 'png']);

//concat, minify and sourcemap all js app files
gulp.task('javascript-app', function(done) {
  gulp.src(jsAppFiles)
    .pipe(sourcemaps.init())
      .pipe(jshint())
      .pipe(jshint.reporter('default'))
      .pipe(concat('compiled.script.js'))
      .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(jsOutputDir));
  done();
});

//concat minify and sourcemap all js tests
gulp.task('javascript-tests', function(done) {
  gulp.src(jsTestFiles)
    .pipe(sourcemaps.init())
      .pipe(concat('test.js'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('tests/js_tests/compiled/'));
  done();
});

gulp.task('javascript-head', function (done) {
  gulp.src(jsDependencies.headFiles)
    .pipe(sourcemaps.init())
      .pipe(concat('head.js'))
      .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(jsOutputDir));
  done();
});

gulp.task('javascript-dependencies', function(done) {
  gulp.src(jsDependencies.inputFiles)
    .pipe(sourcemaps.init())
      .pipe(concat('vendor.js'))
      .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(jsOutputDir));
  done();
});

//build all js files
gulp.task('build-js', ['javascript-app', 'javascript-tests', 'javascript-dependencies', 'javascript-head']);

gulp.task('watch-javascript', function() {
  watch(jsAppFiles, function() {
    gulp.start('javascript-app');
  });
  watch(jsTestFiles, function() {
    gulp.start('javascript-tests');
  });

  watch(jsDependencies.headFiles, function () {
    gulp.start('javascript-head');
  });
});

gulp.task('watch-dependencies', function() {
  watch(jsDependencies.inputFiles, function() {
    gulp.start('javascript-dependencies');
  });
});

gulp.task('watch-css', function() {
  watch([sassDir + '**/*.scss', './resources/views/components/**/*.scss'], function(){
    gulp.start('compile-css');
  });
});

//start browser sync to watch all scripts and links to inject into browser, and reload on php changes in Controllers and views
gulp.task('browser-sync', shell.task(['browser-sync start --proxy "' + appName + '" --files "' + cssOutputDir + '*.css"']));

//build command to compile all js and css
gulp.task('build-all', ['compile-css', 'build-js']);

//watch all src files to concat, lint and build upon change
gulp.task('watch-all', ['build-all', 'browser-sync', 'watch-javascript', 'watch-css', 'watch-dependencies'/*,'watch-images'*/]);

//run tests on all js files
gulp.task('run-karma', shell.task(['karma start karma.conf.js']));

gulp.task('run-karma-ie', shell.task(['karma start karma.conf.ie.js']));

gulp.task('tests', ['watch-javascript', 'coverage', 'run-karma', 'run-karma-ie']);
