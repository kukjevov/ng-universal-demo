import {noop} from '@ng/common';

import {BlockModule} from './module';
import {BlockComponent} from './component';
import {NgModuleFactoryPromise} from '../../../ngDynamic-core';

declare var isAot: boolean;

export const moduleFactory: Promise<NgModuleFactoryPromise> = import(`./module/index${isAot ? '.aot' : ''}`).catch(noop);
export {BlockComponent as component};
export {BlockModule as module};