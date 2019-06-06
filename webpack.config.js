var webpack = require('webpack'),
    path = require('path'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin'),
    HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin'),
    CopyWebpackPlugin = require('copy-webpack-plugin'),
    MiniCssExtractPlugin = require("mini-css-extract-plugin"),
    WebpackNotifierPlugin = require('webpack-notifier'),
    CompressionPlugin = require("compression-webpack-plugin"),
    //DashboardPlugin = require('webpack-dashboard/plugin'),
    SpeedMeasurePlugin = require("speed-measure-webpack-plugin"),
    BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin,
    rxPaths = require('rxjs/_esm5/path-mapping'),
    extend = require('extend'),
    // HardSourceWebpackPlugin = require('hard-source-webpack-plugin'),
    AngularCompilerPlugin =  require('@ngtools/webpack').AngularCompilerPlugin;

//array of paths for server and browser tsconfigs
const tsconfigs =
{
    client: path.join(__dirname, 'tsconfig.browser.json'),
    server: path.join(__dirname, 'tsconfig.server.json')
};

/**
 * Gets entries for webpack
 * @param {boolean} ssr Indicates that it should be entries for server side rendering
 * @param {boolean} hmr Indication that currently is running hmr build
 */
function getEntries(ssr, hmr, dll)
{
    if(ssr)
    {
        return {
            server: path.join(__dirname, "app/main.server.ts")
        };
    }
    else
    {
        var entries =
        {
            style: [path.join(__dirname, "content/site.scss")],
            client: hmr ? [path.join(__dirname, "app/main.browser.hmr.ts")] : [path.join(__dirname, "app/main.browser.ts")],
            externalStyle:
            [
                "font-awesome/css/font-awesome.min.css",
                "bootstrap/dist/css/bootstrap.min.css",
                "bootstrap/dist/css/bootstrap-theme.min.css",
                "bootstrap-select/dist/css/bootstrap-select.min.css",
                "eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css",
                "jquery.fancytree/skin-lion/ui.fancytree.css",
                "bootstrap-switch/dist/css/bootstrap3/bootstrap-switch.min.css",
                "highlight.js/styles/googlecode.css"
            ]
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
        tsConfigPath: tsconfigs[platform],
        sourceMap: true
    });
}

/**
 * Gets array of webpack loaders for typescript files
 * @param {boolean} aot Indication that currently is running build using AOT
 * @param {boolean} hmr Indication that currently is running build using HMR
 */
function getTypescriptLoaders(aot, hmr)
{
    if(aot)
    {
        return ['@ngtools/webpack'];
    }
    else
    {
        return ['awesome-typescript-loader', 'angular2-template-loader', 'webpack-lazy-module-loader']
            .concat(hmr ? ['webpack-hmr-module-loader'] : []);
    }
}

/**
 * Gets array of webpack loaders for external style files
 * @param {boolean} prod Indication that currently is running production build
 */
function getExternalStyleLoaders(prod)
{
    return prod ? [{loader: MiniCssExtractPlugin.loader, options: {publicPath: ""}}, 'css-loader'] : ['style-loader', 'css-loader'];
}

/**
 * Gets array of webpack loaders for style files
 * @param {boolean} prod Indication that currently is running production build
 */
function getStyleLoaders(prod)
{
    return prod ? [{loader: MiniCssExtractPlugin.loader, options: {publicPath: ""}}, 'css-loader', 'sass-loader'] : ['style-loader', 'css-loader', 'sass-loader'];
}

var distPath = "wwwroot/dist";

module.exports = [function(options, args)
{
    var prod = args && args.mode == 'production';
    var hmr = !!options && !!options.hmr;
    var aot = !!options && !!options.aot;
    var ssr = !!options && !!options.ssr;
    var dll = !!options && !!options.dll;
    var debug = !!options && !!options.debug;
    var ngsw = process.env.NGSW == "true";

    if(!!options && options.ngsw != undefined)
    {
        ngsw = !!options.ngsw;
    }

    console.log(`Angular service worker enabled: ${ngsw}.`);

    options = options || {};

    console.log(`Running build with following configuration Production: ${prod} Hot Module Replacement: ${hmr} Ahead Of Time Compilation: ${aot} Server Side Rendering: ${ssr} Debugging compilation: ${debug}`);

    var config =
    {
        entry: getEntries(ssr, hmr, dll),
        output:
        {
            globalObject: 'self',
            path: path.join(__dirname, distPath),
            filename: '[name].js',
            publicPath: prod ? 'dist/' : '/dist/',
            chunkFilename: `[name].${ssr ? 'server' : 'client'}.chunk.js`
        },
        mode: 'development',
        devtool: 'source-map',
        target: ssr ? 'node' : 'web',
        resolve:
        {
            extensions: ['.ts', '.js'],
            alias: extend(rxPaths(),
            {
                "modernizr": path.join(__dirname, "content/external/scripts/modernizr-custom.js"),
                "numeral-languages": path.join(__dirname, "node_modules/numeral/locales.js"),
                "handlebars": path.join(__dirname, "node_modules/handlebars/dist/handlebars.js"),
                "typeahead": path.join(__dirname, "node_modules/typeahead.js/dist/typeahead.jquery.js"),
                "jquery.fancytree": path.join(__dirname, "node_modules/jquery.fancytree/src"),
                "moment": path.join(__dirname, "node_modules/moment/min/moment-with-locales.js"),
                "config/global": path.join(__dirname, prod ? "config/global.json" : "config/global.development.json"),
                "config/version": path.join(__dirname, "config/version.json"),
                "app": path.join(__dirname, "app")
            }),
            mainFields: ['browser', 'esm2015', 'module', 'main']
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
                    test: aot ? /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/ : /\.ts$/,
                    use: getTypescriptLoaders(aot, hmr)
                },
                {
                    test: /\.html$/,
                    loader: 'raw-loader'
                },
                {
                    test: /\.typings$/,
                    loader: 'raw-loader'
                },
                {
                    test: /\.component\.scss$/,
                    use: ['raw-loader', 'sass-loader'],
                    include:
                    [
                        path.join(__dirname, "app")
                    ]
                },
                {
                    test: /\.css$/,
                    use: getExternalStyleLoaders(prod)
                },
                {
                    test: /\.scss$/,
                    use: getStyleLoaders(prod),
                    exclude:
                    [
                        path.join(__dirname, "app")
                    ]
                },
                {
                    test: /\.(ttf|woff|woff2|eot|svg|png|jpeg|jpg|bmp|gif|icon|ico)$/,
                    loader: "file-loader"
                }
            ]
        },
        plugins:
        [
            new WebpackNotifierPlugin({title: `Webpack - ${hmr ? 'HMR' : (ssr ? 'SSR' : 'BUILD')}`, excludeWarnings: true, alwaysNotify: true}),
            //copy external dependencies
            new CopyWebpackPlugin(
            [
                // {
                //     context: path.join(__dirname, "content/help"),
                //     from: '**/*.*',
                //     to: 'md'
                // },
                // {
                //     from: path.join(__dirname, "../changelog.md"),
                //     to: 'md',
                //     flatten: true
                // },
                // {
                //     from: path.join(__dirname, "../readme.md"),
                //     to: 'md',
                //     flatten: true
                // }
            ]),
            new webpack.DefinePlugin(
            {
                isProduction: prod,
                isNgsw: ngsw,
                aceDevMode: false,
                isAot: aot,
                designerMetadata: true
                // localPackage: JSON.stringify("@localDynamic/")
            })
            // new webpack.IgnorePlugin(/\.\/locale$/),
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

                if(a.names[0] == 'externalStyle')
                {
                    return -1;
                }

                if(b.names[0] == 'externalStyle')
                {
                    return 1;
                }

                return 0;
            }
        }));

        if(!debug)
        {
            config.plugins.push(new ScriptExtHtmlWebpackPlugin(
                                {
                                    defaultAttribute: 'defer'
                                }));
        }
    }

    //aot specific settings
    if(aot)
    {
        config.plugins.push(getAotPlugin(ssr ? 'server' : 'client'));
    }

    if(hmr)
    {
        config.plugins.push(new webpack.HotModuleReplacementPlugin());
        //config.plugins.push(new DashboardPlugin());

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
        config.plugins.push(new webpack.DllReferencePlugin(
        {
            context: __dirname,
            manifest: require(path.join(__dirname, distPath + '/dependencies-manifest.json'))
        }));

        if(!debug)
        {
            config.plugins.push(new HtmlWebpackIncludeAssetsPlugin(
            {
                assets: ['dependencies.js'],
                append: false
            }));
        }
    }

    //production specific settings - prod is used only for client part
    if(prod)
    {
        config.output.filename = "[name].[hash].js";
        config.output.chunkFilename = `[name].${ssr ? 'server' : 'client'}.chunk.[chunkhash].js`;

        config.plugins.push(new MiniCssExtractPlugin(
        {
            filename: '[name].[hash].css',
            chunkFilename: '[id].[hash].css',
        }));

        config.plugins.push(new CompressionPlugin({test: /\.js$|\.css$/}));
    }
    else
    {
        // config.plugins.push(new HardSourceWebpackPlugin());
        // config.plugins.push(new HardSourceWebpackPlugin.ExcludeModulePlugin(
        // [
        //     {
        //         test: /mini-css-extract-plugin[\\/]dist[\\/]loader/,
        //     }
        // ]));
    }

    //this is used for debugging speed of compilation
    if(debug)
    {
        config.plugins.push(new BundleAnalyzerPlugin());

        let smp = new SpeedMeasurePlugin({outputFormat: 'humanVerbose'});

        return smp.wrap(config);
    }

    return config;
},
{
    mode: 'development',
    entry: 
    {
		"editor.worker": 'monaco-editor/esm/vs/editor/editor.worker.js',
		"json.worker": 'monaco-editor/esm/vs/language/json/json.worker',
		"css.worker": 'monaco-editor/esm/vs/language/css/css.worker',
		"html.worker": 'monaco-editor/esm/vs/language/html/html.worker',
		"ts.worker": 'monaco-editor/esm/vs/language/typescript/ts.worker'
	},
    output: 
    {
		globalObject: 'self',
		path: path.join(__dirname, distPath),
        filename: '[name].js'
	},
    module: 
    {
		rules: [
        {
			test: /\.css$/,
			use: ['style-loader', 'css-loader']
		}]
	},
}]