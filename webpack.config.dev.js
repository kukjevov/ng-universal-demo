var webpack = require('webpack'),
    path = require('path'),
    {getResolve, ruleKonami, ruleNumeral} = require('./webpack.config.common');

module.exports = function(options)
{
    var es5 = !!options && !!options.es5;
    var ssr = !!options && !!options.ssr;
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
                '@anglr/common/forms',
                '@anglr/common/hmr',
                '@anglr/common/hotkeys',
                '@anglr/common/material',
                '@anglr/common/moment',
                '@anglr/common/numeral',
                '@anglr/common/positions',
                '@anglr/common/router',
                '@anglr/common/store',
                '@anglr/common/structured-log',
                '@anglr/datetime',
                '@anglr/datetime/moment',
                '@anglr/error-handling',
                '@anglr/error-handling/html2canvas',
                '@anglr/error-handling/material',
                '@anglr/grid',
                '@anglr/grid/extensions',
                '@anglr/grid/material',
                '@anglr/md-help/web',
                '@anglr/notifications',
                '@anglr/rest',
                '@anglr/rest/stompjs',
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
            ...getResolve(es5, ssr)
        },
        module:
        {
            rules:
            [
                ruleNumeral,
                ruleKonami
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