import {TemplateRef} from "@angular/core";

import {NormalStateContext} from "../plugins/normalState";

/**
 * Gatherer used for obtaining templates for NgSelect plugins
 */
export interface TemplateGatherer
{
    /**
     * Template used within normal state
     */
    normalStateTemplate: TemplateRef<NormalStateContext>;
}