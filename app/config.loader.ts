import {Configuration, config as cfg} from './config';

/**
 * Overrides config
 * @param override Configuration that is used for overriding
 */
function overrideConfig(override: Configuration)
{
    let isPresent = function isPresent(obj: any): boolean
    {
        return obj !== undefined && obj !== null;
    }

    if(isPresent(override?.configuration?.debug))
    {
        let debug: boolean = override?.configuration?.debug;

        if(typeof override.configuration.debug == "string")
        {
            debug = (<string>override.configuration.debug).toLowerCase() == "true";
        }

        cfg.configuration.debug = debug;
    }

    if(isPresent(override?.configuration?.apiBaseUrl))
    {
        cfg.configuration.apiBaseUrl = override.configuration.apiBaseUrl;
    }

    if(isPresent(override?.general?.theme))
    {
        cfg.general.theme = override.general.theme;
    }

    if(isPresent(override?.general?.language))
    {
        cfg.general.language = override.general.language;
    }
}

/**
 * Function used for loading configuration
 */
export async function loadConfig(): Promise<void>
{
    let loadJson = async path =>
    {
        try
        {
            let response = await fetch(new Request(path));

            return await response.json();
        }
        catch(e)
        {
            alert(`Failed to load configuration '${e}'`);
        }

        return null;
    };
    
    //default configuration
    let config: Configuration = await loadJson('local/config');

    Object.keys(config).forEach(key =>
    {
        cfg[key] = config[key];
    });

    //config override from env variables
    let configOverride = await loadJson('local/configEnv');

    overrideConfig(configOverride);
}