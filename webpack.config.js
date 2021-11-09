/* eslint-disable */
var webpack = require('webpack'),
    path = require('path'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin'),
    HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin'),
    // CopyWebpackPlugin = require('copy-webpack-plugin'),
    MiniCssExtractPlugin = require('mini-css-extract-plugin'),
    WebpackNotifierPlugin = require('webpack-notifier'),
    CompressionPlugin = require('compression-webpack-plugin'),
    SpeedMeasurePlugin = require('speed-measure-webpack-plugin'),
    BitBarWebpackProgressPlugin = require('bitbar-webpack-progress-plugin'),
    BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin,
    TerserPlugin = require('terser-webpack-plugin'),
    ts = require('typescript'),
    AngularWebpackPlugin =  require('@ngtools/webpack').AngularWebpackPlugin,
    {getResolve, ruleKonami, ruleNumeral, ruleJsModule} = require('./webpack.config.common');

/**
 * Gets entries for webpack
 * @param {boolean} ssr Indication that it should be entries for server side rendering
 * @param {boolean} css Indication that it should be css added to entries
 */
function getEntries(ssr, css)
{
    if(ssr)
    {
        return {
            server: path.join(__dirname, 'app/main.server.ts')
        };
    }
    else
    {
        var entries =
        {
            ...css ? 
            {
                externalStyle: ['@angular/material/prebuilt-themes/indigo-pink.css',
                                '@fortawesome/fontawesome-free/css/all.min.css',
                                'highlight.js/styles/vs2015.css',
                                '@anglr/common/src/style.scss'],
                style: [path.join(__dirname, 'content/site.scss'),
                        path.join(__dirname, 'content/dark.scss'),
                        path.join(__dirname, 'content/light.scss')]
            } : {},
            client: [path.join(__dirname, 'app/main.browser.ts')]
        };

        return entries;
    }
}

/**
 * Gets array of webpack loaders for external style files
 */
function getExternalStyleLoaders()
{
    return [{loader: MiniCssExtractPlugin.loader, options: {publicPath: ''}}, 'css-loader'];
}

/**
 * Gets array of webpack loaders for style files
 */
function getStyleLoaders()
{
    return [{loader: MiniCssExtractPlugin.loader, options: {publicPath: ''}}, 'css-loader', 'sass-loader'];
}

var distPath = 'wwwroot/dist';

module.exports = [function(options, args)
{
    var prod = args && args.mode == 'production' || false;
    var hmr = !!options && !!options.hmr;
    var ssr = !!options && !!options.ssr;
    var dll = !!options && !!options.dll;
    var debug = !!options && !!options.debug;
    var css = !!options && !!options.css;
    var html = !!options && !!options.html;
    var nomangle = !!options && !!options.nomangle;
    var ngsw = process.env.NGSW == 'true';

    if(!!options && options.ngsw != undefined)
    {
        ngsw = !!options.ngsw;
    }

    console.log(`Angular service worker enabled: ${ngsw}.`);

    options = options || {};

    console.log(`Running build with following configuration Production: ${prod} HMR: ${hmr} SSR: ${ssr} DLL: ${dll} Debug: ${debug} CSS: ${css} HTML: ${html}`);

    var config =
    {
        entry: getEntries(ssr, css),
        output:
        {
            globalObject: 'self',
            path: path.join(__dirname, distPath),
            filename: `[name].js`,
            publicPath: prod ? 'dist/' : '/dist/',
            chunkFilename: `[name].${ssr ? 'server' : 'client'}.chunk.js`,
            assetModuleFilename: 'assets/[hash][ext][query]'
        },
        mode: 'development',
        ...hmr ?
            {
                devServer:
                {
                    hot: true,
                    port: 9000,
                    static:
                    {
                        directory: path.join(__dirname, distPath),
                        publicPath: '/dist/',
                    },
                    devMiddleware:
                    {
                        publicPath: '/dist/',
                        writeToDisk: true,
                    },
                    client:
                    {
                        logging: 'info',
                        overlay: 
                        {
                            errors: true,
                            warnings: false
                        },
                        progress: true,
                    }
                },
                devtool: 'eval-source-map'
            } :
            {
                devtool: 'source-map'
            },
        target: ssr ? 'node' : 'web',
        //TODO remove this when https://github.com/webpack/webpack-dev-server/issues/2792 is fixed
        optimization:
        {
            runtimeChunk: 'single'
        },
        resolve:
        {
            ...getResolve(ssr)
        },
        module:
        {
            rules:
            [
                //server globals
                {
                    test: require.resolve('form-data'),
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
                    use: ['@ngtools/webpack']
                },
                ruleJsModule,
                {
                    test: /\.html$/,
                    use: ['raw-loader']
                },
                {
                    test: /\.typings$/,
                    use: ['raw-loader']
                },
                {
                    test: /\.component\.scss$/,
                    use: ['raw-loader', 'sass-loader'],
                    include:
                    [
                        path.join(__dirname, 'app')
                    ]
                },
                {
                    test: /\.component\.css$/,
                    use: ['raw-loader'],
                    include:
                    [
                        path.join(__dirname, 'packages')
                    ]
                },
                {
                    test: /\.css$/,
                    use: getExternalStyleLoaders(true),
                    exclude:
                    [
                        path.join(__dirname, 'app'),
                        path.join(__dirname, 'packages')
                    ]
                },
                {
                    test: /\.scss$/,
                    use: getStyleLoaders(true),
                    exclude:
                    [
                        path.join(__dirname, 'app')
                    ]
                },
                {
                    test: /\.(ttf|woff|woff2|eot|svg|png|jpeg|jpg|bmp|gif|icon|ico)$/,
                    type: 'asset/resource'
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
            }),
            new MiniCssExtractPlugin(
            {
                filename: prod ? '[name].[hash].css' : '[name].css',
                chunkFilename: prod ? '[id].[hash].css' : '[id].css'
            }),
            new AngularWebpackPlugin(
            {
                tsConfigPath: path.join(__dirname, 'tsconfig.json'),
                sourceMap: true,
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
                filename: '../index.html',
                template: path.join(__dirname, 'index.html'),
                inject: 'head'
            }));

            if(!debug)
            {
                config.plugins.push(new ScriptExtHtmlWebpackPlugin(
                {
                    defaultAttribute: 'defer'
                }));
            }
        }
    }

    //only if dll package is required, use only for development
    if(dll)
    {
        config.plugins.push(new webpack.DllReferencePlugin(
        {
            context: __dirname,
            manifest: require(path.join(__dirname, distPath + '/dependencies-manifest.json'))
        }));

        if(!debug && html)
        {
            config.plugins.push(new HtmlWebpackTagsPlugin(
            {
                tags: ['dependencies.js'],
                append: false
            }));
        }
    }
    else
    {
        //vendor globals
        config.module.rules.push(ruleNumeral);
        config.module.rules.push(ruleKonami);
    }

    //production specific settings - prod is used only for client part
    if(prod)
    {
        config.output.filename = `[name].[hash].js`;
        config.output.chunkFilename = `[name].${ssr ? 'server' : 'client'}.chunk.[chunkhash].js`;

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