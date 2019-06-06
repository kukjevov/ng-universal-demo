
import {DynamicModule} from "../../../../../ngDynamic-core";
import {TextBlockDesignerModule} from './module';
import {TextBlockDesignerComponent} from './component';

export const placeholderModule: DynamicModule =
{
    component: TextBlockDesignerComponent,
    module: TextBlockDesignerModule
};

export * from './metadata';