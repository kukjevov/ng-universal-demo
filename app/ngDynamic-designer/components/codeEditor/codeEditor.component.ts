import {Component, ChangeDetectionStrategy, ElementRef, OnInit, OnDestroy, AfterViewInit} from "@angular/core";
import {editor, Uri} from 'monaco-editor';
import {Subscription} from "rxjs";

import {CodeService} from "../../services";
import {CodeMetadata} from "../../interfaces";

import './monaco.init';

/**
 * Component used for displaying code editor
 */
@Component(
{
    selector: 'div[code-editor]',
    template: '',
    host:
    {
        "[style.gridColumnStart]": "'1'",
        "[style.gridColumnEnd]": "'3'",
        "[style.width]": "'100%'",
        "[style.height]": "'100%'"
    },
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CodeEditorComponent implements OnInit, OnDestroy, AfterViewInit
{
    //######################### private fields #########################

    /**
     * Instance of code editor
     */
    private _codeEditor: editor.IStandaloneCodeEditor;

    /**
     * Opened file in editor
     */
    private _openedFile: editor.ITextModel;

    /**
     * Subscription for changes in code
     */
    private _codeChangeSubscription: Subscription;

    /**
     * Code metadata
     */
    private _metadata: CodeMetadata;

    //######################### constructor #########################
    constructor(private _element: ElementRef<HTMLDivElement>,
                private _codeSvc: CodeService)
    {
        this._codeChangeSubscription = this._codeSvc.codeChange.subscribe(metadata =>
        {
            this._metadata = metadata;
            this._updateContent();
        });
    }

    //######################### public methods - implementation of OnInit #########################

    /**
     * Initialize component
     */
    public ngOnInit()
    {
        this._codeEditor = editor.create(this._element.nativeElement,
        {
            theme: 'vs-dark',
            model: this._openedFile,
            lightbulb:
            {
                enabled: true
            }
        });
    }

    //######################### public methods - implementation of AfterViewInit #########################
    
    /**
     * Called when view was initialized
     */
    public ngAfterViewInit()
    {
        let observer = new MutationObserver((mutations, observer) =>
        {
            if(mutations.length)
            {
                if(mutations[0].oldValue.indexOf('display: none;') >= 0)
                {
                    this._codeEditor.layout(
                    {
                        height: this._element.nativeElement.offsetHeight,
                        width: this._element.nativeElement.offsetWidth
                    });
                }
            }
        });

        observer.observe(this._element.nativeElement,
        {
            subtree: false,
            childList: false,
            attributes: true,
            attributeOldValue: true,
            characterData: false,
            characterDataOldValue: false,
            attributeFilter: ['style']
        });
    }

    //######################### public methods - implementation of OnDestroy #########################
    
    /**
     * Called when component is destroyed
     */
    public ngOnDestroy()
    {
        if(this._openedFile)
        {
            this._openedFile.dispose();
            this._openedFile = null;
        }

        if(this._codeEditor)
        {
            this._codeEditor.dispose();
            this._codeEditor = null;
        }

        if(this._codeChangeSubscription)
        {
            this._codeChangeSubscription.unsubscribe();
            this._codeChangeSubscription = null;
        }

        this._metadata = null;
        this._codeSvc.destroy();
    }

    //######################### private methods #########################

    /**
     * Updates content of code editor
     */
    private _updateContent()
    {
        if(this._openedFile)
        {
            this._openedFile.dispose();
            this._openedFile = null;
        }

        if(this._metadata.language == 'typescript')
        {
            this._openedFile = editor.createModel(this._metadata.value || this._metadata.template, "typescript", Uri.file("index.ts"))
            this._codeEditor.setModel(this._openedFile);
        }
        else if(this._metadata.language == 'handlebars')
        {
            this._openedFile = editor.createModel(this._metadata.value || this._metadata.template, "handlebars", Uri.file("index.hbs"))
            this._codeEditor.setModel(this._openedFile);
        }
    }
}