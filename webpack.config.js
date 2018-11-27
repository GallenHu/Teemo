const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  devServer: {
    contentBase: './dist',
    compress: true,
    port: 8000
  },
  devtool: 'source-map',
  output: {
    filename: '[name].[hash:8].js'
  },
  module: {
    rules: [
      {
　　　　　　test: /\.(png|jpg|gif)$/,
　　　　　　loader: 'url-loader?limit=8192&name=img/[name].[hash:8].[ext]'
　　　　},
      {
        test: /\.css$/,
        include: path.join(__dirname,'./src'),
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader' },
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                require("postcss-cssnext")(),
                require('postcss-nested')()
              ]
            }
          },
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: { loader: 'babel-loader' }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: { minimize: true }
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin('./dist'), // clean dist path
    new HtmlWebPackPlugin({
      template: './index.html', // src file path
      filename: './index.html' // in dist path
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[chunkhash:8].css',
      chunkFilename: '[id].css'
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
};
