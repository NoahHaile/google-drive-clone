const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
    mode: 'development',
    entry: {
        index: './src/index.js',
      },
      devtool: 'inline-source-map',
      devServer: {
        port: 3030,
        static: './dist',
        historyApiFallback: true,
      },
      plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'src/index.html',
            chunks: ['index']
        }),
      ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },

  module: {
    rules: [
        {
            test: /\.(js|jsx)$/, // .js and .jsx files
            exclude: /node_modules/, // excluding the node_modules folder
            use: {
              loader: "babel-loader",
            },
        },
        {
            test: /\.(sa|sc|c)ss$/, // styles files
            use: ["style-loader", "css-loader", "sass-loader"],
        },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(csv|tsv)$/i,
        use: ['csv-loader'],
      },
      {
        test: /\.xml$/i,
        use: ['xml-loader'],
      },
    ],
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
        chunks: 'all',
      },
  },
};