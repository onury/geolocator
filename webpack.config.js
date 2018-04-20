const path = require('path');
const webpack = require('webpack');

module.exports = (env) => {

    const LIB_NAME = 'geolocator';
    const SRC_PATH = path.resolve(__dirname, 'src');
    const OUT_PATH = path.resolve(__dirname, 'dist');
    const ENTRY_PATH = path.resolve(__dirname, 'src');
    const PUBLIC_PATH = 'dist/';

    // Webpack configuration
    // http://webpack.github.io/docs/configuration.html
    const config = {
        mode: 'development',
        cache: false,
        entry: ENTRY_PATH,
        // http://webpack.github.io/docs/configuration.html#devtool
        devtool: 'source-map',
        // the environment in which the bundle should run changes chunk loading
        // behavior and available modules
        target: 'web',
        // string (absolute path!). the home directory for webpack the entry and
        // module.rules.loader option is resolved relative to this directory
        context: __dirname,
        output: {
            // the target directory for all output files must be an absolute
            // path (use the Node.js path module)
            path: OUT_PATH,
            // the filename template for entry chunks
            filename: LIB_NAME + '.js',
            // the name of the exported library
            library: LIB_NAME,
            // the type of the exported library
            libraryTarget: 'umd',
            // use a named AMD module in UMD library
            umdNamedDefine: true,
            // the url to the output directory resolved relative to the HTML
            // page
            publicPath: PUBLIC_PATH
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            // https://github.com/rollup/rollup-plugin-babel/issues/120#issuecomment-301325496
                            presets: [
                                ['es2015', { "modules": false }]
                            ]
                        }
                    }
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
            modules: [SRC_PATH],
            extensions: ['.js']
        },
        // errors-only | minimal | none | normal | verbose
        stats: 'normal',
        plugins: [
            // https://webpack.js.org/plugins/banner-plugin/
            new webpack.BannerPlugin({
                banner: `Geolocator.js https://github.com/onury/geolocator\n@license MIT. © ${new Date().getFullYear()}, Onur Yıldırım`,
                raw: false
            })
        ],
        // https://webpack.js.org/configuration/dev-server/#devserver
        devServer: {
            // Tell the server where to serve content from. This is only
            // necessary if you want to serve static files. devServer.publicPath
            // will be used to determine where the bundles should be served
            // from, and takes precedence.
            contentBase: path.resolve(__dirname, 'example'),
            index: 'index.html',
            // enable gzip compression for everything served
            compress: true,
            host: 'localhost',
            port: 9991,
            publicPath: '/' + PUBLIC_PATH,
            // when using the HTML5 History API, the index.html page will likely
            // have to be served in place of any 404 responses.
            historyApiFallback: true,
            // enable webpack's Hot Module Replacement feature
            hot: true,
            // Whether to embed the webpack-dev-server runtime into the bundle.
            inline: false,
            // if enabled, the dev-server will only compile the bundle when it
            // gets requested. This means that webpack will not watch any file
            // changes.
            lazy: false,
            // if enabled, messages like the webpack bundle information that is
            // shown when starting up and after each save, will be hidden.
            // errors and warnings will still be shown.
            noInfo: true,
            // if enabled, the dev server will open the browser.
            open: false,
            // openPage: '',
            overlay: false,
            quiet: false,
            stats: 'normal',
            watchContentBase: true,
            watchOptions: {
                aggregateTimeout: 300,
                poll: 1000,
                ignored: /node_modules/
            }
        }
    };

    if (env.prod) {
        config.mode = 'production';
        config.output.filename = LIB_NAME + '.min.js';
        config.optimization = {
            minimize: true
        };
    }

    if (env.serve) {
        config.mode = 'development';
        config.watch = true;
        config.plugins.push(new webpack.HotModuleReplacementPlugin());
    }

    return config;

};
