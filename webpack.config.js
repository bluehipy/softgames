var path = require("path");
var webpack = require("webpack");

const CopyWebpackPlugin = require("copy-webpack-plugin");
module.exports = {
  entry: "./index.js",
  output: {
    path: path.resolve(__dirname, "docs"),
    filename: "index.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: path.join(__dirname, "node_modules"),
        loader: "babel-loader"
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: "assets/",
        to: "./assets",
        toType: "dir"
      },
      {
        from: "index.html",
        to: "index.html"
      }
    ])
  ],
  stats: {
    colors: true
  },
  devtool: "source-map"
};
