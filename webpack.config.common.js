/* eslint-disable */
import linkerPlugin from '@angular/compiler-cli/linker/babel';
import path from 'path';
import {dirName, konamiResolve, numeralResolve, cryptoBrowserifyResolve, bufferResolve, streamBrowserifyResolve} from './webpack.resolves.cjs';

export const ruleKonami =
{
    test: konamiResolve,
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
};

export const ruleNumeral =
{
    test: numeralResolve,
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
};

export const ruleJsModule =
{
    test: /\.m?js$/,
    use: 
    {
        loader: 'babel-loader',
        options: 
        {
            plugins: [linkerPlugin],
            compact: false,
            cacheDirectory: true,
        }
    },
    resolve: 
    {
        fullySpecified: false
    }
};

export const getResolve = function(ssr)
{
    return {
        symlinks: false,
        fallback:
        {
            "crypto": cryptoBrowserifyResolve,
            "buffer": bufferResolve,
            "stream": streamBrowserifyResolve
        },
        extensions: ['.ts', '.mjs', '.js'],
        alias:
        {
            "modernizr": path.join(dirName, "content/external/scripts/modernizr-custom.js"),
            "numeral-languages": path.join(dirName, "node_modules/numeral/locales.js"),
            // "@angular/cdk/a11y": path.join(dirName, "node_modules/@angular/cdk/esm2015/a11y"),
            "handlebars": path.join(dirName, "node_modules/handlebars/dist/handlebars.js"),
            "@ngDynamic": path.join(dirName, "app/dynamicPackage"),
            "app": path.join(dirName, "app")
        },
        mainFields: ssr ? ['esm2015', 'es2015', 'jsnext:main', 'module', 'main'] : ['esm2020', 'esm2015', 'es2015', 'jsnext:main', 'browser', 'module', 'main'],
        conditionNames: ['esm2020', 'es2015']
    };
};