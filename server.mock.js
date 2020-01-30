// var bodyParser = require('body-parser');

module.exports = function(app)
{
    // var user = null;

    // app.use(bodyParser.urlencoded({ extended: false }));

    // app.use('/api/authentication', function (req, res, next)
    // {
    //     console.time(`GET ${req.originalUrl}`);

    //     res.statusCode = 204;

    //     if(req.body.j_username != 'admin' || req.body.j_password != 'admin')
    //     {
    //         res.statusCode = 401;
    //     }
    //     else
    //     {
    //         user = true;
    //     }

    //     res.end(null);

    //     console.timeEnd(`GET ${req.originalUrl}`);
    // });

    app.use('/api/longcall', function (req, res, next)
    {
        setTimeout(() =>
        {
            res.statusCode = 204;
            res.end(null);
        }, 120000);
    });

    app.use('/api/unauthorized', function (req, res, next)
    {
        console.time(`GET ${req.originalUrl}`);

        res.setHeader('Content-Type', 'text/html');
        res.statusCode = 401;

        res.end(null);

        console.timeEnd(`GET ${req.originalUrl}`);
    });

    app.use('/api/continue', function (req, res, next)
    {
        console.time(`GET ${req.originalUrl}`);

        res.setHeader('Content-Type', 'application/json');

        res.statusCode = 100;
        res.end(null);

        console.timeEnd(`GET ${req.originalUrl}`);
    });

    app.use('/api/badRequest', function (req, res, next)
    {
        console.time(`GET ${req.originalUrl}`);

        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 400;

        res.end(null);

        console.timeEnd(`GET ${req.originalUrl}`);
    });

    app.use('/api/logout', function (req, res, next)
    {
        console.time(`GET ${req.originalUrl}`);

        user = null;

        res.setHeader('Content-Type', 'text/html');
        res.statusCode = 204;

        res.end(null);

        console.timeEnd(`GET ${req.originalUrl}`);
    });

    //LOAD ACCOUNT RESOURCE
    require('./mocks/account/account')(app);

    //LOAD CONFIG RESOURCE
    require('./mocks/config/config')(app);

    //LOAD DATA RESOURCE
    require('./mocks/data/data')(app);

    //LOAD MOSIA RESOURCE
    require('./mocks/mosia/mosia')(app);

    //LOAD ENUM RESOURCE
    require('./mocks/enum/enum')(app);

    // //LOAD DYNAMIC RESOURCE
    // require('./mocks/dynamic')(app);
};
