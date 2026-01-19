# Webpack Plugin

The grekt Webpack plugin enables isolation applications built with Webpack to work with grekt.

## Installation

```bash
npm install @grekt/plugin-webpack
```

## Import

```typescript
import { grektPlugin } from '@grekt/plugin-webpack'
```

---

## Isolation Configuration

Configure your Webpack-based isolation application:

```typescript
// webpack.config.js
const { grektPlugin } = require('@grekt/plugin-webpack')

module.exports = {
  // ... your config
  plugins: [
    grektPlugin({
      role: 'isolation',
      namespace: 'my-legacy-app'
    })
  ]
}
```

### Isolation Options

```typescript
interface IsolationRuntimeConfig {
  role: 'isolation'
  namespace: string       // Must match the name in createIsolation()
  publicPath?: string     // Base path for assets
  mode?: 'runtime'        // Only runtime mode supported
}
```

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `role` | `'isolation'` | Yes | Marks this as an isolation bundle |
| `namespace` | `string` | Yes | Unique identifier, must match host config |
| `publicPath` | `string` | No | Base URL for assets |
| `mode` | `'runtime'` | No | Isolation mode |

---

## Vue 2 + Webpack Example

A typical Vue 2 app with Webpack:

```javascript
// webpack.config.js
const { VueLoaderPlugin } = require('vue-loader')
const { grektPlugin } = require('@grekt/plugin-webpack')

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'main.bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    grektPlugin({
      role: 'isolation',
      namespace: 'vue2-app'
    })
  ]
}
```

---

## Rspack Support

grekt also works with Rspack (Rust-based Webpack alternative):

```javascript
// rspack.config.js
const { grektPlugin } = require('@grekt/plugin-webpack')

module.exports = {
  // ... rspack config
  plugins: [
    grektPlugin({
      role: 'isolation',
      namespace: 'rspack-app'
    })
  ]
}
```

---

## Output Configuration

For grekt to work correctly, ensure your bundle output:

1. **Single entry bundle** - Or clearly defined chunks
2. **Accessible URL** - The host must be able to fetch the bundle
3. **CORS enabled** - If serving from a different origin

### Recommended output config

```javascript
output: {
  filename: 'main.bundle.js',
  chunkFilename: '[name].chunk.js',
  publicPath: 'http://localhost:4000/',
  // or for production:
  // publicPath: 'https://cdn.example.com/legacy-app/'
}
```

---

## Dev Server

When running webpack-dev-server:

```javascript
devServer: {
  port: 4000,
  headers: {
    'Access-Control-Allow-Origin': '*'
  },
  hot: true
}
```

The host application will fetch bundles from `http://localhost:4000/main.bundle.js`.
