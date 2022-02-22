import {Inject, Injectable} from '@angular/core';
import {Logger, LOGGER} from '@anglr/common';
import {MissingTranslationHandler, MissingTranslationHandlerParams} from '@ngx-translate/core';

/**
 * Service that reports missing translations, allows easier finding of missing translations
 */
@Injectable()
export class ReportMissingTranslationService implements MissingTranslationHandler
{
    //######################### constructor #########################
    constructor(@Inject(LOGGER) private _logger: Logger)
    {
    }

    //######################### public methods - MissingTranslationHandler #########################

    /**
     * @inheritdoc
     */
    public handle(params: MissingTranslationHandlerParams): string
    {
        this._logger.debug(`MISSING TRANSLATION: ${params.key}`);

        return `MISSING: '${params.key}'`;
    }
}