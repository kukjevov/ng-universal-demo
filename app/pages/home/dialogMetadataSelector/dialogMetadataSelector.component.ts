import {Component, ChangeDetectionStrategy, ElementRef, EventEmitter, Inject, ChangeDetectorRef, Optional, OnDestroy, forwardRef, Type, resolveForwardRef} from "@angular/core";
import {MatDialog} from "@angular/material/dialog";
import {CookieService, STRING_LOCALIZATION, StringLocalization} from "@ng/common";
import {GridColumn, GridPluginGeneric, MetadataGatherer, BasicTableMetadata, GridPluginInstances, GRID_PLUGIN_INSTANCES, METADATA_SELECTOR_OPTIONS} from "@ng/grid";
import {extend} from "@asseco/common";
import {Subscription} from "rxjs";

import {DialogMetadataSelectorOptions, DialogMetadataSelector, DialogMetadataSelectorTexts, DialogMetadataSelectorComponent as DialogMetadataSelectorComponentInterface, DialogMetadataSelectorComponentData} from "./dialogMetadataSelector.interface";
import {VerticalDragNDropSelectionComponent} from "./components";

/**
 * Cookie state
 * @internal
 */
interface CookieState
{
    [key: string]: GridColumn;
}

/**
 * Default options for dialog metadata selector
 * @internal
 */
const defaultOptions: DialogMetadataSelectorOptions<any> =
{
    cssClasses:
    {
    },
    texts:
    {
        btnShowSelection: 'Column selection'
    },
    showButtonVisible: true,
    dialogComponent: forwardRef(() => VerticalDragNDropSelectionComponent)
};

/**
 * Component for rendering dialog metadata selector
 */
