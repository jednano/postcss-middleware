///<reference path="../typings/node/node.d.ts" />
function postcssMiddleware(options) {
    options = options || {};
    return function (req, res, next) {
        next(new Error('Not implemented'));
    };
}
module.exports = postcssMiddleware;
