import {noop} from '@asseco/common';

import {ButtonModule} from './module';
import {ButtonComponent} from './component';
import {NgModuleFactoryPromise} from '../../../ngDynamic-core';

declare var isAot: boolean;

export const moduleFactory: Promise<NgModuleFactoryPromise> = import(`./module/index${isAot ? '.aot' : ''}`).catch(noop);
export {ButtonComponent as component};
export {ButtonModule as module};