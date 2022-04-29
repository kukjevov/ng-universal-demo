const chalk = require('chalk'),
      fs = require('fs'),
      path = require('path');

module.exports = function(app)
{
    //MOCK LOGGER
    app.useMock('POST', '/api/mockLogger', (req) =>
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
                const mockdata = JSON.parse(body);
                const url = `mocks/mockLogger/mocks/${mockdata.url}`;

                if(!mockdata.response)
                {
                    return;
                }

                console.log(`logging mock for path ${chalk.yellow(mockdata.url)}`)

                if (!fs.existsSync(url))
                {
                    fs.mkdirSync(url, {recursive: true});
                }

                fs.writeFileSync(path.join(url, 'mock'), mockdata.response);
            }
            catch(e)
            {
                console.log('failed to deserialize or create mock file', e);
            }
        });

        return {
            statusCode: 204,
            emptyResult: true
        };
    });
}