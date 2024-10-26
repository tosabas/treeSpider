import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';

export default [
	{
		input: './src/core/treeSpider.ts',
		output: [
			{
				name: 'version',
				file: './dist/es/treeSpider.bundle.js',
				format: 'es',
			},
			{
				file: './dist/es/treeSpider.bundle.min.js',
				format: 'es',
				name: 'version',
				plugins: [terser()]
			},
			{
				file: './dist/browser/treeSpider.bundle.js',
				format: 'iife',
				name: 'TreeSpider'
			},
			{
				file: './dist/browser/treeSpider.bundle.min.js',
				format: 'iife',
				name: 'TreeSpider',
				plugins: [terser()]
			},
		],
		plugins: [
			json(),
			resolve(),
			typescript({
			  tsconfig: 'tsconfig.rollup.json',
			}),
		],
		treeshake: {
			moduleSideEffects: false
		}
	}
];