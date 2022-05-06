import path from 'path';
import { Compilation, sources } from 'webpack';
import { Global } from '../global';
import { Utilities } from '../utilities';
import AssetList = Global.AssetList;
import RawSource = sources.RawSource;

namespace ProcessAssetsSummarizeHook
{
    export function hook(compilation: Compilation): void
    {
        compilation.hooks.processAssets.tap(
            {
                name: Global.pluginName,
                stage: Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE
            },
            (assets) => {
                const publicPaths: AssetList = {};
                const sourcePaths: AssetList = {};

                for (const assetPath in assets)
                {
                    const assetInfo = compilation.assetsInfo.get(assetPath);
                    const [assetName, publicPath] = Utilities.cleanPaths(
                        compilation.compiler.options.output.publicPath as string,
                        assetInfo.sourceFilename,
                        assetPath
                    );

                    publicPaths[assetName] = publicPath;
                    sourcePaths[assetInfo.sourceFilename] = assetPath;
                }

                const assetNames = Object.keys(publicPaths);

                for (const file of Global.options.files)
                {
                    let fileContents = Utilities.getFileContents(
                        compilation,
                        file
                    );

                    for (const assetName of assetNames)
                    {
                        if (fileContents.includes(assetName))
                        {
                            fileContents = fileContents.replace(
                                assetName,
                                publicPaths[assetName]
                            );
                        }
                    }

                    const outputFilePath = Utilities.getOutputFileName(
                        compilation,
                        file,
                        fileContents
                    );

                    const entryName = Utilities.joinPaths(
                        path.dirname(outputFilePath),
                        path.basename(file.source)
                    );

                    const rawSource = new RawSource(fileContents);

                    if (entryName in sourcePaths)
                    {
                        Utilities.renameAndUpdateAsset(
                            compilation,
                            sourcePaths[entryName],
                            outputFilePath,
                            rawSource
                        );
                    }
                    else
                    {
                        compilation.emitAsset(
                            outputFilePath,
                            rawSource,
                            {
                                sourceFilename: entryName
                            }
                        );
                    }
                }
            }
        );
    }
}

export { ProcessAssetsSummarizeHook };
