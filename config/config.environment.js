const guiDebug = process.env['GUI_DEBUG'];
const guiApiBaseUrl = process.env['GUI_API_BASE_URL'];
const guiTheme = process.env['GUI_THEME'];
const guiLanguage = process.env['GUI_LANGUAGE'];

configOverride.configuration.debug = guiDebug ? guiDebug.toLowerCase() == 'true' : configOverride.configuration.debug;
configOverride.configuration.apiBaseUrl = guiApiBaseUrl ? guiApiBaseUrl : configOverride.configuration.apiBaseUrl;
configOverride.general.theme = guiTheme ? guiTheme : configOverride.general.theme;
configOverride.general.language = guiLanguage ? guiLanguage : configOverride.general.language;

(typeof window != 'undefined' && window || typeof self != 'undefined' && self || typeof global != 'undefined' && global).configOverride = configOverride;
