module.exports = function(app)
{
    //META DETAIL
    app.useMock('GET', '/api/mosia/meta/lekamb/detail', 'mocks/mosia/meta-detail.json');

    //META PZS DETAIL
    app.useMock('GET', '/api/mosia/meta/pzs/detail', 'mocks/mosia/meta-pzs-detail.json');

    //DETAIL OBDOBIA
    app.useMock('GET', /api\/mosia\/lekamb\/obdobia\/.*?-.*?-.*?-.*?/, 'mocks/mosia/obdobia-detail.json');

    //DETAIL
    app.useMock('GET', /api\/mosia\/lekamb\/.*?-.*?-.*?-.*?-.*?$/, () =>
    {
        return 'mocks/mosia/detail-1.json';
    });

    //GRAF
    app.useMock('GET', /api\/mosia\/graf\/.*?-.*?-.*?-.*?\?/, () =>
    {
        return 'mocks/mosia/detail-graf-1.json';
    });
}