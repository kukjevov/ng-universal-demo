import {dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import fs from 'fs';
import path from 'path';

const dirName = dirname(fileURLToPath(import.meta.url));

fs.writeFileSync(path.join(dirName, '..',  'config', 'version.json'), `{"version": "${process.env.GIT_VERSION}"}`);
