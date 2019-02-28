import {Popup, PopupOptions} from "../popup.interface";

/**
 * Css classes for basic popup
 */
export interface CssClassesBasicPopup
{
    /**
     * Css class applied to each option div
     */
    optionItemDiv?: string;

    /**
     * Css class applied to each option text div
     */
    optionItemTextDiv?: string;

    /**
     * Css class used as icons indicating that option is selected (only when multiple)
     */
    optionChecked?: string;

    /**
     * Css class applied directly to css popup
     */
    popupDiv?: string;
}

/**
 * Basic popup options
 */
export interface BasicPopupOptions extends PopupOptions<CssClassesBasicPopup>
{
}

/**
 * Public API for 'BasicPopupComponent'
 */
export interface BasicPopup extends Popup
{
}