import {noop} from '@ng/common';

import {FormModule} from './module';
import {FormComponent} from './component';
import {NgModuleFactoryPromise} from '../../../ngDynamic-core';

declare var isAot: boolean;

export const moduleFactory: Promise<NgModuleFactoryPromise> = import(`./module/index${isAot ? '.aot' : ''}`).catch(noop);
export {FormComponent as component};
export {FormModule as module};