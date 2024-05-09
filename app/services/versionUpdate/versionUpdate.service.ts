import {Inject, Injectable, NgZone, OnDestroy, Signal, WritableSignal, signal} from '@angular/core';
import {SwUpdate} from '@angular/service-worker';
import {DOCUMENT} from '@angular/common';
import {Logger, LOGGER} from '@anglr/common';
import {Subscription} from 'rxjs';

/**
 * Service used for handling version update
 */
@Injectable({providedIn: 'root'})
export class VersionUpdateService implements OnDestroy
{
    //######################### private fields #########################
    
    /**
     * Current updateAvailable value
     */
    private _updateAvailable: WritableSignal<boolean> = signal(false);
    
    /**
     * Current updateReady value
     */
    private _updateReady: WritableSignal<boolean> = signal(false);

    /**
     * Subscriptions created during initialization
     */
    private _initSubscriptions: Subscription = new Subscription();

    /**
     * Interval used for checking of update
     */
    private _checkUpdateInterval: number|null = null;
    
    //######################### public properties #########################
    
    /**
     * Gets current updateAvailable value
     */
    public get updateAvailable(): Signal<boolean>
    {
        return this._updateAvailable.asReadonly();
    }
    
    /**
     * Gets current updateReady value
     */
    public get updateReady(): Signal<boolean>
    {
        return this._updateReady.asReadonly();
    }
    
    //######################### constructor #########################
    constructor(private _swUpdate: SwUpdate,
                private _ngZone: NgZone,
                @Inject(LOGGER) private _logger: Logger,
                @Inject(DOCUMENT) private _document: Document,)
    {
    }

    //######################### public methods #########################

    /**
     * Initialize version update service
     */
    public async initialize(): Promise<void>
    {
        this._logger.debug('VersionUpdateService: Initializing version update ngsw enabled {{cond}}.', {cond: this._swUpdate.isEnabled});

        if(!this._swUpdate.isEnabled)
        {
            return;
        }

        this._initSubscriptions.add(this._swUpdate.unrecoverable.subscribe(event => alert(`Prosím prenačítajte stránku! ${event.reason}`)));

        this._initSubscriptions.add(this._swUpdate.versionUpdates.subscribe(event =>
        {
            switch(event.type)
            {
                case 'NO_NEW_VERSION_DETECTED':
                {
                    this._logger.debug('VersionUpdateService: No new version detected.');

                    break;
                }
                case 'VERSION_DETECTED':
                {
                    this._logger.debug('VersionUpdateService: New version detected. {{version}}', {version: event.version.hash});

                    this._updateAvailable.set(true);

                    break;
                }
                case 'VERSION_READY':
                {
                    this._logger.debug('VersionUpdateService: Version ready. {{@hash}}', {hash: {from: event.latestVersion.hash, to: event.currentVersion.hash}});

                    this._updateReady.set(true);

                    break;
                }
                default:
                // case 'VERSION_INSTALLATION_FAILED':
                {
                    this._logger.debug('VersionUpdateService: Version ready. {{@versionInfo}}', {versionInfo: {version: event.version.hash, error: event.error}});

                    break;
                }
            }
        }));

        await this.checkUpdate();

        this._ngZone.runOutsideAngular(() =>
        {
            this._checkUpdateInterval = setInterval(() => this.checkUpdate(), 60 * 60 * 1000 * 3) as unknown as number;
        });
    }

    /**
     * Checks for update of application
     */
    public async checkUpdate(): Promise<void>
    {
        this._logger.debug('VersionUpdateService: Checking for update!');

        try
        {
            await this._swUpdate.checkForUpdate();
        }
        catch(e)
        {
            this._logger.warn('VersionUpdateService: Failed to check for update! {{@error}}', {error: e});
        }
    }

    /**
     * Activates new version and reloads page
     */
    public async activateVersion(): Promise<void>
    {
        try
        {
            const result = await this._swUpdate.activateUpdate();
            this._logger.debug('VersionUpdateService: Update activated {{@result}}', {result});

            if(result)
            {
                this._document.location.reload();
            }
        }
        catch(e)
        {
            this._logger.warn('VersionUpdateService: Failed to activate update! {{@error}}', {error: e});
        }
    }

    //######################### public methods - implementation of OnDestroy #########################
    
    /**
     * Called when component is destroyed
     */
    public ngOnDestroy(): void
    {
        this._initSubscriptions?.unsubscribe();
        
        if(this._checkUpdateInterval)
        {
            clearInterval(this._checkUpdateInterval);
        }
    }
}