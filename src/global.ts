namespace Global
{
    export type AssetList = { [key: string]: string };
    export interface ManifestVersionerFile
    {
        source: string;
        target?: string;
    }
    export interface ManifestVersionerOptions
    {
        defaultTarget?: string;
        files: ManifestVersionerFile[];
    }

    export const options: Partial<ManifestVersionerOptions> = {};
    export const pluginName: string = 'ManifestVersionerOptions';
}

export { Global };
