///<reference path='../typings/tsd.d.ts'/>
import chai = require('chai');
var connect = require('connect');
import path = require('path');
var request = require('supertest');
import middleware = require('./middleware');

var expect = chai.expect;
var ERROR_PREFIX = '[postcss-middleware]';

// ReSharper disable WrongExpressionStatement
describe('creating middleware', () => {

	it('throws an error when plugins option is not provided', () => {
		expect(middleware).to.throw(`${ERROR_PREFIX} missing required option: plugins`);
	});

	it('throws an error when plugins option is a string', () => {
		expect(() => {
			middleware({ plugins: <any>'foo' });
		}).to.throw(TypeError, `${ERROR_PREFIX} plugins option must be an array`);
	});

	it('remains silent when plugins option is an empty array', () => {
		expect(() => {
			middleware({ plugins: [] });
		}).not.to.throw(Error);
	});

	it('throws an error when src option is a string', () => {
		expect(() => {
			middleware({
				plugins: <any>[],
				src: <any>'foo'
			});
		}).to.throw(TypeError, `${ERROR_PREFIX} src option must be a function`);
	});

});

describe('the request',() => {

	it('moves to the next middleware when request method is POST', done => {
		request(createServer({ plugins: [] }))
			.post('/foo.css')
			.expect('Cannot POST /foo.css\n')
			.expect(404, done);
	});

	it('sends an error to the next middleware when src returns undefined', done => {
		request(createServer({
				plugins: [],
				src: () => void(0)
			}))
			.get('/foo.css')
			.expect(`${ERROR_PREFIX} src callback must return a glob string or array`)
			.expect(500, done);
	});

	it('moves to the next middleware when the file is not found', done => {
		request(createServer({ plugins: [] }))
			.get('/does-not-exist.css')
			.expect('Cannot GET /does-not-exist.css\n')
			.expect(404, done);
	});

	it('resolves src path relative to __dirname by default', done => {
		request(connect().use(middleware({ plugins: [] })))
			.get('/../fixtures/foo.css')
			.expect(200, done);
	});

	it('serves a file with 200 Content-Type: text/css', done => {
		request(createServer({ plugins: [] }))
			.get('/foo.css')
			.set('Accept', 'text/css')
			.expect('Content-Type', 'text/css')
			.expect(200, done);
	});

	it('concatenates a glob src into one file', done => {
		request(createServer({
				plugins: [],
				src: () => {
					return path.join('fixtures', '*.css');
				}
			}))
			.get('/foo.css')
			.expect('body{bar:baz}\n\nbody{foo:bar}\n')
			.expect(200, done);
	});

	it('inlines sourcemaps when inlineSourcemaps option is true', done => {
		request(createServer({
				plugins: [],
				src: () => {
					return path.join('fixtures', '*.css');
				},
				inlineSourcemaps: true
			}))
			.get('/foo.css')
			.expect(/\/*# sourceMappingURL=data:application\/json;base64,/)
			.expect(200, done);
	});

	it('serves a file without modification when plugins array is empty', done => {
		request(createServer({ plugins: [] }))
			.get('/foo.css')
			.expect('body{foo:bar}\n')
			.expect(200, done);
	});

	it('serves a file processed by all plugins defined in options', done => {
		request(createServer({
				plugins: [
					css => {
						css.eachDecl('foo', declaration => {
							declaration.prop = 'baz';
						});
					},
					css => {
						css.eachDecl('baz', declaration => {
							declaration.value = 'qux';
						});
					}
				]
			}))
			.get('/foo.css')
			.expect('body{baz:qux}\n')
			.expect(200, done);
	});

	it('sends a plugin error to the next middleware', done => {
		request(createServer({
				plugins: [
					() => {
						throw new Error('foo');
					}
				]
			}))
			.get('/foo.css')
			.expect('foo')
			.expect(500, done);
	});

});

function createServer(options: middleware.Options) {
	options.src = options.src || (req => {
		return path.join('fixtures', req.url);
	});
	return connect()
		.use(middleware(options))
		// ReSharper disable once UnusedParameter
		.use((err, req, res, next) => {
			res.statusCode = 500;
			res.end(err.message);
		});
}
