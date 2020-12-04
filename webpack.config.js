var webpack = require('webpack'),
    path = require('path'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin'),
    HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin'),
    // CopyWebpackPlugin = require('copy-webpack-plugin'),
    MiniCssExtractPlugin = require("mini-css-extract-plugin"),
    WebpackNotifierPlugin = require('webpack-notifier'),
    CompressionPlugin = require("compression-webpack-plugin"),
    SpeedMeasurePlugin = require("speed-measure-webpack-plugin"),
    BitBarWebpackProgressPlugin = require("bitbar-webpack-progress-plugin"),
    BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin,
    TerserPlugin = require('terser-webpack-plugin'),
    extend = require('extend'),
    ts = require('typescript'),
    AngularCompilerPlugin =  require('@ngtools/webpack').AngularCompilerPlugin;

/**
 * Gets entries for webpack
 * @param {boolean} ssr Indication that it should be entries for server side rendering
 * @param {boolean} css Indication that it should be css added to entries
 * @param {boolean} diff Indication that it should be js added to entries
 */
function getEntries(ssr, css, diff)
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
            ...css ? {
                         externalStyle: ["@angular/material/prebuilt-themes/indigo-pink.css",
                                         "@fortawesome/fontawesome-free/css/all.min.css",
                                         "highlight.js/styles/googlecode.css",
                                         "@anglr/common/src/style.scss"],
                         style: [path.join(__dirname, "content/site.scss"),
                                 path.join(__dirname, "content/dark.scss"),
                                 path.join(__dirname, "content/light.scss")]
                     } : {},
            ...diff ? {} : {client: [path.join(__dirname, "app/main.browser.ts")]}
        };

        return entries;
    }
}

/**
 * Generates a AotPlugin for @ngtools/webpack
 *
 * @param {boolean} es5 Indication whether compile application in es5 or es2015
 */
