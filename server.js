var connect = require('connect'),
    gzipStatic = require('connect-gzip-static'),
    history = require('connect-history-api-fallback'),
    proxy = require('http-proxy-middleware'),
    argv = require('yargs').argv,
    path = require('path'),
    //DashboardPlugin = require('webpack-dashboard/plugin'),
    url = require('url'),
    fs = require('fs'),
    https = require('https'),
    connectExtensions = require('ace-nodejs-connect-extensions');

var app = connect();

connectExtensions.extendConnectUse(app);

const oneDay = 86400000;
const wwwroot = "wwwroot";
const serverPath = path.join(__dirname, wwwroot, 'dist/server.js');
const proxyUrlFile = path.join(__dirname, 'proxyUrl.js');
var serverRenderFunc;
var proxyUrl = "http://127.0.0.1:8080";

var key = fs.readFileSync('server.key');
var cert = fs.readFileSync('server.crt');

var options = 
{
    key: key,
    cert: cert
  };

/**
 * Gets function used for server side rendering
 */
function getServerRenderFunc()
{
    if(!serverRenderFunc || !!argv.webpack)
    {
        serverRenderFunc = require(serverPath).serverRender;
    }

    return serverRenderFunc;
}

function isRequireAvailable(path)
{
    try
    {
        require.resolve(path);
    }
    catch(e)
    {
        return false;
    }

    return true;
}

if(isRequireAvailable(proxyUrlFile))
{
    proxyUrl = require(proxyUrlFile);
}

console.log(`Using proxy url '${proxyUrl}'`);

//enable webpack only if run with --webpack param
if(!!argv.webpack)
{
    var webpack = require('webpack'),
        webpackConfig = require('./webpack.config.js')({hmr: true, dll: true}),
        webpackDev = require('webpack-dev-middleware'),
        hmr = require("webpack-hot-middleware");

    var compiler = webpack(webpackConfig);
    //compiler.apply(new DashboardPlugin());

    //enables webpack dev middleware
    app.use(webpackDev(compiler,
    {
        publicPath: webpackConfig.output.publicPath
    }));

    app.use(hmr(compiler));
}

//mock rest api
require('./server.mock')(app);

//proxy special requests to other location
app.use(proxy(['/api'], {target: proxyUrl, ws: true}));

//enable html5 routing
app.use(history());

//angular server side rendering
app.use(function (req, res, next)
{
    if(req.url == '/index.html')
    {
        if(!isRequireAvailable(serverPath))
        {
            next();

            return;
        }

        getServerRenderFunc()(path.join(__dirname, wwwroot, 'index.html'), req.originalUrl, {baseUrl: "http://localhost:8888/", requestCookies: req.headers['cookie']}, function(err, succ)
        {
            res.setHeader('Content-Type', 'text/html');

            if(succ && succ.statusCode)
            {
                res.statusCode = succ.statusCode;
            }

            res.end((err && err.toString()) || succ.html);
        });

        return;
    }

    next();
});

//enable browsersync only if run with --browsersync param
//used for writing documentation
if(!!argv.browsersync)
{
    var browserSync = require('browser-sync');
    var bs = browserSync.create().init({ logSnippet: false, files: '**/*.md' });

    app.use(require('connect-browser-sync')(bs));
}

//return static files
app.use(gzipStatic(wwwroot, { maxAge: oneDay }));

console.log("Listening on port 8888 => http://localhost:8888");
//create node.js http server and listen on port
app.listen(8888);
console.log("Listening on port 443 => https://localhost");
//create node.js https server and listen on port
https.createServer(options, app).listen(443);