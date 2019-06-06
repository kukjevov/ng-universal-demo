import {noop} from '@ng/common';

import {GridModule} from './module';
import {GridComponent} from './component';
import {NgModuleFactoryPromise} from '../../../ngDynamic-core';

declare var isAot: boolean;

export const moduleFactory: Promise<NgModuleFactoryPromise> = import(`./module/index${isAot ? '.aot' : ''}`).catch(noop);
export {GridComponent as component};
export {GridModule as module};