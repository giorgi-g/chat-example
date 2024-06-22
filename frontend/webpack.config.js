const path = require('path');

module.exports = {
  entry: './src/index.js',
  mode: "development",
  watch: true,
  watchOptions: {
    poll: 500,
    aggregateTimeout: 200,
    ignored: ['**/files/**/*.js', '**/node_modules', 'dist/build.js'],
  },
  output: {
    filename: 'build.js',
    path: path.resolve(__dirname, 'dist'),
  },
}
