var path = require('path'),
    webpack = require('webpack');

module.exports = function(config)
{
    var distPath = "wwwroot/dist";

    config.set(
    {
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '.',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: 
        [
            path.join(__dirname, distPath + '/dependencies.js'),
            'karma-test-shim.ts',
            '**/*.spec.ts'
        ],

        // list of files to exclude
        exclude:
        [
            'node_modules/**/*.spec.ts'
        ],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors:
        {
            '**/*.ts': 'webpack'
        },

        mime: 
        {
            'text/x-typescript': ['ts','tsx']
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress', 'kjhtml', 'junit'],

        // the default configuration
        junitReporter: 
        {
            outputDir: 'testResults', // results will be saved as $outputDir/$browserName.xml
            outputFile: 'angularTestResults.xml', // if included, results will be saved as $outputDir/$browserName/$outputFile
            suite: '', // suite will become the package name attribute in xml testsuite element
            useBrowserName: false, // add browser name to report and classes names
            nameFormatter: undefined, // function (browser, result) to customize the name attribute in xml testcase element
            classNameFormatter: undefined, // function (browser, result) to customize the classname attribute in xml testcase element
            properties: {}, // key value pair of properties to add to the <properties> section of the report
            xmlVersion: null // use '1' if reporting to be per SonarQube 6.2 XML format
        },

        webpack: 
        {
            output:
            {
                publicPath: '/dist/'
            },
            devtool: 'source-map',
            resolve:
            {
                extensions: ['.ts', '.js'],
                alias:
                {
                    "numeral-languages": path.join(__dirname, "node_modules/numeral/locales.js"),
                    "handlebars": path.join(__dirname, "node_modules/handlebars/dist/handlebars.js"),
                    "typeahead": path.join(__dirname, "node_modules/typeahead.js/dist/typeahead.jquery.js"),
                    "moment": path.join(__dirname, "node_modules/moment/min/moment-with-locales.js"),
                    "config/global": path.join(__dirname, "config/global.development.json"),
                    "config/version": path.join(__dirname, "config/version.json"),
                    "app": path.join(__dirname, "app")
                }
            },
            module:
            {
                rules:
                [
                    //vendor globals
                    {
                        test: require.resolve("jquery"),
                        use:
                        [
                            {
                                loader: 'expose-loader',
                                options: '$'
                            },
                            {
                                loader: 'expose-loader',
                                options: 'jQuery'
                            }
                        ]
                    },
                    {
                        test: require.resolve("numeral"),
                        use:
                        [
                            {
                                loader: 'expose-loader',
                                options: 'numeral'
                            }
                        ]
                    },
                    //file processing
                    {
                        test: /\.ts$/,
                        use: ['awesome-typescript-loader?sourceMap=true', 'angular2-template-loader', 'webpack-lazy-module-loader']
                    },
                    {
                        test: /\.html$/,
                        loader: 'raw-loader'
                    },
                    {
                        test: /\.css$/,
                        loader: 'raw-loader'
                    },
                    {
                        test: /\.scss$/,
                        use: ['style-loader', 'css-loader', 'sass-loader']
                    },
                    {
                        test: /\.(ttf|eot|svg|png)$/,
                        loader: "file-loader"
                    }
                ]
            },
            plugins:
            [
                new webpack.DllReferencePlugin(
                {
                    context: __dirname,
                    manifest: require(path.join(__dirname, distPath + '/dependencies-manifest.json'))
                })
            ]
        },

        webpackMiddleware: 
        {
            // webpack-dev-middleware configuration
            stats: 'errors-only',
            publicPath: '/dist/'
        },

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        //browsers: ['PhantomJS', 'Chrome'],
        browsers: ['PhantomJS'],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false
    });
};