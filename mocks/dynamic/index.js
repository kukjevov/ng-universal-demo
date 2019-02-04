module.exports = function(app)
{
    //METADATA
    app.useMock('GET', /api\/dynamic\/metadata\/(.*?)$/, (_req, matches) =>
    {
        switch(matches[1])
        {
            case 'simple':
            {
                return 'mocks/dynamic/simple-metadata.json';
            }
            case 'testing':
            {
                return 'mocks/dynamic/testing-metadata.json';
            }
            default:
            {
                return 'mocks/dynamic/other-metadata.json';
            }
        }
    });

}