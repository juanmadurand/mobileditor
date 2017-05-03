var path = require('path');
var outputPath = path.join(__dirname, "build");

// Plugins
var UglifyJSPlugin = require('uglifyjs-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');


module.exports = {
  entry: {
    'mobileditor.js': ['./app.js'],
    'mobileditor.cobble': ['./assets/cobble.styl'],
  },
  output: {
    path: outputPath,
    filename: '[name]',
    library: 'Quill',
    libraryTarget: 'umd',
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
      test: /\.styl$/,
      include: [
        path.resolve(__dirname, 'assets'),
      ],
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [
          'css-loader',
          {
            loader: 'stylus-loader',
            options: {
              paths: 'node_modules/quill/assets',
            },
          },
        ]
      })
    }, {
      test: /\.svg$/,
      use: [{
        loader: 'html-loader',
        options: {
          minimize: true
        }
      }]
    }, {
      test: /\.js$/,
      use: [{
        loader: 'babel-loader',
        options: {
          presets: ['es2015']
        }
      }],
    }]
  },
  plugins: [
    new UglifyJSPlugin(),
    new ExtractTextPlugin({
      filename: '[name].css',
      allChunks: true,
    }),
    new CopyWebpackPlugin([{from: path.resolve(__dirname, 'examples')}]),
    new OptimizeCssAssetsPlugin({cssProcessorOptions: { discardComments: {removeAll: true } }}),
  ],
  devServer: {
    contentBase: outputPath,
    port: 8080,
    hot: false,
    stats: 'minimal'
  }
}
