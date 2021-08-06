var Rest = require('connect-rest'),
    fs = require('fs'),
    path = require('path'),
    bodyParser = require('body-parser'),
    {isString, isJsObject} = require('@jscrpt/common');

function parseConfigEnv(config)
{
    if(!config)
    {
        return null;
    }

    //iterate all over properties
    if(isJsObject(config))
    {
        for(let prop in config)
        {
            let val = config[prop];

            //use value as env var name
            if(isString(val))
            {
                config[prop] = process.env[val] || null;
            }
            //if it is nested obj
            else if(isJsObject(val))
            {
                parseConfigEnv(val);
            }
            //else do nothing special
        }
    }

    return config;
}

function getConfigPath()
{
    var envConfig = path.join(__dirname, `config/config.${process.env.NODE_ENV}.json`);

    if(process.env.NODE_ENV && fs.existsSync(envConfig))
    {
        console.log(`Loading configuration '${envConfig}'`);

        return envConfig;
    }

    const defConfig = 'config/config.json';
    console.log(`Loading DEFAULT configuration '${defConfig}'`);

    return path.join(__dirname, defConfig);
}

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

    //config override from env
    rest.get('configEnv', async () =>
    {
        try
        {
            return parseConfigEnv(JSON.parse(fs.readFileSync(path.join(__dirname, 'config/config.environment.json'), 'utf8')));
        }
        catch(e)
        {
            console.error(e);
        }

        return {};
    });

    //default config 
    rest.get('config', async () =>
    {
        try
        {
            return JSON.parse(fs.readFileSync(getConfigPath(), 'utf8'));
        }
        catch(e)
        {
            console.error(e);
        }

        return {};
    });
};
