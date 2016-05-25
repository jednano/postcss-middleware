///<reference path="../typings/tsd.d.ts" />
import * as path from 'path';
import * as vfs from 'vinyl-fs';
import * as sourcemaps from 'gulp-sourcemaps';
import * as plumber from 'gulp-plumber';
const postcss = require('gulp-postcss');
import * as concat from 'gulp-concat';
const tap = require('gulp-tap');
import * as gulpif from 'gulp-if';

const ERROR_PREFIX = '[postcss-middleware]';

function PostCssMiddleware(options: PostCssMiddleware.Options = <any>{}) {

	if (!options.plugins) {
		throw new Error(`${ERROR_PREFIX} missing required option: plugins`);
	}

	if (!Array.isArray(options.plugins)) {
		throw new TypeError(`${ERROR_PREFIX} plugins option must be an array`);
	}

	if (options.src && typeof options.src !== 'function') {
		throw new TypeError(`${ERROR_PREFIX} src option must be a function`);
	}

	if (options.options && typeof options.options !== 'object') {
		throw new TypeError(`${ERROR_PREFIX} options option must be an object`);
	}

	const src = options.src || (req => path.join(__dirname, req.url));

	return (req, res, next: Function) => {
		if (req.method !== 'GET' && req.method !== 'HEAD') {
			next();
			return;
		}

		const globs = src(req);
		if (typeof globs !== 'string' && !Array.isArray(globs)) {
			next(new TypeError(`${ERROR_PREFIX} src callback must return a glob string or array`));
			return;
		}

		let isFileFound = false;
		vfs.src(globs)
			.pipe(plumber({ errorHandler: err => next(err) }))
			.pipe(gulpif(options.inlineSourcemaps, sourcemaps.init()))
				.pipe(postcss(options.plugins, options.options))
				.pipe(concat('.css'))
			.pipe(gulpif(options.inlineSourcemaps, sourcemaps.write()))
			.pipe(tap(file => {
				isFileFound = true;
				res.writeHead(200, {
					'Content-Type': 'text/css'
				});
				res.end(file.contents);
			}))
			.on('end', () => {
				if (!isFileFound) {
					next();
				}
			});
	};
}

module PostCssMiddleware {
	export interface Options {
		/**
		 * An array of PostCSS plugins.
		 */
		plugins: Function[];
		/**
		 * PostCSS options
		 */
		options?: Object;
		/**
		 * Build the file path to the source file(s) you wish to read.
		 */
		src?:
		/**
		 * @param request The Express app's request object.
		 * @returns A glob string or an array of glob strings. All files matched
		 * will be concatenated in the response.
		 */
		(request: any) => string|string[];
		/**
		 * Generate inlined sourcemaps.
		 */
		inlineSourcemaps?: boolean;
	}
}

export = PostCssMiddleware;
