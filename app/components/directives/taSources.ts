import {Directive} from '@angular/core';
import {map} from 'rxjs/operators';

import {DataService} from "../../services/api/data/data.service";
import {TypeaheadDirective, TypeaheadTagsComponent} from "@ng/bootstrap";

/**
 * Directive used for setting typeahead source
 */
@Directive(
{
    selector: "[taSource]",
    providers: [DataService]
})
export class TypeaheadSourceDirective
{
    //######################### constructor #########################
    constructor(typeahead: TypeaheadDirective,
                dataSvc: DataService)
    {
        typeahead.typeaheadDisplayedProperty = "kod";
        typeahead.typeaheadValueProperty = null;
        typeahead.typeaheadTemplate = "<div>{{kod}} - {{popis}}</div>";
        
        typeahead.typeaheadSource = query =>
        {
            return dataSvc
                .getCis(query, 20)
                .pipe(map(itm => itm.content));
        };
    }
}

/**
 * Directive used for setting typeahead tags source
 */
@Directive(
{
    selector: "[taTagsSource]",
    providers: [DataService]
})
export class TypeaheadTagsSourceDirective
{
    //######################### constructor #########################
    constructor(typeaheadTags: TypeaheadTagsComponent,
                dataSvc: DataService)
    {
        typeaheadTags.typeaheadDisplayedProperty = "kod";
        typeaheadTags.typeaheadValueProperty = null;
        typeaheadTags.typeaheadTemplate = "<div>{{kod}} - {{popis}}</div>";
        
        typeaheadTags.typeaheadSource = query =>
        {
            return dataSvc
                .getCis(query, 20)
                .pipe(map(itm => itm.content));
        };
    }
}