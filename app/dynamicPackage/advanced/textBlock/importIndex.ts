import {noop} from '@asseco/common';

import {TextBlockModule} from './module';
import {TextBlockComponent} from './component';
import {NgModuleFactoryPromise} from '../../../ngDynamic-core';

declare var isAot: boolean;

export const moduleFactory: Promise<NgModuleFactoryPromise> = import(`./module/index${isAot ? '.aot' : ''}`).catch(noop);
export {TextBlockComponent as component};
export {TextBlockModule as module};