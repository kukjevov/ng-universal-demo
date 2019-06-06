import {DynamicModule} from "../../../../../ngDynamic-core";
import {StackDesignerModule} from './module';
import {StackDesignerComponent} from './component';

export const placeholderModule: DynamicModule =
{
    component: StackDesignerComponent,
    module: StackDesignerModule
};

export * from './metadata';