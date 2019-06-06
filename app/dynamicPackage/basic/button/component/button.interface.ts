import {ActionDescription} from "../../../../nodeDefinitions";

/**
 * Options for button component
 */
export interface ButtonComponentOptions
{
    /**
     * Css class applied to button
     */
    cssClass?: string;

    /**
     * Test displayed for button
     */
    text?: string;

    /**
     * Description of actions to be called on click
     */
    actions?: ActionDescription[];
}