import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import {terser} from 'rollup-plugin-terser'

export default {
  input: 'src/community.ts',
  output: {
    file: process.env.MINIFY? 'lib/community.min.js' : 'lib/community.js',
    format: 'umd',
    name: 'Community'
  },
  plugins: process.env.MINIFY? [typescript({lib: ["es5", "es6", "dom"], target: "esnext"}), resolve(), terser()] : [typescript({lib: ["es5", "es6", "dom"], target: "esnext"}), resolve()]
};