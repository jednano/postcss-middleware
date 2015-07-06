# postcss-middleware

[![Build Status](https://travis-ci.org/jedmao/postcss-middleware.svg?branch=master)](https://travis-ci.org/jedmao/postcss-middleware)
[![npm version](https://badge.fury.io/js/postcss-middleware.svg)](http://badge.fury.io/js/postcss-middleware)
[![Code Climate](https://codeclimate.com/github/jedmao/postcss-middleware/badges/gpa.svg)](https://codeclimate.com/github/jedmao/postcss-middleware)
[![Test Coverage](https://codeclimate.com/github/jedmao/postcss-middleware/badges/coverage.svg)](https://codeclimate.com/github/jedmao/postcss-middleware)
[![npm license](http://img.shields.io/npm/l/postcss-middleware.svg?style=flat-square)](https://www.npmjs.org/package/postcss-middleware)

[![npm](https://nodei.co/npm/postcss-middleware.svg?downloads=true)](https://nodei.co/npm/postcss-middleware/)

[PostCSS](https://github.com/postcss/postcss) middleware for [Connect](https://github.com/senchalabs/connect#readme) and [Express][] frameworks.

## Installation

```
$ npm install postcss-middleware
```

## Usage

### JavaScript

```js
var postcssMiddleware = require('postcss-middleware');
```

### TypeScript

```ts
///<reference path="node_modules/postcss-middleware/.d.ts" />
import postcssMiddleware = require('postcss-middleware');
```

### Connect

```js
var connect = require('connect');
var app = connect();
app.use('/css', postcssMiddleware(/* options */));
```

### Express

```js
var express = require('express');
var app = express();
app.use('/css', postcssMiddleware(/* options */));
```

### Options

#### `src`

Type: `(request) => string|string[]`  
Required: `true`

A callback function that will be provided the [Express][] [app's](http://expressjs.com/4x/api.html#app) [request](http://expressjs.com/4x/api.html#req) object. Use this object to build the file path to the source file(s) you wish to read. The callback can return [a glob string or an array of glob strings](https://github.com/wearefractal/vinyl-fs#srcglobs-opt). All files matched will be [concatenated](https://github.com/wearefractal/gulp-concat) in the [response](http://expressjs.com/4x/api.html#res.send).

```js
app.use('/css', postcssMiddleware({
	src: function(req) {
		return path.join('styles', req.path);
	}
});
```

The above example will match requests to `/css`. If `/css/foo.css` were requested, the middleware would read `/styles/foo.css` in the context of your application.

Using a regular expression [route path](http://expressjs.com/guide/routing.html), we can back-reference a capture group and use it as a folder name.

```js
app.use(/^\/css\/([a-z-]+)\.css$/, postcssMiddleware({
	src: function(req) {
		var folder = req.params[0];
		return path.join('styles', folder, '*.css');
	}
});
```

If you were to request `/css/foo-bar.css` in the above example, the middleware would concatenate all CSS files in the `/styles/foo-bar` folder in the response.

#### `plugins`

Type: `Array`  
Required: `true`

An array of [PostCSS plugins](https://github.com/postcss/postcss#plugins).

#### `inlineSourcemaps`

Type: `Boolean`  
Required: `false`  
Default: `undefined`

Generate inlined [sourcemaps](https://github.com/floridoo/gulp-sourcemaps).

[Express]: http://expressjs.com/
