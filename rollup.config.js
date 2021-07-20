import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import {terser} from 'rollup-plugin-terser'
import babel from "@rollup/plugin-babel";

export default [{
  input: 'src/community.ts',
  output: {
    file: process.env.MINIFY? 'lib/community.min.js' : 'lib/community.js',
    format: 'umd',
    name: 'Community',
    esModule: false,
    exports: 'named',
    sourcemap: true
  },
  plugins: process.env.MINIFY? [
    typescript({lib: ["es5", "es6", "dom"], target: "esnext"}), 
    resolve(), 
    babel({
      babelHelpers: 'bundled'
    }),
    terser()
  ] 
  : [
    typescript(), 
    resolve(),
    babel({
      babelHelpers: 'bundled'
    }),
  ]
},
{
  input: 'src/community.ts',
  plugins: [typescript(), resolve()],
  output: [{
    file: 'lib/index.es.js',
    format: 'esm',
    exports: 'named',
    sourcemap: true,
  }, {
    file: 'lib/index.cjs.js',
    format: 'cjs',
    exports: 'named',
    sourcemap: true
  }]
}];