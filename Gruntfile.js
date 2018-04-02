/*!
 *  Grunt Configurations
 */
module.exports = function (grunt) {
    'use strict';

    var path = require('path');
    var webpack = require('webpack');

    var params = {
        libName: 'geolocator', // lib variable
        libFileName: 'geolocator', // file name
        srcPath: path.resolve(__dirname, 'src'),
        outPath: path.resolve(__dirname, 'dist'),
        entryPath: path.resolve(__dirname, 'src/index.js'),
        pagePath: path.resolve(__dirname, 'example/index.html'),
        publicPath: 'dist/',
        host: 'localhost',
        port: 9991
    };
    params.baseURL = 'http://' + params.host + ':' + params.port + '/';

    var webpackConfig = require('./webpack.config.js')(params);

    // ----------------------------
    //  GRUNT CONFIG
    // ----------------------------

    grunt.initConfig({

        // 'pkg': grunt.file.readJSON('package.json'),

        // ----------------------------
        //  CONFIGURE TASKS
        // ----------------------------

        'docma': {
            traceFatal: true,
            options: {
                config: './docma.config.json'
            }
        },

        'copy': {
            options: {
                mode: false,
                encoding: 'utf-8'
            },
            'example': {
                files: [
                    {
                        expand: true,
                        nonull: true,
                        flatten: false,
                        // change working directory to copy the contents only,
                        // without the root folder "example"
                        cwd: 'example',
                        src: [
                            // copy the example folder contents to
                            // onury.github.io/geolocator-example directory,
                            // excluding iframed.html which is used by Docma config.
                            '**',
                            '!iframed.html'
                        ],
                        dest: '../../onury.github.io/geolocator-example/'
                    }
                ]
            },
            'dist': {
                files: [
                    {
                        expand: true,
                        src: [
                            'dist/geolocator.min.js'
                        ],
                        dest: '../../onury.github.io/',
                        // rename geolocator.min.js to geolocator.js bec.
                        // example/index.html has reference to geolocator.js not
                        // geolocator.min.js - otherwise, webpack-server will
                        // not hot-update.
                        rename: function (dest) { // (dest, src)
                            return dest + 'dist/geolocator.js';
                        }
                    }
                ]
            }
        },

        'webpack': {
            options: webpackConfig.main,
            watch: {
                watch: true,
                keepalive: true
            },
            full: {},
            min: {
                output: {
                    filename: params.libFileName + '.min.js'
                },
                plugins: [
                    new webpack.optimize.UglifyJsPlugin({
                        minimize: true,
                        sourceMap: true,
                        warnings: true
                    })
                ]
            }
        },

        // this is for browser (manual) tests
        'webpack-dev-server': webpackConfig.server,

        // this is for jasmine tests
        'connect': {
            server: {
                options: {
                    port: 8181
                }
            }
        },

        'jasmine': {
            dist: {
                src: 'dist/' + params.libFileName + '.js',
                options: {
                    specs: 'test/*.spec.js',
                    helpers: 'test/*.helper.js',
                    host: 'http://localhost:8181/'
                }
            }
        },

        'watch': {
            test: {
                options: {
                    // Setting `spawn:false` is very problematic. See
                    // grunt-contrib- watch issues. (Default is `spawn:true`)
                    // spawn: false
                },
                files: [
                    'src/**/*',
                    'test/*.spec.js'
                ],
                tasks: ['jasmine']
            }
        }
    });

    // ----------------------------
    //  LOAD GRUNT PLUGINS
    // ----------------------------

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // ----------------------------
    //  REGISTER TASKS
    // ----------------------------

    grunt.registerTask('doc', ['docma', 'copy:example', 'copy:dist']);
    grunt.registerTask('min', ['webpack:min']);
    grunt.registerTask('build', ['webpack:full', 'webpack:min']);
    grunt.registerTask('build-all', ['build', 'doc']);
    grunt.registerTask('test', ['build', 'connect', 'watch:test']);
    grunt.registerTask('watch-compile', ['watch:compile']);

    // Open either one:
    // http://localhost:8181/webpack-dev-server
    // http://localhost:8181/example
    // http://localhost:8181/webpack-dev-server/example
    grunt.registerTask('serve', ['webpack-dev-server:start']);

    grunt.registerTask('default', ['serve']);

    // Development:
    // run grunt build
    // run 2 tasks in separate terminals:
    // grunt serve (and open http://localhost:9991/example)
    // grunt watch (for auto-compiling templates and auto-running jasmine tests)
};
