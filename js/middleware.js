///<reference path="../typings/node/node.d.ts" />
///<reference path="../typings/vinyl-fs/vinyl-fs.d.ts" />
var path = require('path');
var vfs = require('vinyl-fs');
var sourcemaps = require('gulp-sourcemaps');
var plumber = require('gulp-plumber');
var postcss = require('gulp-postcss');
var concat = require('gulp-concat');
var tap = require('gulp-tap');
var gulpif = require('gulp-if');
var ERROR_PREFIX = '[postcss-middleware]';
// ReSharper disable once InconsistentNaming
// ReSharper disable once UnusedLocals
// ReSharper disable RedundantQualifier
function PostCssMiddleware(options) {
    options = (options || {});
    // ReSharper enable RedundantQualifier
    if (!options.plugins) {
        throw new Error("" + ERROR_PREFIX + " missing required option: plugins");
    }
    if (!Array.isArray(options.plugins)) {
        throw new TypeError("" + ERROR_PREFIX + " plugins option must be an array");
    }
    if (options.src && typeof options.src !== 'function') {
        throw new TypeError("" + ERROR_PREFIX + " src option must be a function");
    }
    var src = options.src || (function (req) { return path.join(__dirname, req.url); });
    return function (req, res, next) {
        if (req.method !== 'GET' && req.method !== 'HEAD') {
            next();
            return;
        }
        var globs = src(req);
        if (typeof globs !== 'string' && !Array.isArray(globs)) {
            next(new TypeError("" + ERROR_PREFIX + " src callback must return a glob string or array"));
            return;
        }
        var isFileFound = false;
        vfs.src(globs).pipe(plumber({ errorHandler: next })).pipe(gulpif(options.inlineSourcemaps, sourcemaps.init())).pipe(postcss(options.plugins)).pipe(concat('.css')).pipe(gulpif(options.inlineSourcemaps, sourcemaps.write())).pipe(tap(function (file) {
            isFileFound = true;
            res.writeHead(200, {
                'Content-Type': 'text/css'
            });
            res.end(file.contents);
        })).on('end', function () {
            if (!isFileFound) {
                next();
            }
        });
    };
}
module.exports = PostCssMiddleware;
