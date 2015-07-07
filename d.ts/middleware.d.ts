/// <reference path="../typings/node/node.d.ts" />
/// <reference path="../typings/vinyl-fs/vinyl-fs.d.ts" />
declare function PostCssMiddleware(options?: PostCssMiddleware.Options): (req: any, res: any, next: Function) => void;
declare module PostCssMiddleware {
    interface Options {
        /**
         * An array of PostCSS plugins.
         */
        plugins: Function[];
        /**
         * Build the file path to the source file(s) you wish to read.
         */
        src?: 
        /**
         * @param request The Express app's request object.
         * @returns A glob string or an array of glob strings. All files matched
         * will be concatenated in the response.
         */
        (request: any) => string | string[];
        /**
         * Generate inlined sourcemaps.
         */
        inlineSourcemaps?: boolean;
    }
}
export = PostCssMiddleware;
