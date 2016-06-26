var webpack = require('webpack');

// Webpack configuration
// http://webpack.github.io/docs/configuration.html
module.exports = function (params) {
    var main = {
        cache: false,
        entry: params.entryPath,
        // http://webpack.github.io/docs/configuration.html#devtool
        devtool: 'source-map',
        target: 'web',
        output: {
            path: params.outPath,
            filename: params.libFileName + '.js',
            library: params.libName,
            libraryTarget: 'umd',
            umdNamedDefine: true,
            publicPath: params.publicPath
        },
        module: {
            loaders: [
                {
                    test: /(\.jsx|\.js)$/,
                    loader: 'babel-loader',
                    query: {
                        presets: ['es2015']
                        // , plugins: [
                        //     ['babel-plugin-transform-builtin-extend', {
                        //         globals: ['Error', 'Array']
                        //     }]
                        // ]
                    },
                    exclude: /(node_modules|bower_components)/
                },
                {
                    test: /\.html?$/,
                    loader: 'html-loader'
                },
                {
                    test: /\.svg$/,
                    loader: 'svg-inline'
                }
            ]
        },
        resolve: {
            root: params.srcPath,
            extensions: ['', '.js']
        },
        // Whether to show progress. Defaults to `true`.
        progress: false,
        // Configure the console output.
        stats: {
            colors: true,
            modules: false,
            reasons: true
        },
        // Whether to report error to grunt if webpack find errors. Use
        // this if webpack errors are tolerable and grunt should
        // continue.
        failOnError: true,
        // Use webpacks watcher. Requires the grunt process
        // to be kept alive.
        watch: false,
        // Whether to finish the grunt task. Use this in combination
        // with the watch option.
        keepalive: false,
        // Whether to embed the webpack-dev-server runtime into the
        // bundle. Defaults to `false`.
        inline: false
    };

    return {
        main: main,
        // examples:
        // https://github.com/webpack/webpack-with-common-libs/blob/master/Gruntfile.js
        // http://www.christianalfoni.com/articles/2015_04_19_The-ultimate-webpack-setup
        server: {
            options: {
                webpack: main,
                publicPath: '/' + params.publicPath
                // , headers:{
                //     'Access-Control-Allow-Origin': '*'
                // }
            },
            start: {
                keepAlive: true,
                host: params.host,
                port: params.port,
                webpack: {
                    entry: [
                        // The script refreshing the browser on none-hot updates
                        'webpack-dev-server/client?' + params.baseURL,
                        // For hot style updates
                        'webpack/hot/dev-server',
                        // test example html
                        params.pagePath,
                        // NOTE: Always the last one is exported.
                        // source entry path
                        params.entryPath
                    ],
                    devtool: 'eval',
                    debug: true,
                    watch: true,
                    quite: false,
                    noInfo: true,
                    inline: true,
                    historyApiFallback: true,
                    plugins: [
                        // Whether to add the HotModuleReplacementPlugin and
                        // switch the server to hot mode. Use this in
                        // combination with the inline option.
                        new webpack.HotModuleReplacementPlugin()
                    ]
                }
            }
        }
    };
};
