// import {Component, ChangeDetectionStrategy, ElementRef, AfterViewInit, ChangeDetectorRef, ViewChildren, QueryList, OnDestroy, Input, AfterContentInit, ContentChildren, Inject, OnInit, HostListener, Attribute, OnChanges, SimpleChanges, ContentChild, TemplateRef} from "@angular/core";
// import {DOCUMENT} from '@angular/common';
// import {nameof} from "@asseco/common";
// import * as positions from 'positions';

// import {Subscription} from "rxjs";
// import {OptionComponent} from "./option/option.component";
// import {OptionsAndValueManager, CompareValueFunc, GetOptionsCallback} from "../misc/optionsAndValueManager.interface";
// import {OptionsAndValueManager as OptionsAndValueManagerClass} from "../misc/optionsAndValueManager";
// import {NgSelectTemplateContext, NgSelectOptionTemplateContext, NgSelectApi} from "./ngSelect.interface";

// /**
//  * Component used for rendering bootstrap select
//  */
// @Component(
// {
//     selector: 'ng-select',
//     templateUrl: 'ngSelect.component.html',
//     styles:
//     [
//         `:host
//         {
//             display: block;
//         }

//         button.btn-select
//         {
//             display: flex;
//             width: 100%;
//             padding: 4px 0px 4px 4px;
//         }

//         button.btn-select .selected-value
//         {
//             flex: 1;
//             text-align: left;
//         }

//         button.btn-select .selected-caret
//         {
//             flex: 0 0 20px;
//             align-self: center;
//         }

//         .optionsDiv
//         {
//             z-index: 250;
//             background-color: #FFFFFF;
//             border-radius: 4px;
//             border: 1px solid #BBBBBB;
//             overflow: auto;
//         }

//         .optionsDiv .optionItem
//         {
//             padding: 3px 6px;
//             display: flex;
//             align-items: center;
//         }

//         .optionItem .option-item-text
//         {
//             min-width: 0;
//             flex: 1;
//         }

//         .optionItem .option-item-text:hover
//         {
//             cursor: pointer;
//         }

//         .optionItem .fa-check
//         {
//             margin-left: 8px;
//         }

//         .optionsDiv .optionItem.selected,
//         .optionsDiv .optionItem.active
//         {
//             background-color: #BBBBBB;
//         }

//         .optionsDiv .optionItem:hover
//         {
//             background-color: #E0E0E0;
//             cursor: pointer;
//         }
        
//         .optionsDiv .search-bar
//         {
//             padding: 2px 6px;
//             border-bottom: 1px solid #BBBBBB;
//         }
        
//         .optionsDiv .search-bar input
//         {
//             width: 100%;
//             border-radius: 4px;
//         }`
//     ],
//     changeDetection: ChangeDetectionStrategy.OnPush
// })
// export class NgSelectComponent<TValue> implements AfterViewInit, OnDestroy, AfterContentInit, OnInit, OnChanges, NgSelectApi<TValue>
// {
//     //######################### protected fields #########################

//     /**
//      * Subscription for changes of visibility of optionsDiv
//      */
//     protected _optionsDivVisibleSubscription: Subscription;

//     /**
//      * Subscription for changes of available options
//      */
//     protected _optionsChildrenSubscription: Subscription;

//     /**
//      * Instance of options and value manager, used for handling options and selected value
//      */
//     protected _optionsAndValueManager: OptionsAndValueManager<TValue>;

//     //######################### public properties #########################

//     /**
//      * Gets options and value manager, used for handling options and selected value
//      */
//     public get optionsAndValueManager(): OptionsAndValueManager<TValue>
//     {
//         return this._optionsAndValueManager;
//     }

//     //######################### public properties - inputs #########################

//     /**
//      * Coordinates of options pop relative to select
//      */
//     @Input()
//     public optionsCoordinates: Positions.PositionsCoordinates = 'top left';

//     /**
//      * Coordinates of select relative to options
//      */
//     @Input()
//     public selectCoordinates: Positions.PositionsCoordinates = 'bottom left';

//     /**
//      * Nothing selected text
//      */
//     @Input()
//     public nothingSelectedText: string;

//     /**
//      * Method used for comparision of selected value and options
//      */
//     @Input()
//     public valueComparer: CompareValueFunc<TValue> = (source, target) => source == target;

//     /**
//      * Method used for obtaining options
//      */
//     @Input()
//     public optionsObtainer: GetOptionsCallback<TValue>;

//     //######################### public properties - template bindings #########################

//     /**
//      * Currently selected value
//      */
//     public get value(): TValue|Array<TValue>
//     {
//         return this._optionsAndValueManager.value;
//     }

