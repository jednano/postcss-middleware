///<reference path="../typings/node/node.d.ts" />

function postcssMiddleware(options?: {}) {
	options = options || {};
	return (req, res, next) => {
		next(new Error('Not implemented'));
	};
}

export = postcssMiddleware;
