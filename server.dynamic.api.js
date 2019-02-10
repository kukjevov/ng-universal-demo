var fs = require('fs'),
    path = require('path');

module.exports = function(app)
{
    //GET metadata
    app.use('GET', /api\/dynamic\/metadata\/(.*)/, function (req, res)
    {
        console.time(`GET ${req.originalUrl}`);

        let name = req.matches[1];
        res.setHeader('Content-Type', 'application/json');

        let filePath = path.join('dynamic-data', name, "renderer.json");

        if(!fs.existsSync(filePath))
        {
            res.statusCode = 404;
            res.end(null);
            console.timeEnd(`GET ${req.originalUrl}`);

            return;
        }
        
        let data = JSON.parse(fs.readFileSync(filePath));
        res.statusCode = 200;

        res.end(JSON.stringify(
        {
            layout: JSON.stringify(data.layout),
            relations: JSON.stringify(data.relations)
        }));

        console.timeEnd(`GET ${req.originalUrl}`);
    });
};
