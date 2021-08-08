const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HandlebarsPlugin = require('handlebars-webpack-plugin')

const config = {
  entry: {
    main: [
      path.join(__dirname, 'src', 'js', 'index.js'),
      path.join(__dirname, 'src', 'scss', 'index.scss'),
    ],
    storage_worker: path.join(__dirname, 'src', 'js', 'storage_worker.js'),
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
  plugins: [
    new MiniCssExtractPlugin(),
    new HandlebarsPlugin({
      entry: path.join(__dirname, 'src', 'hbs', 'index.hbs'),
      output: path.join(__dirname, 'index.html'),
      partials: [path.join(__dirname, 'src', 'hbs', 'partials', '*.hbs')],
    }),
  ],
};

module.exports = (env, argv) => {
  if (argv.mode === 'production') {
    config.devtool = 'source-map';
  } else {
    config.devtool = 'eval-source-map';
  }

  return config;
}