import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import banner from 'rollup-plugin-banner';
import { join } from 'path';

const bannerConfig = {
  file: join(__dirname, 'LICENSE.txt'),
};

const external = [
  'crypto',
  'stream',
  'fs',
  'stream',
  'path',
  'util',
];

export default [

  {
    input: 'src/index.js',
    output: {
      file: 'dist/random.cjs.js',
      format: 'cjs',
      exports: 'named',
    },
    plugins: [
      resolve({
        preferBuiltins: true,
      }),
      commonjs({
        include: 'node_modules/**',
        sourceMap: false,
      }),
      banner(bannerConfig),
    ],
    external,
  },

  {
    input: 'src/index.js',
    output: {
      file: 'dist/random.esm.js',
      format: 'esm',
    },
    plugins: [
      resolve({
        preferBuiltins: true,
      }),
      commonjs({
        include: 'node_modules/**',
        sourceMap: false,
      }),
      banner(bannerConfig),
    ],
    external,
  },
  {
    input: 'src/index.js',
    output: {
      file: 'dist/random.esm.min.js',
      format: 'esm',
    },
    plugins: [
      resolve({
        preferBuiltins: true,
      }),
      commonjs({
        include: 'node_modules/**',
        sourceMap: false,
      }),
      terser({
        output: {
          comments: false,
        },
        compress: {
          ecma: 2018,
          keep_classnames: true,
          module: true,
        },
      }),
      banner(bannerConfig),
    ],
    external,
  },

  {
    input: 'src/index.js',
    output: {
      file: 'dist/random.browser.js',
      format: 'umd',
      exports: 'named',
      name: 'Random',
    },
    plugins: [
      resolve({
        preferBuiltins: true,
      }),
      commonjs({
        include: 'node_modules/**',
        sourceMap: false,
      }),
      babel({
        exclude: 'node_modules/**',
        presets: [
          '@babel/env',
        ],
      }),
      terser({ output: {
        comments: false,
      } }),
      banner(bannerConfig),
    ],
    external,
  },
];