@Component(
{
    selector: 'ng-dialog-metadata-selector',
    templateUrl: 'dialogMetadataSelector.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogMetadataSelectorComponent implements DialogMetadataSelector<BasicTableMetadata<GridColumn>>, GridPluginGeneric<DialogMetadataSelectorOptions<BasicTableMetadata<GridColumn>>>, OnDestroy
{
    //######################### private fields #########################

    /**
     * Options for grid plugin
     */
    private _options: DialogMetadataSelectorOptions<BasicTableMetadata<GridColumn>>;

    /**
     * Subscription for changes in texts
     */
    private _textsChangedSubscription: Subscription;

    /**
     * Subscription for metadata changes
     */
    private _metadataChangedSubscription: Subscription;

    /**
     * Indication whether gahterer has been initialized
     */
    private _gathererInitialized: boolean = false;

    /**
     * Instance of metadata gatherer, which is used for getting initial metadata
     */
    private _metadataGatherer: MetadataGatherer<BasicTableMetadata<GridColumn>>;

    /**
     * All metadata that are available
     */
    private _allMetadata: BasicTableMetadata<GridColumn>;
    
    /**
     * Component that is used for handling metadata selection itself
     */
    private _dialogComponent?: Type<DialogMetadataSelectorComponentInterface<BasicTableMetadata<GridColumn>>>;

    //######################### public properties - implementation of DialogMetadataSelector #########################

    /**
     * Options for grid plugin
     */
    public get options(): DialogMetadataSelectorOptions<BasicTableMetadata<GridColumn>>
    {
        return this._options;
    }
    public set options(options: DialogMetadataSelectorOptions<BasicTableMetadata<GridColumn>>)
    {
        this._options = extend(true, this._options, options);
    }

    /**
     * Instance of metadata gatherer, which is used for getting initial metadata
     */
    public get metadataGatherer(): MetadataGatherer<BasicTableMetadata<GridColumn>>
    {
        return this._metadataGatherer;
    }
    public set metadataGatherer(gatherer: MetadataGatherer<BasicTableMetadata<GridColumn>>)
    {
        if(this._metadataGatherer != gatherer)
        {
            this._gathererInitialized = false;
        }

        this._metadataGatherer = gatherer;
    }

    /**
     * Current metadata that are used for rendering
     */
    public metadata: BasicTableMetadata<GridColumn> =
    {
        columns: []
    };

    /**
     * Occurs when metadata changed
     */
    public metadataChange: EventEmitter<void> = new EventEmitter<void>();

    //######################### public properties - template bindings #########################

    /**
     * Object containing available texts
     * @internal
     */
    public texts: DialogMetadataSelectorTexts = {};

    //######################### constructor #########################
    constructor(@Inject(GRID_PLUGIN_INSTANCES) @Optional() public gridPlugins: GridPluginInstances,

                public pluginElement: ElementRef,
                private _changeDetector: ChangeDetectorRef,
                private _cookies: CookieService,
                private _dialog: MatDialog,
                @Inject(STRING_LOCALIZATION) protected _stringLocalization: StringLocalization,
                @Inject(METADATA_SELECTOR_OPTIONS) @Optional() options?: DialogMetadataSelectorOptions<BasicTableMetadata<GridColumn>>)
    {
        this._options = extend(true, {}, defaultOptions, options);
    }

    //######################### public methods - implementation of OnDestroy #########################

    /**
     * Called when component is destroyed
     */
    public ngOnDestroy()
    {
        if(this._textsChangedSubscription)
        {
            this._textsChangedSubscription.unsubscribe();
            this._textsChangedSubscription = null;
        }

        if(this._metadataChangedSubscription)
        {
            this._metadataChangedSubscription.unsubscribe();
            this._metadataChangedSubscription = null;
        }
    }

    //######################### public methods - implementation of DialogMetadataSelector #########################

    /**
     * Shows metadata selector
     */
    public show(): void
    {
        this._dialog.open(this._dialogComponent,
        {
            data:
            <DialogMetadataSelectorComponentData<BasicTableMetadata<GridColumn>>>
            {
                getMetadata: () => this._allMetadata,
                setMetadata: metadata =>
                {
                    this._allMetadata.columns = [...metadata.columns];
                    this._setMetadata();
                    this._saveToCookie();

                    this.metadataChange.next();
                }
            }
        });
    }

    /**
     * Initialize plugin, to be ready to use, initialize communication with other plugins
     */
    public initialize()
    {
        this._dialogComponent = resolveForwardRef(this.options.dialogComponent);

        if(!this._gathererInitialized)
        {
            if(this._metadataChangedSubscription)
            {
                this._metadataChangedSubscription.unsubscribe();
                this._metadataChangedSubscription = null;
            }

            this._metadataChangedSubscription = this.metadataGatherer.metadataChange.subscribe(() =>
            {
                this._allMetadata = this.metadataGatherer.getMetadata();
                this._initMetadata();

                this.metadataChange.emit();
            });
        }

        this._textsChangedSubscription = this._stringLocalization.textsChange.subscribe(() => this._initTexts());

        this._allMetadata = this.metadataGatherer.getMetadata();
        this._initMetadata();
        this._initTexts();
    }

    /**
     * Initialize plugin options, all operations required to be done with plugin options are handled here
     */
    public initOptions()
    {
    }

    /**
     * Explicitly runs invalidation of content (change detection)
     */
    public invalidateVisuals(): void
    {
        this._changeDetector.detectChanges();
    }

    //######################### private methods #########################

    /**
     * Initialize texts
     */
    private _initTexts()
    {
        Object.keys(this.options.texts).forEach(key =>
        {
            this.texts[key] = this._stringLocalization.get(this.options.texts[key]);
        });

        this._changeDetector.detectChanges();
    }

    /**
     * Initialize metadata
     */
    private _initMetadata()
    {
        let cookieState: CookieState = this._loadFromCookie();

        if(cookieState)
        {
            this.metadata =
            {
                columns: []
            };

            this._allMetadata.columns.forEach(meta =>
            {
                if(!meta.id)
                {
                    throw new Error('Missing id for column to be stored in cookie!');
                }

                meta.visible = !!cookieState[meta.id];
            });

            Object.keys(cookieState).forEach(id =>
            {
                let meta = this._allMetadata.columns.find(itm => itm.id == id);

                if(meta)
                {
                    this.metadata.columns.push(meta);
                }
            });
        }
        else
        {
            this._setMetadata();
        }
    }

    /**
     * Saves current state to cookie
     */
    private _saveToCookie()
    {
        if(!this.options.cookieName)
        {
            return;
        }

        let state: CookieState = {};

        this.metadata.columns.forEach(meta =>
        {
            if(!meta.id)
            {
                throw new Error('Missing id for column to be stored in cookie!');
            }

            state[meta.id] =
            {
                visible: true
            };
        });

        this._cookies.setCookie(this.options.cookieName, state, null, '/');
    }

    /**
     * Gets stored cookie state
     */
    private _loadFromCookie(): CookieState
    {
        if(!this.options.cookieName)
        {
            return null;
        }

        return this._cookies.getCookie(this.options.cookieName);
    }

    /**
     * Sets visible metadata from all metadata
     */
    private _setMetadata()
    {
        this.metadata =
        {
            columns: this._allMetadata.columns.filter(itm => itm.visible)
        };
    }
}