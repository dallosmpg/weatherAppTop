const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  devtool: 'eval-source-map',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
 module: {
   rules: [
     {
       test: /\.css$/i, 
       use: ['style-loader', 'css-loader'],
     },
     {
      test: /\.m?js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
      } 
    }
   ],
 }
}