import {noop} from '@ng/common';

import {StackModule} from './module';
import {StackComponent} from './component';
import {NgModuleFactoryPromise} from '../../../ngDynamic-core';

declare var isAot: boolean;

export const moduleFactory: Promise<NgModuleFactoryPromise> = import(`./module/index${isAot ? '.aot' : ''}`).catch(noop);
export {StackComponent as component};
export {StackModule as module};