import {Component, ChangeDetectionStrategy, Inject} from '@angular/core';
import {ComponentRoute, ComponentRedirectRoute} from '@anglr/common/router';
import {Authorize, AuthGuard} from '@anglr/authentication';
import {LocalNotificationsService, provideLocalNotifications} from '@anglr/notifications';
import {LOGGER, Logger} from '@anglr/common';

/**
 * Home component
 */
@Component(
{
    selector: 'home-view',
    templateUrl: 'home.component.html',
    providers:
    [
        provideLocalNotifications(),
        provideLocalNotifications('test', 'YEP'),
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
@ComponentRedirectRoute('', 'home')
@ComponentRoute({path: 'home', canActivate: [AuthGuard]})
@Authorize('home-page')
export class HomeComponent
{
    constructor(private _notifications: LocalNotificationsService,
                @Inject('YEP') private _testNotifications: LocalNotificationsService,
                @Inject(LOGGER) private _logger: Logger,)
    {

        this._logger.verbose('test {{another}} {{ahoj}}', {another: 'ano je to tak', ahoj: 10});
        this._logger.debug('test {{another}}', {another: 'ano je to tak'});
        this._logger.info('test {{another}}', {another: 'ano je to tak'});
        this._logger.warn('test {{another}}', {another: 'ano je to tak'});
        this._logger.error('test {{another}}', {another: 'ano je to tak'});
        this._logger.fatal('test {{another}}', {another: 'ano je to tak'});
    }

    public showError(): void
    {
        this._logger.error('test {{another}}', {another: 'ano je to tak'});

        this._notifications.error('error strasny');
    }
    public showWarn(): void
    {
        this._logger.warn('test {{another}}', {another: 'ano je to tak'});
        this._notifications.warning('warn strasny');
    }
    public showDefault(): void
    {
        this._notifications.default('default strasny');
    }
    public showInfo(): void
    {
        this._logger.info('test {{another}}', {another: 'ano je to tak'});
        this._notifications.info('info strasny');
    }
    public showSuccess(): void
    {
        this._notifications.success('success strasny');
    }

    public localShowError(): void
    {
        this._testNotifications.error('error strasny');
    }
    public localShowWarn(): void
    {
        this._testNotifications.warning('warn strasny');
    }
    public localShowDefault(): void
    {
        this._testNotifications.default('default strasny');
    }
    public localShowInfo(): void
    {
        this._testNotifications.info('info strasny');
    }
    public localShowSuccess(): void
    {
        this._testNotifications.success('success strasny');
    }
}
