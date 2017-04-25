var path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: "./app.js",
  output: {
    filename: 'quill.js',
    library: 'Quill',
    libraryTarget: 'umd',
    path: path.join(__dirname, "dist"),
  },
  resolve: {
    alias: {
      'parchment': path.resolve(__dirname, 'node_modules/parchment/src/parchment.ts'),
      'quill$': path.resolve(__dirname, 'node_modules/quill/quill.js'),
    },
    extensions: ['.js', '.ts', '.svg']
  },
  module: {
    rules: [{
      test: /\.js$/,
      use: [{
        loader: 'babel-loader',
        options: {
          presets: ['es2015']
        }
      }],
    }, {
      test: /\.ts$/,
      use: [{
        loader: 'ts-loader',
        options: {
          compilerOptions: {
            declaration: false,
            target: 'es5',
            module: 'commonjs'
          },
          transpileOnly: true
        }
      }]
    }, {
      test: /\.svg$/,
      use: [{
        loader: 'html-loader',
        options: {
          minimize: true
        }
      }]
    }]
  },
  plugins: [
    new UglifyJSPlugin()
  ],
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 8080,
  }
}
