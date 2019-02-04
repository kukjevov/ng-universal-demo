import {noop} from '@ng/common';

import {InputModule} from './module';
import {InputComponent} from './component';
import {NgModuleFactoryPromise} from '../../../ngDynamic-core';

declare var isAot: boolean;

export const moduleFactory: Promise<NgModuleFactoryPromise> = import(`./module/index${isAot ? '.aot' : ''}`).catch(noop);
export {InputComponent as component};
export {InputModule as module};