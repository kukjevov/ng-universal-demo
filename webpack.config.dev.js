var webpack = require('webpack'),
    path = require('path');

module.exports = function(options)
{
    var es5 = !!options && !!options.es5;
    var distPath = "wwwroot/dist";

    var config =
    {
        entry:
        {
            "dependencies":
            [
                'core-js/es6',
                'core-js/es7/reflect',
                'numeral',
                'numeral-languages',
                'konami',

                'moment',
                'html2canvas',
                'extend',
                'jquery-param',
                'crypto-js',
                'file-saver',
                'd3',
                'marked',
                'highlight.js',
                'sourcemapped-stacktrace',
                'positions',
                'store',

                '@jscrpt/common',
                '@angular/animations',
                '@angular/core',
                '@angular/core/testing',
                '@angular/compiler',
                '@angular/common',
                '@angular/common/testing',
                '@angular/common/http',
                '@angular/platform-browser',
                '@angular/platform-browser-dynamic',
                '@angular/platform-browser-dynamic/testing',
                '@angular/forms',
                '@angular/router',
                '@angular/router/testing',
                '@angular/material/dialog',
                '@anglr/animations',
                '@anglr/authentication',
                '@anglr/common',
                '@anglr/common/hmr',
                '@anglr/common/forms',
                '@anglr/common/numeral',
                '@anglr/common/router',
                '@anglr/common/hotkeys',
                '@anglr/common/store',
                '@anglr/common/positions',
                '@anglr/datetime',
                '@anglr/datetime/moment',
                '@anglr/error-handling',
                '@anglr/grid',
                '@anglr/grid/material',
                '@anglr/md-help/web',
                '@anglr/notifications',
                '@anglr/rest',
                '@anglr/select',
                '@anglr/translate-extensions',
                '@ngx-translate/core',
                'angular2-hotkeys'
            ]
        },
        output:
        {
            path: path.join(__dirname, distPath),
            filename: '[name].js',
            library: '[name]_[fullhash]'
        },
        mode: 'development',
        devtool: 'source-map',
        resolve:
        {
            symlinks: false,
            extensions: ['.ts', '.js'],
            alias:
            {
                "numeral-languages": path.join(__dirname, "node_modules/numeral/locales.js"),
                "moment": path.join(__dirname, "node_modules/moment/min/moment-with-locales.js"),
                "@angular/cdk/a11y": path.join(__dirname, "node_modules/@angular/cdk/esm2015/a11y")
            },
            mainFields: es5 ? ['browser', 'module', 'main'] : ['esm2015', 'es2015', 'jsnext:main', 'browser', 'module', 'main']
        },
        module:
        {
            rules:
            [
                {
                    test: require.resolve("numeral"),
                    use:
                    [
                        {
                            loader: 'expose-loader',
                            options:
                            {
                                exposes: 'numeral'
                            }
                        }
                    ]
                },
                {
                    test: require.resolve("konami"),
                    use:
                    [
                        {
                            loader: 'expose-loader',
                            options:
                            {
                                exposes: 'Konami'
                            }
                        }
                    ]
                }
            ]
        },
        plugins:
        [
            new webpack.DllPlugin(
            {
                path: path.join(__dirname, distPath + '/[name]-manifest.json'),
                name: '[name]_[fullhash]'
            }),
            new webpack.DefinePlugin(
            {
                jsDevMode: true
            }),
            new webpack.HotModuleReplacementPlugin()
        ]
    };

    return config;
};