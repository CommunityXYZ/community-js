const { build } = require('esbuild');
const rimraf = require('rimraf');

const clean = async () => {
  return new Promise(resolve => {
    rimraf('./dist', () => resolve());
  });
}

const runBuild = async (doClean = false) => {
  // Do not clean each time on watch, only on build or first run.
  if(doClean) await clean();
 
  // Build to browser js
  build({
    entryPoints: ['./browser.ts'],
    minify: false,
    bundle: true,
    platform: 'browser',
    target: ['es2020','chrome58','firefox57','safari11','edge16'],
    outfile: './dist/community.js',
    sourcemap: 'inline'
  }).catch((e) => {
    console.log(e);
    process.exit(1)
  });

  // Minified version
  build({
    entryPoints: ['./browser.ts'],
    minify: true,
    bundle: true,
    platform: 'browser',
    target: ['es2020','chrome58','firefox57','safari11','edge16'],
    outfile: './dist/community.min.js',
    sourcemap: 'inline'
  }).catch((e) => {
    console.log(e);
    process.exit(1)
  });
};
runBuild(true);

module.exports = runBuild;