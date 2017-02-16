const gulp            = require('gulp');
const sass            = require('gulp-sass');
const webpack         = require('webpack-stream');
const webpackConfig   = require('./webpack.config.js');
const livereload      = require('gulp-livereload');


/*
* Javascript
*
*/

gulp.task('javascript', function() {
  return gulp.src('./resources/js/index.js')
    .pipe(webpack(webpackConfig.site))
    .pipe(gulp.dest('./public/javascripts'))
    .pipe(livereload());
});


/*
* CSS
*
*/

gulp.task('sass', function () {
  return gulp.src('./resources/scss/**/*.scss')
    .pipe(sass({outputStyle: 'compressed'})
    .on('error', sass.logError))
    .pipe(gulp.dest('./public/stylesheets'))
    .pipe(livereload());
});


/*
* DEVELOPMENT
*
*/

gulp.task('dev', ['javascript', 'sass'], function() {
  gulp.watch('./resources/js/**/*', ['javascript']);
  gulp.watch('./resources/scss/**/*.scss', ['sass']);

  livereload.listen();
  console.log('Watching Javascript & Sass changes');
});


/*
* PRODUCTION
*
*/

gulp.task('default', ['javascript', 'sass'], function() {
  console.log('Compiling Javascript & Sass');
});


module.exports = gulp;