function getAotPlugin(es5)
{
    return new AngularCompilerPlugin(
    {
        tsConfigPath: path.join(__dirname, 'tsconfig.json'),
        sourceMap: true,
        compilerOptions:
        {
            target: es5 ? ts.ScriptTarget.ES5 : ts.ScriptTarget.ES2015
        }
    });
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
    var prod = args && args.mode == 'production' || false;
    var hmr = !!options && !!options.hmr;
    var aot = !!options && !!options.aot;
    var ssr = !!options && !!options.ssr;
    var debug = !!options && !!options.debug;
    var es5 = !!options && !!options.es5;
    var css = !!options && !!options.css;
    var html = !!options && !!options.html;
    var nomangle = !!options && !!options.nomangle;
    var diff = !!options && !!options.diff;
    var ngsw = process.env.NGSW == "true";

    if(!!options && options.ngsw != undefined)
    {
        ngsw = !!options.ngsw;
    }

    console.log(`Angular service worker enabled: ${ngsw}.`);

    options = options || {};

    console.log(`Running build with following configuration Production: ${prod} HMR: ${hmr} AOT Compilation: ${aot} SSR: ${ssr} Debug: ${debug} ES5: ${es5} CSS: ${css} HTML: ${html} Differential build: ${diff}`);

    var config =
    {
        entry: getEntries(ssr, css, diff),
        output:
        {
            globalObject: 'self',
            path: path.join(__dirname, distPath),
            filename: `[name].${diff ? 'file' : es5 ? 'es5' : 'es2015'}.js`,
            publicPath: prod ? 'dist/' : '/dist/',
            chunkFilename: `[name].${ssr ? 'server' : 'client'}.${es5 ? 'es5' : 'es2015'}.chunk.js`
        },
        mode: 'development',
        ...hmr ?
            {
                devServer:
                {
                    hot: true,
                    port: 9000,
                    publicPath: '/dist/',
                    contentBase: path.join(__dirname, distPath),
                    contentBasePublicPath: '/dist/',
                    writeToDisk: true,
                    overlay: true
                }
            } :
            {
                devtool: 'source-map'
            },
        target: ssr ? 'node' : 'web',
        //TODO remove this when https://github.com/webpack/webpack-dev-server/issues/2792 is fixed
        optimization:
        {
            runtimeChunk: "single"
        },
        resolve:
        {
            symlinks: false,
            extensions: ['.ts', '.js'],
            alias: extend(es5 ? require('rxjs/_esm5/path-mapping')() : require('rxjs/_esm2015/path-mapping')(),
            {
                "modernizr": path.join(__dirname, "content/external/scripts/modernizr-custom.js"),
                "numeral-languages": path.join(__dirname, "node_modules/numeral/locales.js"),
                "moment": path.join(__dirname, "node_modules/moment/min/moment-with-locales.js"),
                "@angular/cdk/a11y": path.join(__dirname, "node_modules/@angular/cdk/esm2015/a11y"),
                "app": path.join(__dirname, "app")
            }),
            mainFields: es5 ? ['browser', 'module', 'main'] : ssr ? ['esm2015', 'es2015', 'jsnext:main', 'module', 'main'] : ['esm2015', 'es2015', 'jsnext:main', 'browser', 'module', 'main']
        },
        module:
        {
            rules:
            [
                //vendor globals
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
                //server globals
                {
                    test: require.resolve("form-data"),
                    use:
                    [
                        {
                            loader: 'expose-loader',
                            options:
                            {
                                exposes: 'FormData'
                            }
                        }
                    ]
                },
                //file processing
                {
                    test: /\.ts$/,
                    loader: '@ngtools/webpack'
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
                    test: /\.component\.css$/,
                    use: 'raw-loader',
                    include:
                    [
                        path.join(__dirname, "packages")
                    ]
                },
                {
                    test: /\.css$/,
                    use: getExternalStyleLoaders(prod),
                    exclude:
                    [
                        path.join(__dirname, "app"),
                        path.join(__dirname, "packages")
                    ]
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
            new WebpackNotifierPlugin({title: `Webpack - ${hmr ? 'HMR' : (ssr ? 'SSR' : 'BUILD')}`, excludeWarnings: true, alwaysNotify: true, sound: false}),
            //copy external dependencies
            // new CopyWebpackPlugin(
            // {
            // }),
            new BitBarWebpackProgressPlugin(),
            new webpack.DefinePlugin(
            {
                isProduction: prod,
                isNgsw: ngsw,
                jsDevMode: !prod,
                ...prod ? {ngDevMode: false} : {},
                ngI18nClosureMode: false
            })
        ]
    };

    if(prod && nomangle)
    {
        config.optimization =
        {
            minimize: true,
            minimizer:
            [
                new TerserPlugin(
                {
                    terserOptions:
                    {
                        mangle: false
                    }
                })
            ]
        };
    }

    //server specific settings
    if(ssr)
    {
    }
    //client specific settings
    else
    {
        if(html)
        {
            config.plugins.push(new HtmlWebpackPlugin(
            {
                filename: "../index.html",
                template: path.join(__dirname, "index.html"),
                inject: 'head'
            }));

            if(!debug)
            {
                let scriptOptions =
                {
                    defaultAttribute: 'defer'
                };

                if(diff)
                {
                    scriptOptions =
                    {
                        custom:
                        [
                            {
                                test: /es2015\.js$/,
                                attribute: 'type',
                                value: 'module'
                            },
                            {
                                test: /es5\.js$/,
                                attribute: 'nomodule',
                                value: true
                            }
                        ]
                    };
                }

                config.plugins.push(new ScriptExtHtmlWebpackPlugin(scriptOptions));
            }
        }
    }

    //aot specific settings
    if(aot)
    {
        config.plugins.push(getAotPlugin(es5));
    }

    //Webpack 5 using WEBPACK DEV SERVER
    // if(hmr)
    // {
    //     config.plugins.push(new webpack.HotModuleReplacementPlugin());

    //     Object.keys(config.entry).forEach(entry =>
    //     {
    //         if(config.entry[entry].constructor === Array)
    //         {
    //             config.entry[entry].unshift('webpack-hot-middleware/client');
    //         }
    //     });
    // }

    //generate html with differential loading, old and modern scripts
    if(html && diff)
    {
        config.plugins.push(new HtmlWebpackTagsPlugin(
        {
            tags:
            [
                {
                    path: distPath,
                    glob: '*es2015.js',
                    globFlatten: true,
                    globPath: distPath
                }
            ],
            append: true
        }));

        config.plugins.push(new HtmlWebpackTagsPlugin(
        {
            tags:
            [
                {
                    path: distPath,
                    glob: '*es5.js',
                    globFlatten: true,
                    globPath: distPath
                }
            ],
            append: true
        }));
    }

    //production specific settings - prod is used only for client part
    if(prod)
    {
        config.output.filename = `[name].[hash].${diff ? 'file' : es5 ? 'es5' : 'es2015'}.js`;
        config.output.chunkFilename = `[name].${ssr ? 'server' : 'client'}.${es5 ? 'es5' : 'es2015'}.chunk.[chunkhash].js`;

        config.plugins.push(new MiniCssExtractPlugin(
        {
            filename: '[name].[hash].css',
            chunkFilename: '[id].[hash].css',
        }));

        config.plugins.push(new CompressionPlugin({test: /\.js$|\.css$/}));
    }

    //this is used for debugging speed of compilation
    if(debug)
    {
        config.plugins.push(new BundleAnalyzerPlugin());

        let smp = new SpeedMeasurePlugin({outputFormat: 'humanVerbose'});

        return smp.wrap(config);
    }

    return config;
}];