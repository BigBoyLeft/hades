import { defineConfig } from 'vite';
import path from 'node:path';
import vue from '@vitejs/plugin-vue';
import { RESOURCES_FOLDER } from '../compiler/utils';

export default defineConfig({
    plugins: [vue()],
    base: '/ui',
    build: {
        outDir: path.join(RESOURCES_FOLDER, 'framework', 'ui'),
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
