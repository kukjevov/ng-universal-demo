const chalk = require('chalk');

function formatLogLevel(logLevel)
{
    switch(logLevel)
    {
        case 'ERROR':
        case 'FATAL':
        {
            return chalk.bold.red(logLevel);
        }
        case 'WARNING':
        {
            return chalk.bold.yellow(logLevel);
        }
        case 'INFORMATION':
        {
            return chalk.bold.white(logLevel);
        }
        case 'DEBUG':
        case 'VERBOSE':
        {
            return chalk.bold.blueBright(logLevel);
        }
    }
}

function writeErrorDetail(errorDetail)
{
    Object.keys(errorDetail).forEach(key =>
    {
        console.log(chalk.bold.whiteBright(`${key.toUpperCase()}: `) + errorDetail[key]);
    });
}

function writeError(error)
{
    console.log(`${chalk.bold.whiteBright(error.timestamp)} [${formatLogLevel(error.logLevel)}] ${error.message}`);

    if(error.info)
    {
        if(Array.isArray(error.info))
        {
            error.info.forEach(writeErrorDetail);
        }
        else
        {
            writeErrorDetail(error.info);
        }
    }
}

module.exports = function(app)
{
    //LOGGER
    app.useMock('POST', '/api/logger', (req) =>
    {
        let body = [];

        req.on('data', (chunk) => 
        {
            body.push(chunk);
        }).on('end', () => 
        {
            body = Buffer.concat(body).toString();

            try
            {
                let errors = JSON.parse(body);

                if(Array.isArray(errors))
                {
                    errors.forEach(writeError);
                }
                else
                {
                    console.log(JSON.stringify(JSON.parse(body), null, 4));
                }
            }
            catch(e)
            {
                console.log('failed to deserialize', e);
            }
        });


        return {
            statusCode: 204,
            emptyResult: true
        };
    });
}