var Rest = require('connect-rest'),
    bodyParser = require('body-parser');

module.exports = function(app)
{
    app.use(bodyParser.urlencoded({extended: true}))
        .use(bodyParser.json());

    var rest = Rest.create(
    {
        context: '/local/',
        // logger:{ file: 'mochaTest.log', level: 'debug' },
        // apiKeys: [ '849b7648-14b8-4154-9ef2-8d1dc4c2b7e9' ],
        // discover: { path: 'discover', secure: true },
        // proto: { path: 'proto', secure: true }
    });

    app.use(rest.processRequest());

    //#################################################################################################################//
    //################################################ REST DEFINITION ################################################//
    //#################################################################################################################//

    //config override
    rest.get('config', async () =>
    {
        return require('./config/global.override');
    });
};
