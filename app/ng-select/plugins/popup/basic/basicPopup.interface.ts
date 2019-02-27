import {Popup, PopupOptions} from "../popup.interface";

/**
 * Css classes for basic popup
 */
export interface CssClassesBasicPopup
{
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