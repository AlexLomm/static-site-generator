const path                 = require('path');
const HtmlWebpackPlugin    = require('html-webpack-plugin');
const CleanWebpackPlugin   = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer         = require('autoprefixer');
const getFilePaths         = require('./get-file-paths');

const hbsRegex = /\.(handlebars|hbs)$/;

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: {
    // Global JS and CSS
    _global: path.resolve(__dirname, 'src', 'global.js'),

    // Pages' JS and CSS
    ...getFilePaths(
      path.resolve(__dirname, 'src', 'views', 'pages'),
      /\.js$/
    ).reduce((accumulator, {fileName, filePath}) => {
      accumulator[fileName === 'home' ? 'index' : fileName] = filePath;

      return accumulator;
    }, {})
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin(),
    ...getFilePaths(
      path.resolve(__dirname, 'src', 'views', 'pages'),
      hbsRegex
    ).map(({fileName, filePath}) => {
      return new HtmlWebpackPlugin({
        inject: false,
        hash: true,
        template: filePath,
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
            helperDirs: [
              path.resolve(__dirname, 'helpers')
            ],
            partialDirs: [
              path.resolve(__dirname, 'src', 'views', 'partials')
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
        test: /\.(scss|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              autoprefixer: {
                browsers: ['last 2 versions']
              },
              plugins: () => [autoprefixer]
            }
          },
          'sass-loader',
        ]
      },
      // Images
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              disable: true,
            },
          },
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
