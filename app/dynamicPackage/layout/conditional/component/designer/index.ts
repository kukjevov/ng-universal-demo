import {DynamicModule} from "../../../../../ngDynamic-core";
import {ConditionalDesignerModule} from './module';
import {ConditionalDesignerComponent} from './component';

export const placeholderModule: DynamicModule =
{
    component: ConditionalDesignerComponent,
    module: ConditionalDesignerModule
};

export * from './metadata';