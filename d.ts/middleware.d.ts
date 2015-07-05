/// <reference path="../typings/node/node.d.ts" />
declare function postcssMiddleware(options?: {}): (req: any, res: any, next: any) => void;
export = postcssMiddleware;
