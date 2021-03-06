const gulp = require('gulp');
const replace = require('gulp-replace');
const config = require('./config.js');

gulp.task('srcfiles', function() {
  gulp.src(['./src/regmain.js'])
  .pipe(replace('process.env.FrontendUrl', '\'' + config.get('FrontendUrl') + '\''))
  .pipe(gulp.dest('./gulpified/'));
  gulp.src(['./src/useraccountmain.js'])
  .pipe(replace('process.env.FrontendUrl', '\'' + config.get('FrontendUrl') + '\''))
  .pipe(gulp.dest('./gulpified/'));
  gulp.src(['./src/userutilmain.js'])
  .pipe(gulp.dest('./gulpified/'));
  gulp.src(['./src/commons/patric.js'])
  .pipe(gulp.dest('./gulpified/commons/'));
  gulp.src(['./src/classes/Register_.js'])
  .pipe(replace('process.env.BackendUrl', '\'' + config.get('FrontendUrl') + '\''))
  .pipe(replace('process.env.FrontendUrl', '\'' + config.get('FrontendUrl') + '\''))
  .pipe(gulp.dest('./gulpified/classes/'));
  gulp.src(['./src/classes/UserUtil_.js'])
  .pipe(replace('process.env.BackendUrl', '\'' + config.get('FrontendUrl') + '\''))
  .pipe(replace('process.env.FrontendUrl', '\'' + config.get('FrontendUrl') + '\''))
  .pipe(gulp.dest('./gulpified/classes/'));
  gulp.src(['./src/classes/Login_.js'])
  .pipe(replace('process.env.BackendUrl', '\'' + config.get('FrontendUrl') + '\''))
  .pipe(replace('process.env.FrontendUrl', '\'' + config.get('FrontendUrl') + '\''))
  .pipe(gulp.dest('./gulpified/classes/'));
  gulp.src(['./src/classes/UserAccount.js'])
  .pipe(replace('process.env.BackendUrl', '\'' + config.get('FrontendUrl') + '\''))
  .pipe(replace('process.env.FrontendUrl', '\'' + config.get('FrontendUrl') + '\''))
  .pipe(gulp.dest('./gulpified/classes/'));
});
gulp.task('removepostinstall', function() {
  gulp.src(['./backend/package.json'])
  .pipe(replace(' && npm run postinstallsh', ''))
  .pipe(gulp.dest('./gulpified'));
});
