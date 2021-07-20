import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/community.ts',
  output: {
    dir: 'lib',
    format: 'umd',
    name: 'community'
  },
  plugins: [typescript({lib: ["es5", "es6", "dom"], target: "es5"})]
};