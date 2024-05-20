import {globalExternals} from '@fal-works/esbuild-plugin-global-externals';

/** Mapping from module paths to global variables */
const globals = 
{
    numeral: 'numeral',
};

const globalsReplace = globalExternals(globals);

export default globalsReplace;
