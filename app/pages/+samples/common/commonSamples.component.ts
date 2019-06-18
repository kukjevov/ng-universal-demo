import {Component} from '@angular/core';
import {ComponentRoute} from '@ng/common/router';
import {hasError, alertHidden} from '@ng/common/forms';
import {ProgressIndicatorService} from '@ng/common';
import {Authorize, AuthGuard} from '@ng/authentication';
import {flyInOutTrigger} from '@ng/animations';

import {BaseAnimatedComponent} from "../../../misc/baseAnimatedComponent";

@Component(
{
    selector: "common-samples",
    templateUrl: "commonSamples.component.html",
    animations: [flyInOutTrigger]
})
@ComponentRoute({path: 'common', canActivate: [AuthGuard], data: {xxx: 'kukaj'}})
@Authorize("commonSample-page")
export class CommonSamplesComponent extends BaseAnimatedComponent
{
    //######################### public properties #########################
    public sampleNumber = 5235342.3231;

    /**
     * Gets indication whether controls have error
     */
    public hasError = hasError;
    
    /**
     * Gets indication whether hide validations or not for controls
     */
    public alertHidden = alertHidden;

    //######################### constructors #########################
    constructor(private progressSvc: ProgressIndicatorService)
    {
        super();
    }

    //######################### public methods #########################
    public showProgress()
    {
        this.progressSvc.showProgress();

        setTimeout(() =>
        {
            this.progressSvc.hideProgress();
        }, 5000);
    }
}