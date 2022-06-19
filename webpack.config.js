const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  devtool: "inline-source-map",
  devServer: {
    static: {
      directory: path.resolve(__dirname, "dist"),
    },

    // Dev server client for web socket transport, hot and live reload logic
    hot: true,
    client: false,
    port: 3000,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Three JS",
      filename: "index.html",
      template: "./src/index.html",
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],

  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },

  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
