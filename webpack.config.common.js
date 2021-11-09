/* eslint-disable */
var extend = require('extend'),
    path = require('path');

exports.ruleKonami =
{
    test: require.resolve('konami'),
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

exports.ruleNumeral =
{
    test: require.resolve('numeral'),
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

exports.ruleJsModule =
{
    test: /\.m?js$/,
    resolve: 
    {
        fullySpecified: false
    }
};

exports.getResolve = function(ssr)
{
    return {
        symlinks: false,
        fallback:
        {
            "crypto": require.resolve("crypto-browserify"),
            "buffer": require.resolve("buffer/"),
            "stream": require.resolve("stream-browserify")
        },
        extensions: ['.ts', '*.mjs', '.js'],
        alias:
        {
            "modernizr": path.join(__dirname, "content/external/scripts/modernizr-custom.js"),
            "numeral-languages": path.join(__dirname, "node_modules/numeral/locales.js"),
            // "@angular/cdk/a11y": path.join(__dirname, "node_modules/@angular/cdk/esm2015/a11y"),
            "app": path.join(__dirname, "app")
        },
        mainFields: es5 ? ['browser', 'module', 'main'] : ssr ? ['esm2015', 'es2015', 'jsnext:main', 'module', 'main'] : ['esm2015', 'es2015', 'jsnext:main', 'browser', 'module', 'main'],
        conditionNames: ['esm2020', 'es2015']
    };
};