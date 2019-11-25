// @ts-check
import { readFileSync } from 'fs';
import commonjs from 'rollup-plugin-commonjs';
import consts from 'rollup-plugin-consts';
import resolve from 'rollup-plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript';

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
    'insights-js': '../lib/insights.js'
};

const worker_url = 'js/db-worker.js';

/** @type {import('rollup').RollupOptions} */
const pageConfig = {
    input: 'src/page/index.ts',
    output: {
        dir: 'public/js/',
        format: 'esm',
        paths,
        sourcemap: true
    },
    external: Object.values(paths),
    plugins: [typescript(), consts({ worker_url }), replace(paths), terser()]
};

/** @type {import('rollup').RollupOptions} */
const workerConfig = {
    input: 'src/db-worker/index.ts',
    output: { file: `public/${worker_url}`, format: 'esm', sourcemap: true },
    plugins: [typescript(), resolve(), commonjs(), terser()]
};

/** @type {import('rollup').RollupOptions} */
const serviceWorkerConfig = {
    input: 'src/service-worker/index.ts',
    output: { file: 'public/sw.js', format: 'esm', sourcemap: true },
    plugins: [typescript(), consts({ hash: commitHash }), terser()]
};

export default [pageConfig, workerConfig, serviceWorkerConfig];
