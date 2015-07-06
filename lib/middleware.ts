///<reference path="../typings/node/node.d.ts" />
///<reference path="../typings/vinyl-fs/vinyl-fs.d.ts" />
import vfs = require('vinyl-fs');
var sourcemaps = require('gulp-sourcemaps');
var postcss = require('gulp-postcss');
var concat = require('gulp-concat');
var tap = require('gulp-tap');
var gulpif = require('gulp-if');

// ReSharper disable once InconsistentNaming
// ReSharper disable once UnusedLocals
// ReSharper disable RedundantQualifier
function PostCssMiddleware(options?: PostCssMiddleware.Options) {
	options = <PostCssMiddleware.Options>(options || {});
	// ReSharper enable RedundantQualifier

	if (!options.src) {
		throw createError('missing required option: src');
	}

	if (typeof options.src !== 'function') {
		throw createError('src option must be a function');
	}

	if (!options.plugins) {
		throw createError('missing required option: plugins');
	}

	if (!Array.isArray(options.plugins)) {
		throw createError('plugins option must be an array');
	}

	return (req, res, next: Function) => {
		if (req.method !== 'GET' && req.method !== 'HEAD') {
			next();
			return;
		}

		vfs.src(options.src(req))
			.pipe(gulpif(options.generateSourcemaps, sourcemaps.init()))
				.pipe(postcss(options.plugins))
				.pipe(concat('foo.css'))
			.pipe(gulpif(options.generateSourcemaps, sourcemaps.write()))
			.pipe(tap(file => {
				res.set('Content-Type', 'text/css');
				res.status(200).send(file.contents);
			}))
			.on('error', next);
	};
}

module PostCssMiddleware {
	export interface Options {
		/**
		 * Build the file path to the source file(s) you wish to read.
		 */
		src:
		/**
		 * @param request The Express app's request object.
		 * @returns A glob string or an array of glob strings. All files matched
		 * will be concatenated in the response.
		 */
		(request: any) => string|string[];
		/**
		 * An array of PostCSS plugins.
		 */
		plugins: Function[];
		/**
		 * Generate inlined sourcemaps.
		 */
		generateSourcemaps?: boolean;
	}
}

function createError(message: string) {
	return new Error(`[postcss-middleware]: ${message}`);
}

export = PostCssMiddleware;
