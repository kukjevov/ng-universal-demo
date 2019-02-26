// import {ChangeDetectorRef} from '@angular/core';
// import {isBlank, isPresent} from '@asseco/common';
// import {Observable, Subject} from 'rxjs';

// import {OptionsAndValueManager as OptionsAndValueManagerInterface, GetOptionsCallback, CompareValueFunc} from './optionsAndValueManager.interface';
// import {OptionComponent} from '../components/option/option.component';
// import {NgSelectComponent} from '../components/ngSelect.component';

// /**
//  * Implementation of OptionsAndValueManager
//  */
// export class OptionsAndValueManager<TValue> implements OptionsAndValueManagerInterface<TValue>
// {
//     //######################### private fields #########################

//     /**
//      * Array of all options
//      */
//     private _allOptions: Array<OptionComponent<TValue>> = [];

//     /**
//      * Occurs when value changes
//      */
//     private _valueChangeSubject: Subject<void> = new Subject<void>();

//     /**
//      * Occurs when last know value is requested and to be set
//      */
//     private _lastValueRequestSubject: Subject<void> = new Subject<void>();

//     /**
//      * Array of displayed options
//      */
//     private _options: Array<OptionComponent<TValue>> = [];

//     /**
//      * Currently selected option(s)
//      */
//     private _selectedOption: OptionComponent<TValue>|Array<OptionComponent<TValue>>;

//     /**
//      * Value comparer used for value comparison
//      */
//     private _valueComparer: CompareValueFunc<TValue>;

//     /**
//      * Options obtainer used for obtaining options
//      */
//     private _optionsObtainer: GetOptionsCallback<TValue>;

//     /**
//      * Indication whether is manager initialized and ready to be set
//      */
//     private _initialized: boolean;

//     //######################### public properties #########################

//     /**
//      * Currently selected value
//      */
//     public get value(): TValue|Array<TValue>
//     {
//         if(!this._selectedOption || (Array.isArray(this._selectedOption) && !this._selectedOption.length))
//         {
//             return this._multiselect ? [] : null;
//         }

//         if(this._multiselect && Array.isArray(this._selectedOption))
//         {
//             return this._selectedOption.map(itm => itm.value);
//         }

//         return (this._selectedOption as OptionComponent<TValue>).value;
//     }

//     /**
//      * Occurs when value changes
//      */
//     public get valueChange(): Observable<void>
//     {
//         return this._valueChangeSubject.asObservable();
//     }

//     /**
//      * Occurs when last know value is requested and to be set
//      */
//     public get lastValueRequest(): Observable<void>
//     {
//         return this._lastValueRequestSubject.asObservable();
//     }

//     /**
//      * Array of displayed options
//      */
//     public get options(): Array<OptionComponent<TValue>>
//     {
//         return this._options;
//     }

//     /**
//      * Currently selected option(s)
//      */
//     public get selectedOption(): OptionComponent<TValue>|Array<OptionComponent<TValue>>
//     {
//         return this._selectedOption;
//     }

//     /**
//      * Indication whether is manager initialized and ready to be set
//      */
//     public get initialized(): boolean
//     {
//         return this._initialized;
//     }

//     //######################### constructor #########################
//     constructor(private _ngSelect: NgSelectComponent<TValue>,
//                 private _changeDetector: ChangeDetectorRef,
//                 private _multiselect: boolean,
//                 private _strict: boolean)
//     {
//     }

//     //######################### public methods #########################

//     /**
//      * Sets selected option, in case of multiselect it toggles selected value
//      * @param option Options to be set as selected
//      */
//     public setSelected(option: OptionComponent<TValue>)
//     {
//         if(this._multiselect)
//         {
//             if(Array.isArray(this._selectedOption))
//             {
//                 let index = this._selectedOption.indexOf(option);

//                 //select
//                 if(index < 0)
//                 {
//                     this._selectedOption.push(option);
//                     option.selected = true;
//                 }
//                 //deselect
//                 else
//                 {
//                     this._selectedOption.splice(index, 1);
//                     option.selected = false;
//                 }

//                 this._selectedOption = [...this._selectedOption];
//             }
//         }
//         else
//         {
//             if(this._selectedOption)
//             {
//                 (this._selectedOption as OptionComponent<TValue>).selected = false;
//             }
            
//             option.selected = true;
//             this._selectedOption = option;
//             this._ngSelect.optionsDivVisible = false;
//         }

//         this._options = this._allOptions;
//         this._valueChangeSubject.next();
//     }

//     /**
//      * Sets value of select
//      * @param value Value to be set for select
//      */
//     public async setValue(value: TValue|Array<TValue>, options?: {noModelChange?: boolean})
//     {
//         this._allOptions.forEach(option => option.active = option.selected = false);
//         this._selectedOption = null;

