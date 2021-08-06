const path = require('path'),
      fs = require('fs');

module.exports = function(app)
{
    //MY ACCOUNT
    app.useMock('GET', /api\/dynamic\/metadata\/.*/, () =>
    {
        let filePath = path.join(__dirname, `${'simple'}-renderer.json`);

        if(!fs.existsSync(filePath))
        {
            return {
                statusCode: 404,
                emptyResult: true,
                result: null
            };
        }
        
        let data = JSON.parse(fs.readFileSync(filePath));

        return {
            contentTyp: 'application/json',
            statusCode: 200,
            emptyResult: false,
            result: 
            {
                layout: JSON.stringify(data.layout),
                relations: JSON.stringify(data.relations)
            }
        };
    });
}