//     /**
//      * Indication whether is options div visible
//      * @internal
//      */
//     public optionsDivVisible: boolean = false;

//     /**
//      * Computed coordinates of optionsDiv
//      * @internal
//      */
//     public optionsDivStyle: Positions.PositionsCss = {};

//     /**
//      * Indication whether select should behave as multiselect
//      * @internal
//      */
//     public multiselect: boolean = false;

//     //######################### public properties - children #########################

//     /**
//      * Element with options
//      * @internal
//      */
//     @ViewChildren('optionsDiv')
//     public optionsDiv: QueryList<ElementRef<HTMLDivElement>>;

//     /**
//      * Available options
//      * @internal
//      */
//     @ContentChildren(OptionComponent)
//     public optionsChildren: QueryList<OptionComponent<TValue>>;

//     /**
//      * Template used for main look customization
//      * @internal
//      */
//     @ContentChild('look')
//     public look: TemplateRef<NgSelectTemplateContext<TValue>>;

//     /**
//      * Template used for options div look customization
//      * @internal
//      */
//     @ContentChild('optionsDivLook')
//     public optionsDivLook: TemplateRef<NgSelectTemplateContext<TValue>>;

//     /**
//      * Template used for option look customization
//      * @internal
//      */
//     @ContentChild('optionLook')
//     public optionLook: TemplateRef<NgSelectOptionTemplateContext<TValue>>;

//     /**
//      * Template used for option text look customization
//      * @internal
//      */
//     @ContentChild('optionTextLook')
//     public optionTextLook: TemplateRef<NgSelectOptionTemplateContext<TValue>>;

//     //######################### constructor #########################
//     constructor(protected _element: ElementRef<HTMLElement>,
//                 protected _changeDetector: ChangeDetectorRef,
//                 @Inject(DOCUMENT) protected _document: HTMLDocument,
//                 @Attribute('multiple') multiple,
//                 @Attribute('strict') strict)
//     {
//         this.multiselect = multiple === "";
//         this._optionsAndValueManager = new OptionsAndValueManagerClass<TValue>(this, this._changeDetector, this.multiselect, strict);
//         this._optionsAndValueManager.registerCompareValue(this.valueComparer);

//         if(this.multiselect)
//         {
//             this._optionsAndValueManager.setValue([]);
//         }
//     }

//     //######################### public methods - implementation of OnInit #########################

//     /**
//      * Initialize component
//      * @internal
//      */
//     public ngOnInit()
//     {
//         this._document.addEventListener('mouseup', this._handleClickOutside);
//         window.addEventListener('resize', this._handleResizeAndScroll);
//         window.addEventListener('scroll', this._handleResizeAndScroll);
//     }

//     //######################### public methods - implementation of OnChanges #########################
    
//     /**
//      * Called when input value changes
//      * @internal
//      */
//     public ngOnChanges(changes: SimpleChanges): void
//     {
//         if(nameof<NgSelectComponent<TValue>>('valueComparer') in changes && changes[nameof<NgSelectComponent<TValue>>('valueComparer')].currentValue)
//         {
//             this._optionsAndValueManager.registerCompareValue(this.valueComparer);
//         }

//         if(nameof<NgSelectComponent<TValue>>('optionsObtainer') in changes && changes[nameof<NgSelectComponent<TValue>>('optionsObtainer')].currentValue)
//         {
//             this._optionsAndValueManager.registerGetOptions(this.optionsObtainer);
//         }
//     }

//     //######################### public methods - implementation of AfterViewInit #########################

//     /**
//      * Called when view was initialized
//      * @internal
//      */
//     public ngAfterViewInit()
//     {
//         this._optionsDivVisibleSubscription = this.optionsDiv.changes.subscribe(() =>
//         {
//             this._calculatePositionAndDimensions();
//         });
//     }

//     //######################### public methods - implementation of AfterContentInit #########################

//     /**
//      * Called when content was initialized
//      * @internal
//      */
//     public ngAfterContentInit()
//     {
//         this._optionsChildrenSubscription = this.optionsChildren.changes.subscribe(() =>
//         {
//             this._optionsAndValueManager.setOptions(this.optionsChildren.toArray());
//         });

//         this._optionsAndValueManager.setOptions(this.optionsChildren.toArray());
//     }

//     //######################### public methods - implementation of OnDestroy #########################

//     /**
//      * Called when component is destroyed
//      * @internal
//      */
//     public ngOnDestroy()
//     {
//         if(this._optionsDivVisibleSubscription)
//         {
//             this._optionsDivVisibleSubscription.unsubscribe();
//             this._optionsDivVisibleSubscription = null;
//         }

