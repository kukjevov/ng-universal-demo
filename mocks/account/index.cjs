module.exports = function(app)
{
    //LOGIN, LOGOUT
    require('./account.cjs')(app);

    //MY ACCOUNT
    app.useMock('GET', '/api/myaccount', () =>
    {
        //not signed user
        if(!global.user)
        {
            return {
                statusCode: 401,
                emptyResult: true
            };
        }
 
        //signed user
        return 'mocks/account/my-account.json';
    });
}