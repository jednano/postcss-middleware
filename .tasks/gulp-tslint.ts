import * as gulp from 'gulp';
import * as plumber from 'gulp-plumber';
import tslint from 'gulp-tslint';

export default () => {
	return gulp.src([
			'lib/**/*.ts',
			'test/**/*.ts'
		])
		.pipe(plumber())
		.pipe(tslint({
			formatter: 'verbose'
		}))
		.pipe(tslint.report());
};
