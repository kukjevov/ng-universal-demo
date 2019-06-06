import {Component, ChangeDetectionStrategy, Injector, ValueProvider, StaticProvider, OnInit, OnDestroy, ChangeDetectorRef, Inject} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Subscription, empty, throwError} from "rxjs";
import {catchError} from "rxjs/operators";

import {DynamicComponentMetadata} from "../interfaces";
import {DYNAMIC_RELATIONS_METADATA} from "../tokens";
import {ComponentRelationManager} from "../componentRelationManager";
import {ComponentManager} from "../componentManager";
import {DynamicContentMetadata, RemoteDynamicContentMetadata} from "./dynamicComponentPage.interface";
import {DYNAMIC_COMPONENT_PAGE_METADATA_URL, NOT_FOUND_ROUTER_PATH} from "./dynamicComponentPage.token";

/**
 * Component used for displaying dynamic content pages
 */
@Component(
{
    selector: 'dynamic-component-page',
    templateUrl: 'dynamicComponentPage.component.html',
    styles:
    [
        `:host
        {
            display: block;
            min-height: 100%;
        }`
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicComponentPageComponent implements OnInit, OnDestroy
{
    //######################### private fields #########################

    /**
     * Subscription for url changes
     */
    private _urlChangeSubscription: Subscription;

    //######################### public properties - template bindings #########################

    /**
     * Metadata that are used for rendering layout of dynamic content
     */
    public metadata: DynamicComponentMetadata;

    /**
     * Custom injector used as parent dynamic content rendering
     */
    public customInjector: Injector;

    //######################### constructor #########################
    constructor(private _injector: Injector,
                private _route: ActivatedRoute,
                private _router: Router,
                private _http: HttpClient,
                private _changeDetector: ChangeDetectorRef,
                @Inject(DYNAMIC_COMPONENT_PAGE_METADATA_URL) private _urlPrefix: string,
                @Inject(NOT_FOUND_ROUTER_PATH) private _notFoundPath: string)
    {
    }

    //######################### public methods - implementation of OnInit #########################
    
    /**
     * Initialize component
     */
    public ngOnInit()
    {
        this._urlChangeSubscription = this._route.url.subscribe(async urlChanges =>
        {
            this._destroyRelations();

            if(urlChanges.length < 1)
            {
                this._router.navigate([this._notFoundPath]);

                return;
            }

            let dynamicContentId = urlChanges[0];
            let tmp = await this._http.get<RemoteDynamicContentMetadata>(`${this._urlPrefix}/${dynamicContentId}`)
                .pipe(catchError((err: HttpErrorResponse) =>
                {
                    //client error, not response from server
                    if (err.error instanceof Error)
                    {
                        return throwError(err);
                    }

                    if(err.status == 404)
                    {
                        return empty();
                    }

                    return throwError(err);
                }))
                .toPromise();

            let metadata: DynamicContentMetadata =
            {
                layout: null,
                relations: []
            };

            if(tmp)
            {
                metadata.layout = JSON.parse(tmp.layout);
                metadata.relations = JSON.parse(tmp.relations);
            }

            this.metadata = metadata.layout;

            this.customInjector = Injector.create(
            {
                parent: this._injector,
                providers:
                [
                    <ValueProvider>
                    {
                        provide: DYNAMIC_RELATIONS_METADATA,
                        useValue: metadata.relations
                    },
                    <StaticProvider>
                    {
                        useClass: ComponentRelationManager,
                        provide: ComponentRelationManager,
                        deps: [DYNAMIC_RELATIONS_METADATA, Injector]
                    },
                    <StaticProvider>
                    {
                        useClass: ComponentManager,
                        provide: ComponentManager,
                        deps: [ComponentRelationManager]
                    }
                ]
            });

            this._changeDetector.detectChanges();

            if(!tmp)
            {
                this._router.navigate([this._notFoundPath]);
            }
        });
    }

    //######################### public methods - implementation of OnDestroy #########################
    
    /**
     * Called when component is destroyed
     */
    public ngOnDestroy()
    {
        this._destroyRelations();

        if(this._urlChangeSubscription)
        {
            this._urlChangeSubscription.unsubscribe();
            this._urlChangeSubscription = null;
        }
    }

    //######################### private methods #########################

    /**
     * Destroys created relations
     */
    private _destroyRelations()
    {
        if(this.customInjector)
        {
            this.customInjector.get(ComponentManager).destroy();
            this.customInjector.get(ComponentRelationManager).destroy();
        }
    }
}