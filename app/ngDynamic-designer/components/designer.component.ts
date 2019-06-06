import {Component, ChangeDetectionStrategy, OnInit, OnDestroy, ChangeDetectorRef, ExistingProvider, Inject, ViewChild} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Subscription, throwError, empty} from "rxjs";

import {DesignerMode, RemoteDesignerState, DesignerState} from "./designer.interface";
import {ComponentsService, PropertiesService, DragService, CodeService} from "../services";
import {NODE_PROPERTIES_SERVICE} from "./nodeDesigner/nodeDesigner.interface";
import {LayoutDesignerComponent} from "./layoutDesigner/layoutDesigner.component";
import {CodeEditorComponent} from "./codeEditor/codeEditor.component";
import {NodeDesignerModeComponent} from "./nodeDesignerMode/nodeDesignerMode.component";
import {DESIGNER_PACKAGE_NAMES} from "./designer.tokens";
import {ActivatedRoute} from "@angular/router";
import {catchError} from "rxjs/operators";

/**
 * Component used for displaying designer
 */
@Component(
{
    selector: 'dynamic-designer',
    templateUrl: 'designer.component.html',
    providers: 
    [
        ComponentsService,
        DragService,
        PropertiesService,
        CodeService,
        <ExistingProvider>
        {
            provide: NODE_PROPERTIES_SERVICE,
            useExisting: PropertiesService
        }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DesignerPageComponent implements OnInit, OnDestroy
{
    //######################### private fields #########################

    /**
     * Subscription for url changes
     */
    private _urlChangeSubscription: Subscription;

    /**
     * Actual view mode for designer
     */
    private _mode: DesignerMode;

    //######################### public fields - template bindings #########################

    /**
     * Designer view modes enum
     */
    public designerModes = DesignerMode;

    /**
     * Holds current designer state
     */
    public designerState: DesignerState;

    /**
     * Id of currently loaded designer page
     */
    public id: string;

    //######################### public properties - children #########################

    /**
     * Instance of layout designer component
     */
    @ViewChild(LayoutDesignerComponent)
    public ɵLayoutDesigner: LayoutDesignerComponent;

    /**
     * Instance of node designer component
     */
    @ViewChild(NodeDesignerModeComponent)
    public ɵNodeDesigner: NodeDesignerModeComponent;

    /**
     * Instance of code editor component
     */
    @ViewChild(CodeEditorComponent)
    public ɵCodeEditor: CodeEditorComponent;

    //######################### constructor #########################
    constructor(private _changeDetector: ChangeDetectorRef,
                private _http: HttpClient,
                private _route: ActivatedRoute,
                @Inject(DESIGNER_PACKAGE_NAMES) public designerPackageNames: string[])
    {
    }

    //######################### public methods - implementation of OnInit #########################
    
    /**
     * Initialize component
     */
    public async ngOnInit()
    {
        this.setMode(DesignerMode.LAYOUT);

        this._urlChangeSubscription = this._route.params.subscribe(async (params: {id: string}) =>
        {
            this.id = params.id;

            let tmp = await this._http.get<RemoteDesignerState>(`api/dynamic/state/${this.id}`)
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

            if(tmp)
            {
                this.designerState =
                {
                    designerMetadata:
                    {
                        nodeDesignerMetadata: JSON.parse(tmp.designerMetadata.nodeDesignerMetadata)
                    },
                    metadata:
                    {
                        layout: JSON.parse(tmp.metadata.layout),
                        relations: JSON.parse(tmp.metadata.relations)
                    }
                };
            }

            this._changeDetector.detectChanges();
        });
    }

    //######################### public methods - implementation of OnDestroy #########################
    
    /**
     * Called when component is destroyed
     */
    public ngOnDestroy()
    {
        if(this._urlChangeSubscription)
        {
            this._urlChangeSubscription.unsubscribe();
            this._urlChangeSubscription = null;
        }
    }

    //######################### public methods - template bindings #########################

    /**
     * Sets view mode for designer
     * @param mode view mode
     */
    public setMode(mode: DesignerMode)
    {
        this._mode = mode;

        this._changeDetector.detectChanges();
    }

    /**
     * Checks if designer is in specific mode
     * @param mode view mode
     */
    public isMode(mode: DesignerMode)
    {
        return this._mode == mode;
    }

    /**
     * Saves current state of designer
     */
    public async save()
    {
        if(this._mode == DesignerMode.CODE)
        {
            this.ɵCodeEditor.save();
        }

        let layoutMetadata: string = '{}';

        if(this.ɵLayoutDesigner.rootComponent)
        {
            layoutMetadata = JSON.stringify(this.ɵLayoutDesigner.rootComponent.metadata, (_key, value) =>
            {
                if(value && value.ɵId && value.id && value.componentPackage && value.componentName && value.options)
                {
                    return {
                        id: value.id,
                        componentPackage: value.componentPackage,
                        componentName: value.componentName,
                        options: value.options
                    };
                }

                return value;
            });
        }

        let relationsMetadata = JSON.stringify(await this.ɵNodeDesigner.nodeDesigner.metadata);
        let nodeDesignerMetadata = JSON.stringify(this.ɵNodeDesigner.nodeDesigner.designerMetadata);

        await this._http.post(`api/dynamic/state/${this.id}`,
                              <RemoteDesignerState>
                              {
                                  metadata:
                                  {
                                      layout: layoutMetadata,
                                      relations: relationsMetadata
                                  },
                                  designerMetadata:
                                  {
                                      nodeDesignerMetadata: nodeDesignerMetadata
                                  }
                              },
                              {
                                  headers:
                                  {
                                      'Content-Type': 'application/json'
                                  }
                              }).toPromise();
    }
}