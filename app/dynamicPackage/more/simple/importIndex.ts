import {noop} from '@asseco/common';

import {SimpleModule} from './module';
import {SimpleComponent} from './component';
import {NgModuleFactoryPromise} from '../../../ngDynamic-core';

declare var isAot: boolean;

export const moduleFactory: Promise<NgModuleFactoryPromise> = import(`./module/index${isAot ? '.aot' : ''}`).catch(noop);
export {SimpleComponent as component};
export {SimpleModule as module};