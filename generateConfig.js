import {dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'module';
import path from 'path';
import fs from 'fs';
import envsub from 'envsub';
import dotenv from 'dotenv';
import mergeWith from 'lodash/mergeWith.js';
import isArray from 'lodash/isArray.js';

dotenv.config();

const require = createRequire(import.meta.url);
const defaultConfig = require('./config/config.json');
const dirName = dirname(fileURLToPath(import.meta.url));
const customConfigPath = path.join(dirName, 'config', `config.${process.env.NODE_ENV}.json`);
const configEnvPath = path.join(dirName, 'config', `config.environment.js`);

const templateFile = path.join(dirName, 'config', 'configOverride.js');
const browserFile = path.join(dirName, 'config', 'configBrowserOverride.js');
const serverFile = path.join(dirName, 'config', 'configServerOverride.js');

const options =
{
    all: false,
    diff: false,
    syntax: 'default',
    system: true,
};

let config = defaultConfig;

if(fs.existsSync(customConfigPath) && process.env.NODE_ENV)
{
    const override = require(`./config/config.${process.env.NODE_ENV}.json`);

    config = mergeWith(config, override, (objValue, srcValue) =>
    {
        if (isArray(objValue))
        {
            return srcValue;
        }
    });
}

fs.writeFileSync(templateFile, `
const configOverride = ${JSON.stringify(config, null, 4)};

${fs.readFileSync(configEnvPath).toString().replace(/process\.env\['(.*?)'\]/g, `'\${$1}'`)}`);

envsub({templateFile, outputFile: browserFile, options})
    .catch((err) =>
    {
        console.error(err.message);
    });

fs.writeFileSync(serverFile, `
const configOverride = ${JSON.stringify(config, null, 4)};

${fs.readFileSync(configEnvPath)}`);
