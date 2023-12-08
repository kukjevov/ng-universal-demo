module.exports = function(app)
{
    //400
    app.useMock('GET', '/api/error/400', 'mocks/error/400.json', {statusCode: 400});

    //404
    app.useMock('GET', '/api/error/404', 'mocks/error/404.json', {statusCode: 404});
};
        