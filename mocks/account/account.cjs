var bodyParser = require('body-parser');

module.exports = function(app)
{
    global.user = null;

    app.use(bodyParser.urlencoded({ extended: false }));

    app.useMock('POST', '/api/authentication', (req) =>
    {
        if(req.body.j_username == 'admin' && req.body.j_password == 'admin')
        {
            global.user = true;
        }

        return {
            statusCode: global.user === true ? 204 : 401,
            emptyResult: true
        };
    });

    app.useMock('POST', '/api/logout', () =>
    {
        global.user = false;

        return {
            statusCode: 204,
            emptyResult: true
        };
    });
}