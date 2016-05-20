const del = require('del');

export default done => {
	del([
		'build/**/*.js',
		'build/**/*.d.ts',
		'dist'
	], done);
}