//         if(isPresent(value))
//         {
//             await this._setSelectedOptions(value);
//             this._strictSync();
//         }

//         this._changeDetector.detectChanges();

//         if(!options || !options.noModelChange)
//         {
//             this._valueChangeSubject.next();
//         }
//     }

//     /**
//      * Sets all available options
//      */
//     public async setOptions(options: Array<OptionComponent<TValue>>)
//     {
//         this._allOptions = options || [];
//         this._options = this._allOptions;
//         this._initialized = true;

//         this._lastValueRequestSubject.next();
//     }

//     /**
//      * Filters displayed options using query
//      * @param query Query used for filtering
//      */
//     public async filterOptions(query: string)
//     {
//         //no filtering options
//         if(isBlank(query) || query === '')
//         {
//             this._options = [...this._allOptions];

//             return;
//         }

//         this._options = await this._optionsObtainer(query, [...this._allOptions]);
//         this._resetActive();

//         this._changeDetector.detectChanges();
//     }

//     /**
//      * Registers callback used for obtaining options
//      * @param callback Callback used for obtaining options
//      */
//     public registerGetOptions(callback: GetOptionsCallback<TValue>)
//     {
//         this._optionsObtainer = callback;
//     }

//     /**
//      * Registers compare value function for comparing values
//      * @param func Function used for comparison
//      */
//     public registerCompareValue(func: CompareValueFunc<TValue>)
//     {
//         this._valueComparer = func;
//     }

//     //######################### private methods #########################

//     /**
//      * Sets selected options
//      * @param value Value to be set
//      */
//     private async _setSelectedOptions(value: TValue|Array<TValue>)
//     {
//         if(this._multiselect && Array.isArray(value))
//         {
//             if(!this._selectedOption)
//             {
//                 this._selectedOption = [];
//             }

//             if(Array.isArray(this._selectedOption))
//             {
//                 for(let x = 0; x < value.length; x++)
//                 {
//                     let selectedOption = await this._getOption(value[x]);

//                     if(!selectedOption)
//                     {
//                         selectedOption = 
//                         {
//                             value: value[x],
//                             active: false,
//                             selected: true,
//                             text: (value[x] || '').toString()
//                         };
//                     }

//                     this._selectedOption.push(selectedOption);
//                     selectedOption.selected = true;
//                 }
//             }
//         }
//         else
//         {
//             this._selectedOption = await this._getOption(value as TValue);

//             if(!this._selectedOption)
//             {
//                 this._selectedOption = 
//                 {
//                     value: value as TValue,
//                     active: false,
//                     selected: true,
//                     text: (value || '').toString()
//                 };
//             }

//             this._selectedOption.selected = true;
//         }
//     }

//     /**
//      * Obtains option for value
//      * @param value Value for which is option obtained
//      */
//     private async _getOption(value: TValue): Promise<OptionComponent<TValue>>
//     {
//         if(this._optionsObtainer)
//         {
//             let options = await this._optionsObtainer(value, [...this._allOptions]);

//             return options.find(option => this._valueComparer(option.value, value));
//         }

//         return this._allOptions.find(option => this._valueComparer(option.value, value));
//     }

//     /**
//      * Synchronize options and values, removes values which are not strictly contained in options
//      */
//     private _strictSync()
//     {
//         if(!this._strict)
//         {
//             return;
//         }

//         let valueStripped = false;

//         if(this._multiselect && Array.isArray(this._selectedOption))
//         {
//             let selectedOptions = [];

//             this._selectedOption.forEach(selectedOption =>
//             {
//                 if(this._allOptions.find(option => this._valueComparer(selectedOption.value, option.value)))
//                 {
//                     selectedOptions.push(selectedOption);
//                 }
//                 else
//                 {
//                     valueStripped = true;
//                 }
//             });

//             this._selectedOption = selectedOptions;
//         }
//         else
//         {
//             let selectedOption = this._selectedOption as OptionComponent<TValue>;
            
//             if(!this._allOptions.find(option => this._valueComparer(selectedOption.value, option.value)))
//             {
//                 valueStripped = true;

//                 this._selectedOption = null;
//             }
//         }

//         if(valueStripped)
//         {
//             this._valueChangeSubject.next();
//         }
//     }

//     /**
//      * Resets options active flag
//      */
//     private _resetActive()
//     {
//         if(this._selectedOption && Array.isArray(this._selectedOption))
//         {
//             this._selectedOption.forEach(option => option.active = false);
//         }

//         this._options.forEach(option => option.active = false);
//         this._allOptions.forEach(option => option.active = false);
//     }
// }