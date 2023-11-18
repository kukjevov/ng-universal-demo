const fs = require('fs');

fs.writeFileSync('config/version.json', `{"version": "${process.env.GIT_VERSION}"}`);
