import * as gulp from 'gulp';
import clean from './.tasks/gulp-clean';
import tslint from './.tasks/gulp-tslint';
import copy from './.tasks/gulp-copy';

gulp.task('default', ['tslint']);
gulp.task('clean', clean);
gulp.task('tslint', tslint);
gulp.task('copy', copy);
