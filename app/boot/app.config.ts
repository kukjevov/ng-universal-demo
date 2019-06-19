import {FactoryProvider} from '@angular/core';
import {NOTIFICATIONS_OPTIONS, NotificationsOptions} from '@ng/notifications';

export function factory(): NotificationsOptions<any, any>
{
    return {
        timeout: 0
    };
}

/**
 * Array of providers that are used in app module
 */
export var providers =
[
    <FactoryProvider>
    {
        provide: NOTIFICATIONS_OPTIONS,
        useFactory: factory
    }
];
