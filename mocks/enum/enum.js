module.exports = function(app)
{
    //TYP ROZHODNUTIA
    app.useMock('GET', '/api/enum/typPzs', 'mocks/enum/typ-pzs.json');
}