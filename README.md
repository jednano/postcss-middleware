# postcss-middleware

<img align="right" width="135" height="95"
     title="Philosopher’s stone, logo of PostCSS"
     src="http://postcss.github.io/postcss/logo-leftp.png">

[![NPM version](http://img.shields.io/npm/v/postcss-middleware.svg?style=flat)](https://www.npmjs.org/package/postcss-middleware)
[![npm license](http://img.shields.io/npm/l/postcss-middleware.svg?style=flat-square)](https://www.npmjs.org/package/postcss-middleware)
[![Travis Build Status](https://img.shields.io/travis/jedmao/postcss-middleware.svg?label=unix)](https://travis-ci.org/jedmao/postcss-middleware)
[![AppVeyor Build Status](https://img.shields.io/appveyor/ci/jedmao/postcss-middleware.svg?label=windows)](https://ci.appveyor.com/project/jedmao/postcss-middleware)

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
import * as postcssMiddleware from 'postcss-middleware';
```

### Connect

```js
const connect = require('connect');
const app = connect();
app.use('/css', postcssMiddleware(/* options */));
```

### Express

```js
const express = require('express');
const app = express();
app.use('/css', postcssMiddleware(/* options */));
```

### Options

#### `plugins`

Type: `Array`
Required: `true`

An array of [PostCSS plugins](https://github.com/postcss/postcss#plugins).

#### `options`

Type: `Object`
Required: `false`

[PostCSS options](https://github.com/postcss/postcss#options) such as `syntax`, `parser` or `map`.

```js
app.use(postcssMiddleware({
	plugins: [/* plugins */],
	options: {
		parser: require('sugarss'),
		map: { inline: false }
	}
}
});
```

#### `src`

Type: `(request) => string|string[]`
Required: `false`
Default: `req => path.join(__dirname, req.url)`

A callback function that will be provided the [Express][] [app's](http://expressjs.com/4x/api.html#app) [request](http://expressjs.com/4x/api.html#req) object. Use this object to build the file path to the source file(s) you wish to read. The callback can return [a glob string or an array of glob strings](https://github.com/wearefractal/vinyl-fs#srcglobs-opt). All files matched will be [concatenated](https://github.com/wearefractal/gulp-concat) in the [response](http://expressjs.com/4x/api.html#res.send).

```js
var path = require('path');
app.use('/css', postcssMiddleware({
	src: function(req) {
		return path.join('styles', req.path);
	},
	plugins: [/* plugins */]
});
```

The above example will match requests to `/css`. If `/css/foo.css` were requested, the middleware would read `/styles/foo.css` in the context of your application.

Using a regular expression [route path](http://expressjs.com/guide/routing.html), we can back-reference a capture group and use it as a folder name.

```js
var path = require('path');
app.use(/^\/css\/([a-z-]+)\.css$/, postcssMiddleware({
	src: function(req) {
		var folder = req.params[0];
		return path.join('styles', folder, '*.css');
	},
	plugins: [/* plugins */]
});
```

If you were to request `/css/foo-bar.css` in the above example, the middleware would concatenate all CSS files in the `/styles/foo-bar` folder in the response.

#### `inlineSourcemaps`

Type: `Boolean`
Required: `false`
Default: `undefined`

Generate inlined [sourcemaps](https://github.com/floridoo/gulp-sourcemaps).

[Express]: http://expressjs.com/
