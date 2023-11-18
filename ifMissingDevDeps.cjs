const fs = require('fs'),
      path = require('path');

try
{
    if (!fs.existsSync(path.join(__dirname, "wwwroot/index.html")))
    {
        process.exit(0);
    }
}
catch (err)
{
}

process.exit(1);