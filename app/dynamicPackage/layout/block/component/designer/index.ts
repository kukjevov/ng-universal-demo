import {DynamicModule} from "../../../../../ngDynamic-core";
import {BlockDesignerModule} from './module';
import {BlockDesignerComponent} from './component';

export const placeholderModule: DynamicModule =
{
    component: BlockDesignerComponent,
    module: BlockDesignerModule
};

export * from './metadata';