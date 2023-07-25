const connect = require('connect'),
      gzipStatic = require('connect-gzip-static'),
      serveStatic = require('serve-static'),
      history = require('connect-history-api-fallback'),
      {createProxyMiddleware} = require('http-proxy-middleware'),
      argv = require('yargs').argv,
      path = require('path'),
      fs = require('fs'),
      https = require('https'),
      cors = require('cors'),
      connectExtensions = require('nodejs-connect-extensions');

require('dotenv').config();

const app = connect();

connectExtensions.extendConnectUse(app);

const wwwroot = path.join(__dirname, 'wwwroot');
const serverPath = path.join(wwwroot, 'dist/server.es2015.js');
const proxyUrlFile = path.join(__dirname, 'proxyUrl.cjs');
let serverRenderFunc;
let proxyUrl = "http://127.0.0.1:8080";

const key = fs.readFileSync('server.key');
const cert = fs.readFileSync('server.crt');

const options = 
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

if(process.env.SERVER_PROXY_HOST)
{
    proxyUrl = process.env.SERVER_PROXY_HOST;
}

console.log(`Using proxy url '${proxyUrl}'`);

//enable webpack only if run with --webpack param
if(!!argv.webpack)
{
    app.use(cors());

    //WEBPACK 5 DEV SERVER
    app.use(createProxyMiddleware(['/dist'],
    {
        target: 'http://localhost:9000',
        ws: true,
    }));
}

//mock rest api
require('./server.mock.cjs')(app);

function error(err, req, res)
{
    if(err.code == "ECONNREFUSED" || err.code == "ECONNRESET")
    {
        res.writeHead(503,
        {
            'Content-Type': 'text/plain'
        });

        res.end('Remote server is offline.');

        return;
    }

    res.writeHead(504,
    {
        'Content-Type': 'text/plain'
    });

    res.end('Failed to proxy request.');
}

//proxy special requests to other location
app.use(createProxyMiddleware(['/api', '/swagger'],
                              {
                                  target: proxyUrl,
                                  ws: true,
                                  secure: false,
                                  changeOrigin: true,
                                  on: 
                                  {
                                      error,
                                  },
                              }));

//custom rest api
require('./server.rest.cjs')(app);

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

        res.setHeader('Content-Type', 'text/html');

        getServerRenderFunc()(path.join(wwwroot, 'index.html'), req.originalUrl, {baseUrl: "http://localhost:8888/", requestCookies: req.headers['cookie']}, function(err, succ)
        {
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

//maybe move to https://www.npmjs.com/package/express-static-gzip
//return static files
app.use(gzipStatic(wwwroot, 
                   {
                       maxAge: '7d',
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