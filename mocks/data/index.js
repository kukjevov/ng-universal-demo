module.exports = function(app)
{
    //GRID DATA
    app.useMock('GET', '/api/grid-data', 'mocks/data/gridData.json', {dataArray: true});

    //DATA
    app.useMock('GET', '/api/data', 'mocks/data/data.json');

    //CIS
    app.useMock('GET', /api\/cis/, 'mocks/data/cis.json', {dataArray: true});
}