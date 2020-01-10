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
            library: '[name]_[hash]'
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
                "handlebars": path.join(__dirname, "node_modules/handlebars/dist/handlebars.js"),
                "typeahead": path.join(__dirname, "node_modules/typeahead.js/dist/typeahead.jquery.js"),
                "moment": path.join(__dirname, "node_modules/moment/min/moment-with-locales.js")
            },
            mainFields: es5 ? ['browser', 'module', 'main'] : ['esm2015', 'es2015', 'jsnext:main', 'browser', 'module', 'main']
        },
        module:
        {
            rules:
            [
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
                {
                    test: require.resolve("konami"),
                    use:
                    [
                        {
                            loader: 'expose-loader',
                            options: 'Konami'
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
                name: '[name]_[hash]'
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