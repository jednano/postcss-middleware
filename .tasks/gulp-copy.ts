import * as gulp from 'gulp';

export default () => {
	return gulp.src('build/lib/**', { base: 'build' })
		.pipe(gulp.dest('dist'));
}
