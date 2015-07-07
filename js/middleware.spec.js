///<reference path='../typings/tsd.d.ts'/>
var chai = require('chai');
var connect = require('connect');
var path = require('path');
var request = require('supertest');
var middleware = require('./middleware');
var postcss = require('postcss');
var expect = chai.expect;
var ERROR_PREFIX = '[postcss-middleware]';
// ReSharper disable WrongExpressionStatement
describe('creating middleware', function () {
    it('throws an error when plugins option is not provided', function () {
        expect(middleware).to.throw("" + ERROR_PREFIX + " missing required option: plugins");
    });
    it('throws an error when plugins option is a string', function () {
        expect(function () {
            middleware({ plugins: 'foo' });
        }).to.throw(TypeError, "" + ERROR_PREFIX + " plugins option must be an array");
    });
    it('remains silent when plugins option is an empty array', function () {
        expect(function () {
            middleware({ plugins: [] });
        }).not.to.throw(Error);
    });
    it('throws an error when src option is a string', function () {
        expect(function () {
            middleware({
                plugins: [],
                src: 'foo'
            });
        }).to.throw(TypeError, "" + ERROR_PREFIX + " src option must be a function");
    });
});
describe('the request', function () {
    it('moves to the next middleware when request method is POST', function (done) {
        request(createServer({ plugins: [] })).post('/foo.css').expect('Cannot POST /foo.css\n').expect(404, done);
    });
    it('sends an error to the next middleware when src returns undefined', function (done) {
        request(createServer({
            plugins: [],
            src: function () { return void (0); }
        })).get('/foo.css').expect("" + ERROR_PREFIX + " src callback must return a glob string or array").expect(500, done);
    });
    it('moves to the next middleware when the file is not found', function (done) {
        request(createServer({ plugins: [] })).get('/does-not-exist.css').expect('Cannot GET /does-not-exist.css\n').expect(404, done);
    });
    it('resolves src path relative to __dirname by default', function (done) {
        request(connect().use(middleware({ plugins: [] }))).get('/../fixtures/foo.css').expect(200, done);
    });
    it('serves a file with 200 Content-Type: text/css', function (done) {
        request(createServer({ plugins: [] })).get('/foo.css').set('Accept', 'text/css').expect('Content-Type', 'text/css').expect(200, done);
    });
    it('serves a file without modification when plugins array is empty', function (done) {
        request(createServer({ plugins: [] })).get('/foo.css').expect('body{foo:bar}\n').expect(200, done);
    });
    it('serves a file processed by all plugins defined in options', function (done) {
        request(createServer({
            plugins: [
                postcss.plugin('foo-bar-baz', function () {
                    return function (css) {
                        css.eachDecl('foo', function (declaration) {
                            declaration.prop = 'baz';
                        });
                    };
                }),
                postcss.plugin('foo-baz-qux', function () {
                    return function (css) {
                        css.eachDecl('baz', function (declaration) {
                            declaration.value = 'qux';
                        });
                    };
                })
            ]
        })).get('/foo.css').expect('body{baz:qux}\n').expect(200, done);
    });
    it('sends a plugin error to the next middleware', function (done) {
        request(createServer({
            plugins: [
                postcss.plugin('error', function () {
                    return function () {
                        throw new Error('foo');
                    };
                })
            ]
        })).get('/foo.css').expect('foo').expect(500, done);
    });
});
function createServer(options) {
    options.src = options.src || (function (req) {
        return path.join('fixtures', req.url);
    });
    return connect().use(middleware(options)).use(function (err, req, res, next) {
        res.statusCode = 500;
        res.end(err.message);
    });
}
