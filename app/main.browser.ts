import 'modernizr';

import {loadConfig} from './config.loader';

async function main()
{
    await loadConfig();
    
    await import('./main.browser.bootstrapComponent');
}

main();