const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  // Path to your entry point. From this file Webpack will begin his work
  entry: './src/js/index.js',

  // Path and filename of your result bundle.
  // Webpack will bundle all JavaScript into this file
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.[hash].js'
    // publicPath: './', // 引用的路径或者 CDN 地址。
    // 加上publicPath会导致dev-server不可用？！
  },

  devtool: 'source-map',

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [
          /(node_modules)/,
          path.resolve(__dirname, 'src/js/template.js')
        ],
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.less$/,
        exclude: /(node_modules)/,
        use: [
          // {
          //   loader: "style-loader",
          //   options: {
          //     insert: "head", // insert style tag inside of <head>
          //     injectType: "singletonStyleTag" // this is for wrap all your style in just one style tag
          //   }
          // },
          {
            /** webpack loader used always at the end of loaders list */
            loader: MiniCssExtractPlugin.loader
          },
          {
            // resolves url() and @imports inside CSS
            loader: 'css-loader'
          },
          {
            loader: 'postcss-loader'
          },
          {
            loader: 'less-loader'
          }
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        exclude: /(node_modules)/,
        use: [{ loader: 'url-loader', options: { limit: 8192 } }]
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: '海风导航',
      template: './index.html'
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
      chunkFilename: '[id].css'
    })
    // new CopyWebpackPlugin([
    //   // {from:'src/images',to:'images'}
    // ]),
  ],

  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 8080
  },

  // Default mode for Webpack is production.
  // Depending on mode Webpack will apply different things
  // on final bundle. For now we don't need production's JavaScript
  // minifying and other thing so let's set mode to development
  mode: 'development'
};
