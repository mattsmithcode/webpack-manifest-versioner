<div align="center">
  <a href="https://github.com/webpack/webpack">
    <img alt="Webpack logo" width="200" height="200" src="https://webpack.js.org/assets/icon-square-big.svg" />
  </a>
</div>

# webpack-manifest-versioner

Replace file names in specified files with versioned names

## Installing

Install `webpack-manifest-versioner` using `npm` or `yarn`:

```console
npm install webpack-manifest-versioner --save-dev
```

or

```console
yarn add -D webpack-manifest-versioner
```

Add the plugin to your `webpack` config file, for example:

**webpack.config.js**

```js
const ManifestVersionerPlugin = require('webpack-manifest-versioner');

module.exports = {
  plugins: [
    new ManifestVersionerPlugin({
      files: [
        {
          source: './src/site.webmanifest',
          target: 'dest/[name].[contenthash:8][ext]'
        }
      ]
    })
  ]
};
```

## Options

- **[`files`](#files)**
- **[`defaultTarget`](#defaulttarget)**

### `files`

Type: `array`

```js
files: [
  {
    source: './src/site.webmanifest',
    target: 'dest/[name].[contenthash:8][ext]'
  }
]
```

- [`source`](#source)
- [`target`](#target)

#### `source`

Type: `string`

The source file to read from.

#### `target`

Type: `string`

*Optional* (required if [`defaultTarget`](#defaulttarget) is not provided)

The destination for the output file relative to the `webpack` output directory. Supports `webpack` substitutions.

### `defaultTarget`

Type: `string`

*Optional*

```js
defaultTarget: 'dest/[name].[contenthash:8][ext]'
```

The target pattern to use for any `files` without a `target` set.

## Example

**webpack.config.js**

```js
const ManifestVersionerPlugin = require('webpack-manifest-versioner');

module.exports = {
  entry: {
    // Your entry points
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].[hash].js',
  },
  plugins: [
    new ManifestVersionerPlugin({
      files: [
        { source: './src/site.webmanifest' },
        { source: '/src/browserconfig.xml' }
      ],
      defaultTarget: 'dest/[name].[contenthash:8][ext]'
    })
  ]
};
```

**site.webmanifest**

```json
{
  "name": "Sample site",
  "icons": [
    {
      "src": "build/icons/android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "build/icons/android-chrome-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

**browserconfig.xml**

```xml
<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
  <msapplication>
    <tile>
      <square150x150logo src="build/icons/mstile-150x150.png"/>
    </tile>
  </msapplication>
</browserconfig>
```

## Sample output

**site.5f33ce81.sitemanifest**

```json
{
  "name": "Sample site",
  "icons": [
    {
      "src": "/build/icons/android-chrome-192x192.3be48ecd.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/build/icons/android-chrome-512x512.aa63e8d0.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

**browserconfig.4f7ed21b.xml**
```xml
<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
  <msapplication>
    <tile>
      <square150x150logo src="build/icons/mstile-150x150.f37b040c.png"/>
    </tile>
  </msapplication>
</browserconfig>
```

## Licence

[ISC](https://github.com/mattsmithcode/webpack-manifest-versioner/blob/main/LICENCE)
