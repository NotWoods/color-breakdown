// @ts-check
import { readFileSync } from 'fs';
import typescript from 'rollup-plugin-typescript';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import { terser } from 'rollup-plugin-terser';

const commitHash = () => {
    try {
        return readFileSync('.commithash', 'utf-8').trim();
    } catch (_) {
        return 'unknown';
    }
};

/** @type {import('rollup').OptionsPaths} */
const paths = {
    'node-vibrant': '../lib/node-vibrant/vibrant.js',
};

/** @type {import('rollup').RollupOptions} */
const pageConfig = {
    input: 'src/page/index.ts',
    output: {
        dir: 'public/js/',
        format: 'esm',
        paths,
        sourcemap: true,
    },
    plugins: [typescript(), replace(paths), terser()],
};

/** @type {import('rollup').RollupOptions} */
const workerConfig = {
    input: 'src/db-worker/index.ts',
    output: { file: 'public/js/db-worker.js', format: 'esm', sourcemap: true },
    plugins: [typescript(), resolve(), commonjs(), terser()],
};

/** @type {import('rollup').RollupOptions} */
const serviceWorkerConfig = {
    input: 'src/service-worker/index.ts',
    output: { file: 'public/sw.js', format: 'esm', sourcemap: true },
    plugins: [typescript(), replace({ HASH: commitHash }), terser()],
};

export default [pageConfig, workerConfig, serviceWorkerConfig];
