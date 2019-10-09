var webpack = require('webpack'),
    webpackConfig = require('./webpack.config.js');

async function buildWebpack(configuration)
{
    let promiseResolve;
    let promiseReject;

    let promise = new Promise((resolve, reject) =>
    {
        promiseResolve = resolve;
        promiseReject = reject;
    });

    var cfg = webpackConfig(configuration, {mode: "production"});
    cfg.mode = "production";
    var compiler = webpack(cfg);

    compiler.run((err, stats) =>
    {
        if(err)
        {
            promiseReject(err.message);

            return;
        }

        console.log(stats.toString(
        {
            colors: true,
            chunks: false
        }));

        promiseResolve();
    });

    await promise;
}

async function build()
{
    //COMPILE JS for ES5
    await buildWebpack({aot: true, es5: true});
    await buildWebpack({aot: true});
    await buildWebpack({css: true, html: true, diff: true});
}

build();