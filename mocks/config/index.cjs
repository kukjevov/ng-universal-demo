module.exports = function(app)
{
    //RELEASE
    app.useMock('GET', '/api/config/release', 'mocks/config/release.json');
}