const path                 = require('path');
const HtmlWebpackPlugin    = require('html-webpack-plugin');
const CleanWebpackPlugin   = require('clean-webpack-plugin');
const CopyWebpackPlugin    = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const getFilePaths         = require('./get-file-paths');

// TODO: extract prod logic
const isProd = process.env.NODE_ENV === 'production';

const hbsRegex = /\.(handlebars|hbs)$/;

module.exports = {
  mode: isProd ? 'production' : 'development',
  devtool: isProd ? false : 'inline-source-map',
  entry: {
    // Global JS and CSS
    // Prefixed by "_" to avoid accidental name
    // collisions with generated page files
    _global: path.resolve(__dirname, 'src', 'global.js'),

    // Pages' JS and CSS
    ...getFilePaths(
      path.resolve(__dirname, 'src', 'pages'),
      /\.js$/
    ).reduce((accumulator, {fileName, filePath}) => {
      // Rename home.scss and home.js to index.css and index.js
      // respectively. See the explanation below
      accumulator[fileName === 'home' ? 'index' : fileName] = filePath;

      return accumulator;
    }, {})
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, 'static'),
      to: path.resolve(__dirname, 'dist', 'static')
    }]),
    new MiniCssExtractPlugin(),
    ...getFilePaths(
      path.resolve(__dirname, 'src', 'pages'),
      hbsRegex
    ).map(({fileName, filePath}) => {
      return new HtmlWebpackPlugin({
        inject: false,
        hash: true,
        template: filePath,
        // In order to have `home` page accessible as a root page,
        // rename home.hbs -> index.html. The same is done for
        // the css and javascript files to keep everything consistent
        filename: `${fileName === 'home' ? 'index' : fileName}.html`,
      });
    }),
  ],
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      // Handlebars
      {
        test: hbsRegex,
        use: {
          loader: 'handlebars-loader',
          options: {
            // Notice: inline requires, like in html-loader, aren't currently
            // supported well: https://github.com/pcardune/handlebars-loader/issues/37,
            // so something like <img src="./some-img.png"/> won't work
            helperDirs: [
              path.resolve(__dirname, 'helpers')
            ],
            partialDirs: [
              path.resolve(__dirname, 'src', 'partials')
            ]
          }
        }
      },
      // Javascript
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-transform-runtime']
          }
        }
      },
      // CSS / SCSS
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: !isProd,
            },
          },
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              // required, when {Function}/require is used (Complex Options)
              // see: https://github.com/postcss/postcss-loader#plugins
              ident: 'postcss',
              autoprefixer: {
                browsers: ['last 2 versions']
              },
              plugins: (loader) => isProd ? [
                require('postcss-import')({root: loader.resourcePath}),
                require('postcss-preset-env')(),
                isProd ? require('cssnano')() : null
              ] : [
                require('postcss-import')({root: loader.resourcePath}),
                require('postcss-preset-env')(),
              ]
            }
          },
          'sass-loader',
        ]
      },
      // Images
      {
        test: /\.(gif|png|jpe?g|svg)$/,
        use: [
          'file-loader',
          {
            loader: 'url-loader',
            options: {
              limit: 8192
            }
          },
          'image-webpack-loader'
        ]
      },
      // Fonts
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader'
        ]
      }
    ]
  }
};
