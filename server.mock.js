var fs = require('fs'),
    path = require('path');

function includeEnvMock(app)
{
    var envMock = path.join(__dirname, `server.mock.${process.env.NODE_ENV}.js`);

    if(process.env.NODE_ENV && fs.existsSync(envMock))
    {
        console.log(`Loading mocks for '${envMock}' env.`);

        require(envMock)(app);
    }
}

module.exports = function(app)
{
    //LOAD ACCOUNT RESOURCE
    require('./mocks/account')(app);

    //LOAD CONFIG RESOURCE
    require('./mocks/config')(app);
};
