import {TemplateRef} from "@angular/core";

import {NormalStateContext} from "../plugins/normalState";
import {PopupContext} from "../plugins/popup";

/**
 * Gatherer used for obtaining templates for NgSelect plugins
 */
export interface TemplateGatherer
{
    /**
     * Template used within normal state
     */
    readonly normalStateTemplate: TemplateRef<NormalStateContext>;

    /**
     * Template that is used within Popup as option
     */
    readonly optionTemplate?: TemplateRef<PopupContext>;
}