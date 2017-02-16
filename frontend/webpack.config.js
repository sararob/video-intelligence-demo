const resolveRules = {extensions: ['', '.js']};
const moduleRules = {
  loaders: [
  { test: /\.js?/, exclude: /node_modules/, loaders: ['babel-loader'] }
  ]
};

exports.site = {
  debug: true,
  devtool: '#eval-source-map',
  output: {filename: 'compiled.js'},
  module: moduleRules,
  resolve: resolveRules
};