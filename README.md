# postcss-middleware

[![Build Status](https://travis-ci.org/jedmao/postcss-middleware.svg?branch=master)](https://travis-ci.org/jedmao/postcss-middleware)
[![npm version](https://badge.fury.io/js/postcss-middleware.svg)](http://badge.fury.io/js/postcss-middleware)
[![Code Climate](https://codeclimate.com/github/jedmao/postcss-middleware/badges/gpa.svg)](https://codeclimate.com/github/jedmao/postcss-middleware)
[![Test Coverage](https://codeclimate.com/github/jedmao/postcss-middleware/badges/coverage.svg)](https://codeclimate.com/github/jedmao/postcss-middleware)
[![npm license](http://img.shields.io/npm/l/postcss-middleware.svg?style=flat-square)](https://www.npmjs.org/package/postcss-middleware)

[![npm](https://nodei.co/npm/postcss-middleware.svg?downloads=true)](https://nodei.co/npm/postcss-middleware/)

## Introduction

[PostCSS](https://github.com/postcss/postcss) middleware for [connect](https://github.com/senchalabs/connect#readme) and [express](http://expressjs.com/) frameworks.

## Installation

```
npm install postcss-middleware
```

## Usage

### JavaScript

```js
var postcssMiddleware = require('postcss-middleware');
```

### TypeScript

```ts
///<reference path="node_modules/postcss-middleware/postcss-middleware.d.ts" />
import postcssMiddleware = require('postcss-middleware');
```

### Connect

```js
// TODO
```

### Express

```js
var express = require('express');
var path = require('path');
var app = express();
app.use('/css', postcssMiddleware(/* options */));
```

### Options

#### `src`

Type: `(request) => string|string[]`
Required: `true`

A callback function that will be provided the Express app's request object. Use this object to build the file path to the source file(s) you wish to read. The callback can return a glob string or an array of glob strings. All files matched will be concatenated in the response.

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

If you were to request `/css/foo-bar.css` in the above example, the middleware would concatenate all CSS files in `/styles/foo-bar/*.css` in the response.

#### `plugins`

Type: `Array`
Required: `true`

An array of [PostCSS plugins](https://github.com/postcss/postcss#plugins).

#### `generateSourcemaps`

Type: `Boolean`
Required: `false`
Default: `undefined`

Generate inlined sourcemaps.
