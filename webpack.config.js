var webpack = require('webpack'),
    path = require('path'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin'),
    HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin'),
    CopyWebpackPlugin = require('copy-webpack-plugin'),
    ExtractTextPlugin = require("extract-text-webpack-plugin"),
    DashboardPlugin = require('webpack-dashboard/plugin'),
    rxPaths = require('rxjs/_esm5/path-mapping'),
    extend = require('extend'),
    AngularCompilerPlugin =  require('@ngtools/webpack').AngularCompilerPlugin;

//array of paths for server and browser tsconfigs
const tsconfigs =
{
    client: path.join(__dirname, 'tsconfig.browser.json'),
    server: path.join(__dirname, 'tsconfig.server.json')
};

/**
 * Gets entries for webpack
 * @param {boolean} aot Indicates that it should be AOT entries
 * @param {boolean} ssr Indicates that it should be entries for server side rendering
 * @param {boolean} prod Indication that currently is running production build
 * @param {boolean} hmr Indication that currently is running hmr build
 */
function getEntries(aot, ssr, prod, hmr, dll)
{
    if(ssr)
    {
        return {
            server: aot ? path.join(__dirname, "app.aot/main.server.ts") : path.join(__dirname, "app/main.server.ts")
        };
    }
    else
    {
        var entries =
        {
            style: [path.join(__dirname, "content/site.scss")],
            client: hmr ? [path.join(__dirname, "app/main.browser.hmr.ts")] : (aot ? [path.join(__dirname, "app.aot/main.browser.ts")] : [path.join(__dirname, "app/main.browser.ts")])
        };

        if(dll)
        {
            entries['import-dependencies'] = './webpack.config.dev.imports';
        }

        return entries;
    }
}

/**
 * Generates a AotPlugin for @ngtools/webpack
 *
 * @param {string} platform Should either be client or server
 * @returns
 */
function getAotPlugin(platform)
{
    return new AngularCompilerPlugin(
    {
        tsConfigPath: tsconfigs[platform]
    });
}

/**
 * Gets array of webpack loaders for typescript files
 * @param {boolean} prod Indication that currently is running production build
 * @param {boolean} aot Indication that currently is running build using AOT
 * @param {boolean} hmr Indication that currently is running build using HMR
 */
function getTypescriptLoaders(prod, aot, hmr)
{
    if(aot)
    {
        return ['@ngtools/webpack'];
    }
    else
    {
        return ['awesome-typescript-loader' + (prod ? '' : '?sourceMap=true'), 'angular2-template-loader', 'webpack-lazy-module-loader'].concat(hmr ? ['webpack-hmr-module-loader'] : []);
    }
}

/**
 * Gets array of webpack loaders for style files
 * @param {boolean} prod Indication that currently is running production build
 */
function getStyleLoaders(prod)
{
    return prod ? ExtractTextPlugin.extract({fallback: "style-loader", use: ['css-loader', 'sass-loader'], publicPath: ""}) : ['style-loader', 'css-loader', 'sass-loader'];
}

module.exports = function(options)
{
    var prod = !!options && !!options.prod;
    var hmr = !!options && !!options.hmr;
    var aot = !!options && !!options.aot;
    var ssr = !!options && !!options.ssr;
    var dll = !!options && !!options.dll;
    var distPath = "wwwroot/dist";
    options = options || {};

    console.log(`Running build with following configuration Production: ${prod} Hot Module Replacement: ${hmr} Ahead Of Time Compilation: ${aot} Server Side Rendering: ${ssr}`)

    var config =
    {
        entry: getEntries(aot, ssr, prod, hmr, dll),
        output:
        {
            path: path.join(__dirname, distPath),
            filename: '[name].js',
            publicPath: prod ? 'dist/' : '/dist/',
            chunkFilename: `[name].${ssr ? 'server' : 'client'}.chunk.js`
        },
        devtool: prod ? false : 'source-map',
        target: ssr ? 'node' : 'web',
        resolve:
        {
            extensions: ['.ts', '.js'],
            alias: extend(rxPaths(), 
            {
                "numeral-languages": path.join(__dirname, "node_modules/numeral/locales.js"),
                "handlebars": path.join(__dirname, "node_modules/handlebars/dist/handlebars.js"),
                "typeahead": path.join(__dirname, "node_modules/typeahead.js/dist/typeahead.jquery.js"),
                "jquery.fancytree": path.join(__dirname, "node_modules/jquery.fancytree/src"),
                "moment": path.join(__dirname, "node_modules/moment/min/moment-with-locales.js"),
                "config/global": path.join(__dirname, prod ? "config/global.json" : "config/global.development.json"),
                "config/version": path.join(__dirname, "config/version.json"),
                "app": path.join(__dirname, "app")
            })
        },
        module:
        {
            rules:
            [
                //server globals
                {
                    test: require.resolve("form-data"),
                    use:
                    [
                        {
                            loader: 'expose-loader',
                            options: 'FormData'
                        }
                    ]
                },
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
                    use: getTypescriptLoaders(prod, aot, hmr)
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
                    use: getStyleLoaders(prod)
                },
                {
                    test: /\.(ttf|eot|svg|png)$/,
                    loader: "file-loader"
                }
            ]
        },
        plugins:
        [
            //new DashboardPlugin(),
            new webpack.optimize.ModuleConcatenationPlugin(),
            //copy external dependencies
            new CopyWebpackPlugin(
            [
                {
                    from: path.join(__dirname, "node_modules/font-awesome/css/*.*"),
                    to: 'css/fa/css',
                    flatten: true
                },
                {
                    from: path.join(__dirname, "node_modules/font-awesome/fonts/*.*"),
                    to: 'css/fa/fonts',
                    flatten: true
                },
                {
                    from: path.join(__dirname, "node_modules/bootstrap/dist/css/*.*"),
                    to: 'css/b/css',
                    flatten: true
                },
                {
                    from: path.join(__dirname, "node_modules/bootstrap/dist/fonts/*.*"),
                    to: 'css/b/fonts',
                    flatten: true
                },
                {
                    from: path.join(__dirname, "node_modules/bootstrap-select/dist/css/*.*"),
                    to: 'css',
                    flatten: true
                },
                {
                    from: path.join(__dirname, "node_modules/eonasdan-bootstrap-datetimepicker/build/css/*.*"),
                    to: 'css',
                    flatten: true
                },
                {
                    from: path.join(__dirname, "node_modules/jquery.fancytree/src/skin-lion/*.*"),
                    to: 'css/fancytree',
                    flatten: true
                },
                {
                    from: path.join(__dirname, "node_modules/bootstrap-switch/dist/css/bootstrap3/*.min.css"),
                    to: 'css',
                    flatten: true
                }
            ]),
            //include external dependencies
            new HtmlWebpackIncludeAssetsPlugin(
            {
                assets: 
                [
                    'css/fa/css/font-awesome.min.css',
                    'css/b/css/bootstrap.min.css',
                    'css/b/css/bootstrap-theme.min.css',
                    'css/bootstrap-select.min.css',
                    'css/bootstrap-datetimepicker.min.css',
                    'css/fancytree/ui.fancytree.css',
                    'css/bootstrap-switch.min.css'
                ],
                append: false,
                hash: prod
            }),
            new webpack.DefinePlugin(
            {
                isProduction: prod
            })
        ]
    };

    //server specific settings
    if(ssr)
    {
    }
    //client specific settings
    else
    {
        config.plugins.push(new HtmlWebpackPlugin(
        {
            filename: "../index.html",
            template: path.join(__dirname, "index.html"),
            inject: 'head',
            chunksSortMode: function orderEntryLast(a, b)
            {
                //import-dependencies always as first
                if(a.names[0] == 'import-dependencies')
                {
                    return -1;
                }

                if(b.names[0] == 'import-dependencies')
                {
                    return 1;
                }

                return 0;
            }
        }));
    }

    //aot specific settings
    if(aot)
    {
        config.plugins.unshift(getAotPlugin(ssr ? 'server' : 'client'));
    }

    if(hmr)
    {
        config.plugins.unshift(new webpack.HotModuleReplacementPlugin());

        Object.keys(config.entry).forEach(entry =>
        {
            if(config.entry[entry].constructor === Array)
            {
                config.entry[entry].unshift('webpack-hot-middleware/client');
            }
        });
    }

    //only if dll package is required, use only for development
    if(dll)
    {
        config.plugins.unshift(new webpack.DllReferencePlugin(
        {
            context: __dirname,
            manifest: require(path.join(__dirname, distPath + '/dependencies-manifest.json'))
        }));

        config.plugins.unshift(new HtmlWebpackIncludeAssetsPlugin(
        {
            assets: ['dependencies.js'],
            append: false
        }));
    }

    //production specific settings - prod is used only for client part
    if(prod)
    {
        config.output.filename = "[name].[hash].js";
        config.output.chunkFilename = `[name].${ssr ? 'server' : 'client'}.chunk.[chunkhash].js`;

        config.plugins.unshift(new webpack.optimize.UglifyJsPlugin({
                                                                       beautify: false,
                                                                       mangle:
                                                                       {
                                                                           screw_ie8: true,
                                                                           keep_fnames: true
                                                                       },
                                                                       compress:
                                                                       {
                                                                           warnings: false,
                                                                           screw_ie8: true
                                                                       },
                                                                       comments: false,
                                                                       sourceMap: false
                                                                   }));

        config.plugins.push(new ExtractTextPlugin("style.[contenthash].css"));
    }

    return config;
}