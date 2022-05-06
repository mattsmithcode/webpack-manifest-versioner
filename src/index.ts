import { validate } from 'schema-utils';
import { Schema } from 'schema-utils/declarations/validate';
import { Compiler } from 'webpack';
import { Global } from './global';
import { CompilationHook } from './hooks/compilation';
import schema from './schema.json';

interface WebpackPlugin
{
    apply: (compiler: Compiler) => void;
}

class ManifestVersionerPlugin implements WebpackPlugin
{
    constructor(options: Global.ManifestVersionerOptions)
    {
        validate(
            schema as unknown as Schema,
            options,
            { name: Global.pluginName }
        );

        for (const file of options.files)
        {
            if (file.target)
                continue;

            if (!options.defaultTarget)
                throw new Error(`${file.source} has no target and defaultTarget is not set`);
            
            file.target = options.defaultTarget;
        }

        Object.assign(
            Global.options,
            options
        );
    }

    apply(compiler: Compiler)
    {
        CompilationHook.hook(compiler);
    }
}

export = ManifestVersionerPlugin;
