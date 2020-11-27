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
                "./webpack.config.dev.imports"
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
            fallback:
            {
                "crypto": false
            },
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
                },
                {
                    test: /\.html$/,
                    use: 
                    {
                        loader: 'html-loader'
                    }
                },
                {
                    test: /\.scss$/,
                    use: ['style-loader', 'css-loader', 'sass-loader'],
                    exclude:
                    [
                        path.join(__dirname, "app")
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