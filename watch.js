const watch = require('node-watch');
const runBuild = require('./build');

watch('./src', {recursive: true}, () => {
  runBuild();
});