/* eslint-disable */
import webpack from 'webpack';
import path from 'path';
import {getResolve, ruleKonami, ruleNumeral, ruleJsModule} from './webpack.config.common.js';
import {dirName} from './webpack.resolves.cjs';

export default function(options)
{
    var ssr = !!options && !!options.ssr;
    var distPath = "wwwroot/dist";

    var config =
    {
        entry:
        {
            "dependencies":
            [
                'numeral',
                'numeral-languages',
                'konami',

                'rxjs',
                'date-fns',
                'html2canvas',
                'extend',
                'crypto-js',
                'file-saver',
                'd3',
                'marked',
                'highlight.js',
                'sourcemapped-stacktrace',
                'positions',
                '@popperjs/core',
                'store',
                'structured-log',

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
                '@anglr/common/numeral',
                '@anglr/common/positions',
                '@anglr/common/router',
                '@anglr/common/store',
                '@anglr/common/structured-log',
                '@anglr/datetime',
                '@anglr/error-handling',
                '@anglr/error-handling/html2canvas',
                '@anglr/error-handling/material',
                '@anglr/grid',
                '@anglr/grid/extensions',
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
            path: path.join(dirName, distPath),
            filename: '[name].js',
            library: '[name]_[fullhash]'
        },
        mode: 'development',
        devtool: 'source-map',
        resolve:
        {
            ...getResolve(ssr)
        },
        module:
        {
            rules:
            [
                ruleNumeral,
                ruleKonami,
                ruleJsModule,
            ]
        },
        plugins:
        [
            new webpack.DllPlugin(
            {
                path: path.join(dirName, distPath + '/[name]-manifest.json'),
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