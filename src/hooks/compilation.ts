import { Compiler } from 'webpack';
import { Global } from '../global';
import { ProcessAssetsSummarizeHook } from './processAssetsSummarize';

namespace CompilationHook
{
    export function hook(compiler: Compiler): void
    {
        compiler.hooks.compilation.tap(
            Global.pluginName,
            compilation => ProcessAssetsSummarizeHook.hook(compilation)
        );
    }
}

export { CompilationHook };