//         if(this._optionsChildrenSubscription)
//         {
//             this._optionsChildrenSubscription.unsubscribe();
//             this._optionsChildrenSubscription = null;
//         }

//         this._document.removeEventListener('mouseup', this._handleClickOutside);
//         window.removeEventListener('resize', this._handleResizeAndScroll);
//         window.removeEventListener('scroll', this._handleResizeAndScroll);
//     }

//     //######################### public methods - host #########################

//     /**
//      * Handles keyboard events
//      * @param event Keyboard event
//      * @internal
//      */
//     @HostListener('keydown', ['$event'])
//     public handleKeyboard(event: KeyboardEvent)
//     {
//         if(event.key == "ArrowDown" || event.key == "ArrowUp")
//         {
//             this.optionsDivVisible = true;
//             let activeOption = this._optionsAndValueManager.options.find(itm => itm.active);

//             if(activeOption)
//             {
//                 let index = this._optionsAndValueManager.options.indexOf(activeOption);
//                 activeOption.active = false;

//                 //move down cursor
//                 if(event.key == "ArrowDown")
//                 {
//                     index += 1;
//                 }
//                 //move up cursor
//                 else
//                 {
//                     index -= 1;
//                 }

//                 if(index < 0)
//                 {
//                     index = this._optionsAndValueManager.options.length - 1;
//                 }

//                 index = index % this._optionsAndValueManager.options.length;

//                 this._optionsAndValueManager.options[index].active = true;
//             }
//             //none active before
//             else if(this._optionsAndValueManager.options.length)
//             {
//                 this._optionsAndValueManager.options[0].active = true;
//             }

//             event.preventDefault();
//         }

//         if(event.key == "Enter")
//         {
//             let activeOption = this._optionsAndValueManager.options.find(itm => itm.active);

//             if(activeOption)
//             {
//                 this._optionsAndValueManager.setSelected(activeOption);
//             }
//         }

//         if(event.key == "Tab")
//         {
//             this.optionsDivVisible = false;
//         }
//     }

//     //######################### public methods #########################

//     /**
//      * Explicitly runs invalidation of content (change detection)
//      */
//     public invalidateVisuals()
//     {
//         this._changeDetector.detectChanges();
//     }

//     //######################### public methods - template bindings #########################

//     /**
//      * Toggles options div visibility
//      * @internal
//      */
//     public toggleOptionsDiv()
//     {
//         this.optionsDivVisible = !this.optionsDivVisible;

//         this._optionsAndValueManager.options.forEach(option => option.active = false);
//     }

//     //######################### protected methods #########################

//     /**
//      * Handles resize event
//      */
//     protected _handleResizeAndScroll = () =>
//     {
//         this._calculatePositionAndDimensions();
//     };

//     /**
//      * Handles click outside of select element
//      * @param event Mouse event object
//      */
//     protected _handleClickOutside = (event: MouseEvent) =>
//     {
//         if(this._element.nativeElement != event.target && !isDescendant(this._element.nativeElement, event.target as HTMLElement))
//         {
//             this.optionsDivVisible = false;

//             this._changeDetector.detectChanges();
//         }
//     }

//     /**
//      * Calculates positions and dimensions of popup
//      */
//     protected _calculatePositionAndDimensions()
//     {
//         let optionsDiv = this.optionsDiv.first;

//         if(optionsDiv)
//         {
//             optionsDiv.nativeElement.style.minWidth = `${this._element.nativeElement.clientWidth}px`;

//             //set to default position
//             this.optionsDivStyle = positions(optionsDiv.nativeElement, this.optionsCoordinates, this._element.nativeElement, this.selectCoordinates);
//             this._changeDetector.detectChanges();

//             //flip if collision with viewport
//             this.optionsDivStyle = this._flipIfCollision(optionsDiv.nativeElement);
//             this._changeDetector.detectChanges();

//             //set maxHeight if there is not more place
//             if(this._updateHeight(optionsDiv.nativeElement))
//             {
//                 this.optionsDivStyle = this._flipIfCollision(optionsDiv.nativeElement);
//                 this._changeDetector.detectChanges();
//             }
//         }
//     }

//     /**
//      * Updates height of element
//      * @param optionsDiv Html element for options div
//      */
//     protected _updateHeight(optionsDiv: HTMLElement): boolean
//     {
//         let rect = optionsDiv.getBoundingClientRect(),
//             selectRect = this._element.nativeElement.getBoundingClientRect(),
//             h = Math.max(this._document.documentElement.clientHeight, window.innerHeight || 0);

