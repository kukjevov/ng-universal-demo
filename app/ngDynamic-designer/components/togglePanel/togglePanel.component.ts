import {Component, ChangeDetectionStrategy, Input, ChangeDetectorRef} from "@angular/core";

/**
 * Component used for displaying toggleable content with header
 */
@Component(
    {
        selector: 'toggle-panel',
        templateUrl: 'togglePanel.component.html',
        changeDetection: ChangeDetectionStrategy.OnPush
    }
)
export class TogglePanelComponent
{
    //######################### public properties - inputs #########################

    /**
     * Indication whether content is visible
     */
    @Input('visible')
    public contentVisible: boolean;

    /**
     * Title that is displayed in content header
     */
    @Input()
    public title: string;

    //######################### constructor #########################
    constructor(private _changeDetector: ChangeDetectorRef)
    {

    }

    //######################### public methods #########################

    /**
     * Explicitly runs invalidation of content (change detection)
     */
    public invalidateVisuals()
    {
        this._changeDetector.detectChanges();
    }

    /**
     * Toggles content visibility
     */
    public toggle()
    {
        this.contentVisible = !this.contentVisible;
        this.invalidateVisuals();
    }
}