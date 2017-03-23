const gulp = require('gulp');
const svgstore = require('gulp-svgstore');
const svgmin = require('gulp-svgmin');
const rename = require('gulp-rename');

gulp.task('svgstore', () => {
  gulp
    .src('./source/assets/img/*.svg')
    .pipe(svgmin())
    .pipe(svgstore())
    .pipe(rename({ basename: 'sprite' }))
    .pipe(gulp.dest('./source/assets/img'));
});