//         //options are above
//         if(rect.top < selectRect.top)
//         {
//             //space above is not enough
//             if(selectRect.top < rect.height)
//             {
//                 optionsDiv.style.maxHeight = `${selectRect.top - 2}px`;

//                 return true;
//             }
//             else
//             {
//                 optionsDiv.style.maxHeight = '';

//                 return false;
//             }
//         }
//         //options are below
//         else
//         {
//             //space below is not enough
//             if(h - selectRect.bottom < rect.height)
//             {
//                 optionsDiv.style.maxHeight = `${h - selectRect.bottom - 2}px`;

//                 return true;
//             }
//             else
//             {
//                 optionsDiv.style.maxHeight = '';

//                 return false;
//             }
//         }
//     }

//     /**
//      * Flips html element position if collision occur
//      * @param optionsDiv Html element to be flipped if collisions occur
//      */
//     protected _flipIfCollision(optionsDiv: HTMLElement): Positions.PositionsCss
//     {
//         let w = Math.max(this._document.documentElement.clientWidth, window.innerWidth || 0),
//             h = Math.max(this._document.documentElement.clientHeight, window.innerHeight || 0),
//             rect = optionsDiv.getBoundingClientRect(),
//             selectRect = this._element.nativeElement.getBoundingClientRect(),
//             spaceAbove = selectRect.top,
//             spaceUnder = h - selectRect.bottom,
//             spaceBefore = selectRect.left,
//             spaceAfter = w - selectRect.right,
//             optionsCoordinates = this.optionsCoordinates,
//             selectCoordinates = this.selectCoordinates;

//         //vertical overflow
//         if((h < (rect.top + rect.height) &&
//             spaceUnder < spaceAbove) ||
//            (rect.top < 0 &&
//             spaceAbove < spaceUnder))
//         {
//             optionsCoordinates = this._flipVertiacal(optionsCoordinates);
//             selectCoordinates = this._flipVertiacal(selectCoordinates);
//         }

//         //horizontal overflow
//         if((w < (rect.left + rect.width) &&
//             spaceAfter < spaceBefore) ||
//            (rect.left < 0 &&
//             spaceBefore < spaceAfter))
//         {
//             optionsCoordinates = this._flipHorizontal(optionsCoordinates);
//             selectCoordinates = this._flipHorizontal(selectCoordinates);
//         }

//         return positions(optionsDiv, optionsCoordinates, this._element.nativeElement, selectCoordinates);
//     }

//     /**
//      * Flips vertical position
//      * @param position Position to be flipped vertically
//      */
//     protected _flipVertiacal(position: Positions.PositionsCoordinates): Positions.PositionsCoordinates
//     {
//         if(position.indexOf('top') >= 0)
//         {
//             return position.replace('top', 'bottom') as Positions.PositionsCoordinates;
//         }
//         else if(position.indexOf('bottom') >= 0)
//         {
//             return position.replace('bottom', 'top') as Positions.PositionsCoordinates;
//         }

//         return position;
//     }

//     /**
//      * Flips horizontal position
//      * @param position Position to be flipped horizontally
//      */
//     protected _flipHorizontal(position: Positions.PositionsCoordinates): Positions.PositionsCoordinates
//     {
//         if(position.indexOf('right') >= 0)
//         {
//             return position.replace('right', 'left') as Positions.PositionsCoordinates;
//         }
//         else if(position.indexOf('left') >= 0)
//         {
//             return position.replace('left', 'right') as Positions.PositionsCoordinates;
//         }

//         return position;
//     }
// }

// /**
//  * Gets indication whether is child descendand of parent
//  * @param parent Parent to be tested
//  * @param child Child to be looked for
//  */
// function isDescendant(parent: HTMLElement, child: HTMLElement): boolean
// {
//     let node = child.parentNode;

//     while (node != null)
//     {
//         if (node == parent)
//         {
//             return true;
//         }

//         node = node.parentNode;
//     }

//     return false;
// }

// // /**
// //  * Computes offset of element against document
// //  * @param element Html element which offset is counted
// //  * @param doc Html document to be used for extracting scroll offset
// //  */
// // function offset(element: HTMLElement, doc?: HTMLDocument)
// // {
// //     doc = doc || document;

// //     let rect = element.getBoundingClientRect(),
// //         scrollLeft = window.pageXOffset || doc.documentElement.scrollLeft,
// //         scrollTop = window.pageYOffset || doc.documentElement.scrollTop;

// //     return {
// //         top: rect.top + scrollTop,
// //         left: rect.left + scrollLeft,
// //         bottom: rect.top + scrollTop + rect.height,
// //         right: rect.left + scrollLeft + rect.width
// //     };
// // }