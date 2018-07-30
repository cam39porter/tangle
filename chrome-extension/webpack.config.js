const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const SRC_DIR = "./src/";

module.exports = {
  entry: {
    background: SRC_DIR + "background.ts",
    content: SRC_DIR + "content.tsx",
    vendor: ["react", "react-dom"]
  },
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
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
