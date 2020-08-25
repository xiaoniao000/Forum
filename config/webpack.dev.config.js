/**
 * module dependencies for webpack dev configuration
 */
const path = require("path");
const webpack = require("webpack");

// define paths
const nodeModulesPath = path.resolve(__dirname, "../node_modules");
const buildPath = path.resolve(__dirname, "../public", "build");
const mainAppPath = path.resolve(__dirname, "../frontend", "App", "index.js");
const sharedStylesPath = path.resolve(__dirname, "../frontend", "SharedStyles");
const componentsPath = path.resolve(__dirname, "../frontend", "Components");
const containersPath = path.resolve(__dirname, "../frontend", "Containers");
const viewsPath = path.resolve(__dirname, "../frontend", "Views");

/**
 * webpack development configuration
 */
module.exports = {
  target: "web",
  devtool: "source-map",

  entry: ["webpack-hot-middleware/client", mainAppPath], //热重载

  output: {
    filename: "bundle.js",
    path: buildPath,
    publicPath: "/build/", //改了这里就能看就修改了，哇什么鬼！！！
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ["react-hot", "babel-loader"],
        exclude: [nodeModulesPath],
      },
      {
        test: /\.css$/,
        loaders: [
          "style-loader",
          "css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]",
          "postcss-loader?sourceMap=inline",
        ],
      },
      { test: /\.(png|jpg)$/, loader: "url-loader?limit=8192" },
      {
        test: /\.svg$/,
        loader: "url-loader?limit=10000&mimetype=image/svg+xml",
      },
    ],
  },

  postcss: [require("autoprefixer"), require("postcss-nesting")],

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
  ],

  resolve: {
    extensions: ["", ".js", ".css"], //自动在import A from "./A"后面加js或css
    alias: {
      SharedStyles: sharedStylesPath,
      Components: componentsPath,
      Containers: containersPath,
      Views: viewsPath,
    },
  },
};
