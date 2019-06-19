import {Component, OnDestroy} from '@angular/core';
import * as moment from 'moment';

/**
 * Application entry component
 */
@Component(
{
    selector: 'app',
    templateUrl: "app.component.html"
})
export class AppComponent implements OnDestroy
{
    //######################### constructor #########################
    constructor() 
    {
        moment.locale('sk');
    }

    //######################### public methods - implementation of OnDestroy #########################
    
    /**
     * Called when component is destroyed
     */
    public ngOnDestroy()
    {
    }
}