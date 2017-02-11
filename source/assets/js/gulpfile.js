const gulp = require('gulp');
const svgstore = require('gulp-svgstore');
const svgmin = require('gulp-svgmin');
const rename = require('gulp-rename');

gulp.task('svgstore', function svgSprite() {
  return gulp
    .src('../img/*.svg')
    .pipe(svgmin())
    .pipe(svgstore())
    .pipe(rename({ basename: 'sprite' }))
    .pipe(gulp.dest('../img'));
});
