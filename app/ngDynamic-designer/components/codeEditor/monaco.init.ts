import {languages} from "monaco-editor";

(self as any).MonacoEnvironment = 
{
    getWorkerUrl: function(_moduleId, label)
    {
        if (label === 'json')
        {
            return 'dist/json.worker.js';
        }
        if (label === 'css')
        {
            return 'dist/css.worker.js';
        }
        if (label === 'html' || label == 'handlebars')
        {
            return 'dist/html.worker.js';
        }
        if (label === 'typescript' || label === 'javascript')
        {
            return 'dist/ts.worker.js';
        }
        return 'dist/editor.worker.js';
    }
}

let options: languages.typescript.CompilerOptions =
{
    target: languages.typescript.ScriptTarget.ES5,
    module: languages.typescript.ModuleKind.CommonJS,
    moduleResolution: languages.typescript.ModuleResolutionKind.NodeJs,
    allowNonTsExtensions: true,
    removeComments: true,
    typeRoots: ["node_modules/@types"]
};

languages.typescript.typescriptDefaults.setCompilerOptions(options);