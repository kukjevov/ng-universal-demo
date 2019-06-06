const fs = require('fs'),
      path = require('path');

try
{
    if (!fs.existsSync(path.join(__dirname, "wwwroot/dist/dependencies.js")))
    {
        process.exit(0);
    }
}
catch (err)
{
}

process.exit(1);