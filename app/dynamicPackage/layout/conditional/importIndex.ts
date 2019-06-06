import {noop} from '@ng/common';

import {ConditionalModule} from './module';
import {ConditionalComponent} from './component';
import {NgModuleFactoryPromise} from '../../../ngDynamic-core';

declare var isAot: boolean;

export const moduleFactory: Promise<NgModuleFactoryPromise> = import(`./module/index${isAot ? '.aot' : ''}`).catch(noop);
export {ConditionalComponent as component};
export {ConditionalModule as module};