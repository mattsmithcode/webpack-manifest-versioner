import { readFileSync } from 'fs';
import path from 'path';
import { Compilation, sources } from 'webpack';
import { Global } from './global';

namespace Utilities {
    export function cleanPaths(publicPath: string, sourcePath: string, assetName: string): [string, string]
    {
        const assetPath = joinPaths(
            publicPath.replace(/^\/|\/$/, ''),
            path.dirname(assetName)
        );

        return [
            joinPaths(
                assetPath,
                path.basename(sourcePath || assetName)
                    .split(/[?#]/)[0]
            ),
            joinPaths(
                '/',
                assetPath,
                path.basename(assetName)
            )
        ];
    }

    export function getAssetAbsolutePath(compilation: Compilation, sourceFile: string): string
    {
        return path.resolve(
            compilation.compiler.context,
            sourceFile
        );
    }

    export function getAssetInfo(compilation: Compilation, sourceFile: string): [string, string]
    {
        const relativeFilePath = path.relative(
            compilation.compiler.context,
            getAssetAbsolutePath(compilation, sourceFile)
        );
        const fileName = path.basename(
            relativeFilePath,
            path.extname(relativeFilePath)
        );

        return [relativeFilePath, fileName];
    }

    export function getContentHash(compilation: Compilation, source): string
    {
        const { compiler, outputOptions } = compilation;
        const { util } = compiler.webpack;
        const { hashDigest, hashDigestLength, hashFunction, hashSalt } = outputOptions;

        const hash = util.createHash(hashFunction);

        if (hashSalt)
            hash.update(hashSalt);

        hash.update(source);

        return hash
            .digest(hashDigest)
            .toString()
            .slice(0, hashDigestLength);
    }

    export function getFileContents(compilation: Compilation, file: Global.ManifestVersionerFile): string
    {
        return readFileSync(
            Utilities.getAssetAbsolutePath(
                compilation,
                file.source
            )
        ).toString();
    }

    export function getOutputFileName(compilation: Compilation, manifestFile: Global.ManifestVersionerFile, fileContents: string): string
    {
        const [relativeFilePath, fileName] = Utilities.getAssetInfo(
            compilation,
            manifestFile.source
        );

        const contentHash = Utilities.getContentHash(
            compilation,
            fileContents
        );

        return compilation.getPath(
            manifestFile.target,
            {
                filename: relativeFilePath,
                contentHash,
                chunk: {
                    hash: contentHash,
                    id: manifestFile.source,
                    name: fileName
                }
            }
        );
    }

    export function joinPaths(...paths: string[]): string
    {
        return path.join(...paths)
            .replace(/\\+|\/\/+/g, '/');
    }

    export function renameAndUpdateAsset(compilation: Compilation, currentName: string, newName: string, contents: sources.Source): void
    {
        compilation.updateAsset(
            currentName,
            contents
        );
        compilation.renameAsset(
            currentName,
            newName
        );
    }
}

export { Utilities };
