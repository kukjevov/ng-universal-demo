declare module "config/version"
{
    var _tmp:
    {
        /**
         * Version of current running application
         */
        version: string;
    };

    export = _tmp;
}

declare var isProduction: boolean;