import { defineConfig } from 'vite';
import path from 'node:path';
import vue from '@vitejs/plugin-vue';
import { RESOURCES_FOLDER } from '../scripts/compiler/resources';

export default defineConfig({
    plugins: [vue()],
    base: './',
    build: {
        outDir: path.join(process.cwd(), RESOURCES_FOLDER, 'framework', 'ui'),
        emptyOutDir: true,
        minify: 'esbuild',
        reportCompressedSize: false,
    },
    resolve: {
        alias: [
            { find: '@', replacement: path.join(__dirname, './src') },
            { find: '@components', replacement: path.resolve(__dirname, './src/components') },
            { find: '@utils', replacement: path.resolve(__dirname, './src/utils') },
        ],
    },
});
