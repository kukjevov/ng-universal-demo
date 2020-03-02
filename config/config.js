let {extend, isPresent} = require('@jscrpt/common'),
    globalConfig = require('config/default'),
    jq = require('jquery');

let config = extend({}, globalConfig); 

jq.ajax("local/config",
{
    async: false,
    dataType: 'json',
    success: function(data)
    {
        if(isPresent(data.configuration) && isPresent(data.configuration.debug))
        {
            config.configuration.debug = data.configuration.debug;
        }

        if(isPresent(data.configuration) && isPresent(data.configuration.apiBaseUrl))
        {
            config.configuration.apiBaseUrl = data.configuration.apiBaseUrl;
        }

        if(isPresent(data.general) && isPresent(data.general.theme))
        {
            config.general.theme = data.general.theme;
        }

        if(isPresent(data.general) && isPresent(data.general.language))
        {
            config.general.language = data.general.language;
        }
    }
});

module.exports = config;