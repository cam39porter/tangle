const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const SRC_DIR = "./src/";

module.exports = {
  entry: {
    background: SRC_DIR + "background.ts",
    content: SRC_DIR + "content.ts"
  },
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "build")
  },
  plugins: [new CopyWebpackPlugin([{ from: "manifest.json" }])]
};
