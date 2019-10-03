import {Inject, Component, ChangeDetectionStrategy} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {BasicTableMetadata, GridColumn} from "@ng/grid";

import {DialogMetadataSelectorComponent, DialogMetadataSelectorComponentData} from "../../dialogMetadataSelector.interface";
import {VerticalDragNDropSelectionTexts, CssClassesVerticalDragNDropSelection} from './verticalDragNDropSelection.interface';

/**
 * Component that is used for handling metadata seletion using vertical drag n drop
 */
@Component(
{
    selector: 'ng-dialog-vertical-metadata-selector',
    templateUrl: 'verticalDragNDropSelection.component.html',
    styleUrls: ['verticalDragNDropSelection.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerticalDragNDropSelectionComponent implements DialogMetadataSelectorComponent<BasicTableMetadata<GridColumn>>
{
    //######################### public properties - template bindings #########################

    /**
     * Metadata that are rendered
     * @internal
     */
    public metadata: BasicTableMetadata<GridColumn>;

    /**
     * Texts that are used withing vertical drag n drop
     * @internal
     */
    public texts: VerticalDragNDropSelectionTexts;

    /**
     * Css classes that are used withing  vertical drag n drop
     * @internal
     */
    public cssClasses: CssClassesVerticalDragNDropSelection;

    //######################### constructor #########################
    constructor(public dialog: MatDialogRef<VerticalDragNDropSelectionComponent, DialogMetadataSelectorComponentData<BasicTableMetadata<GridColumn>>>,
                @Inject(MAT_DIALOG_DATA) public data: DialogMetadataSelectorComponentData<BasicTableMetadata<GridColumn>>)
    {
        this.metadata = this.data.metadata;
        this.texts = this.data.texts;
        this.cssClasses = this.data.cssClasses;
    }

    //######################### public methods - template bindings #########################

    /**
     * Called on drop event
     * @param event Drop event data
     * @internal
     */
    public drop(event: CdkDragDrop<string[]>)
    {
        moveItemInArray(this.metadata.columns, event.previousIndex, event.currentIndex);

        this.data.setMetadata(this.metadata);
    }

    /**
     * Toggles visibility of column
     * @param column Column that is being toggled
     * @param event Event that occured
     * @internal
     */
    public toggleVisibility(column: GridColumn, target: {checked: boolean})
    {
        column.visible = target.checked;
        
        this.data.setMetadata(this.metadata);
    }
}