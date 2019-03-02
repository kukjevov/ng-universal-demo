//@ts-ignore
import {Utils} from '@ng/common';

import {GridSampleComponent} from './grid/gridSample.component';
import {BootstrapSamplesComponent} from './bootstrap/bootstrapSamples.component';
import {CommonSamplesComponent} from './common/commonSamples.component';
import {NotificationsSampleComponent} from './notifications/notificationsSample.component';
import {AuthorizationSampleComponent} from "./authorization/authorizationSample.component";
import {SelectSampleComponent} from './select/selectSample.component';

export var sampleComponentRoutes = Utils.routerHelper.extractRoutes([GridSampleComponent,
                                                                     BootstrapSamplesComponent,
                                                                     CommonSamplesComponent,
                                                                     NotificationsSampleComponent,
                                                                     AuthorizationSampleComponent,
                                                                     SelectSampleComponent]);

export var sampleComponents = [GridSampleComponent,
                               BootstrapSamplesComponent,
                               CommonSamplesComponent,
                               NotificationsSampleComponent,
                               AuthorizationSampleComponent,
                               SelectSampleComponent];