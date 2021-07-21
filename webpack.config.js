const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const config = {
  entry: {
    main: [
      path.resolve(__dirname, "src", "js", "index.js"),
      path.resolve(__dirname, "src", "scss", "index.scss"),
    ],
    worker: path.resolve(__dirname, "src", "js", "worker.js"),
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
  },
  devServer: {
    publicPath: '/dist/',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.s?[ac]ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { url: false }
          },
          'sass-loader',
        ]
      }
    ],
  },
  plugins: [new MiniCssExtractPlugin()],
};

module.exports = (env, argv) => {
  if (argv.mode === 'production') {
    config.devtool = 'source-map';
  } else {
    config.devtool = 'eval-source-map';
  }

  return config;
}