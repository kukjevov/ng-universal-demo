var connect = require('connect'),
    gzipStatic = require('connect-gzip-static'),
    serveStatic = require('serve-static'),
    history = require('connect-history-api-fallback'),
    proxy = require('http-proxy-middleware'),
    argv = require('yargs').argv,
    path = require('path'),
    fs = require('fs'),
    https = require('https'),
    bodyParser = require('body-parser'),
    connectExtensions = require('nodejs-connect-extensions');

var app = connect();

connectExtensions.extendConnectUse(app);

const wwwroot = path.join(__dirname, "wwwroot");
const proxyUrlFile = path.join(__dirname, 'proxyUrl.js');
var proxyUrl = "http://127.0.0.1:8080";

var key = fs.readFileSync('server.key');
var cert = fs.readFileSync('server.crt');

var options = 
{
    key: key,
    cert: cert
};

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

if(process.env.GUI_API_BASE_URL)
{
    proxyUrl = process.env.GUI_API_BASE_URL;
}

console.log(`Using proxy url '${proxyUrl}'`);

//enable webpack only if run with --webpack param
if(!!argv.webpack)
{
    var webpack = require('webpack'),
        webpackConfig = require('./webpack.config.js')[0]({hmr: true, dll: true, aot: true, css: true}),
        webpackDev = require('webpack-dev-middleware'),
        hmr = require("webpack-hot-middleware");

    var compiler = webpack(webpackConfig);

    //enables webpack dev middleware
    app.use(webpackDev(compiler,
    {
        publicPath: webpackConfig.output.publicPath
    }));

    app.use(hmr(compiler));
}

//mock rest api
require('./server.mock')(app);

//REST api for server dynamic
require('./server.dynamic.api')(app);

//proxy special requests to other location
app.use(proxy(['/api', '/swagger'], {target: proxyUrl, ws: true}));

//custom rest api
require('./server.rest')(app);

//parse html request json body
app.use(bodyParser.json({limit: '50mb'}));

//enable html5 routing
app.use(history());

//return static files
app.use(gzipStatic(wwwroot, 
                   {
                       maxAge: '1d',
                       setHeaders: function setCustomCacheControl (res, path) 
                       {
                           if (serveStatic.mime.lookup(path) === 'text/html') 
                           {
                               // Custom Cache-Control for HTML files
                               res.setHeader('Cache-Control', 'public, max-age=0');
                           }
                       }
                   }));

console.log("Listening on port 8888 => http://localhost:8888");
//create node.js http server and listen on port
app.listen(8888);
console.log("Listening on port 443 => https://localhost");
//create node.js https server and listen on port
https.createServer(options, app).listen(443);