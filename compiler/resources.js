import path from 'node:path';
import fs from 'node:fs';
import esbuild from 'esbuild';
import plugin from 'esbuild-plugin-fileloc';

import { RESOURCES_FOLDER, sanitizePath, globAsync, globSync, copySync } from './utils.js';
import { buildModules } from './modules.js';

const RESOURCE_DISABLERS = ['disabled', 'exclude'];

/**
 * Compiles the client resource asynchronously.
 *
 * @param {type} resource - The resource to be compiled.
 * @param {boolean} dev - Flag indicating if the resource should be built in development mode.
 * @return {type} The compiled client resource.
 */
async function compileServer(resource, dev) {
    const indexPath = sanitizePath(path.join(resource, 'server/index.ts'));
    const targetPath = sanitizePath(path.join(resource.replace('src', 'resources/[compiled]'), 'server/index.js'));

    const esbuildOptions = {
        platform: 'node',
        entryPoints: [indexPath],
        outfile: targetPath,
        target: ['esnext'],
        format: 'cjs',
        bundle: true,
        minify: true,
        sourcemap: false,
        logLevel: 'info',
        plugins: [plugin.filelocPlugin()],
    };

    if (dev) {
        const ctx = await esbuild.context(esbuildOptions);
        await ctx.watch();
    } else {
        const result = await esbuild.build(esbuildOptions);
        console.log(await esbuild.analyzeMetafile(result));
    }
}

/**
 * Compiles the client resource asynchronously.
 *
 * @param {type} resource - The resource to be compiled.
 * @param {boolean} dev - Flag indicating if the resource should be built in development mode.
 * @return {type} The compiled client resource.
 */
async function compileClient(resource, dev) {
    const indexPath = sanitizePath(path.join(resource, 'client/index.ts'));
    const targetPath = sanitizePath(path.join(resource.replace('src', 'resources/[compiled]'), 'client/index.js'));

    const esbuildOptions = {
        platform: 'browser',
        entryPoints: [indexPath],
        outfile: targetPath,
        target: ['esnext'],
        format: 'iife',
        bundle: true,
        minify: true,
        sourcemap: false,
        logLevel: 'info',
    };

    if (dev) {
        const ctx = await esbuild.context(esbuildOptions);
        await ctx.watch();
    } else {
        const result = await esbuild.build(esbuildOptions);
        console.log(await esbuild.analyzeMetafile(result));
    }
}

async function isResourceDisabled(resource) {
    // check if the resource has a file named one of the disablers in the root folder
    const files = await globAsync(path.join(resource, '*'));
    const fileNames = files.map((file) => path.basename(file));

    for (const disabler of RESOURCE_DISABLERS) {
        if (fileNames.includes(disabler)) {
            return true;
        }
    }

    return false;
}

async function copyResourceFiles(resource) {
    const files = globSync(sanitizePath(path.join(resource, '**/*.!(ts|vue)')), {
        nodir: true,
        ignore: ['**/node_modules/**', '**/framework/modules/**', '**/tsconfig.json'],
    });

    for (const file of files) {
        const target = file.replace('src', 'resources/[compiled]');
        if (file === target) continue;

        copySync(file, target);
    }
}

/**
 * Builds a resource asynchronously.
 *
 * @param {any} resource - The path to the resource.
 * @param {boolean} dev - Flag indicating if the resource should be built in development mode.
 * @return {Promise} A promise that resolves when the resource is built.
 */
async function buildResource(resource, dev) {
    const isDisabled = await isResourceDisabled(resource);
    if (isDisabled) return;

    const hasServer = fs.existsSync(sanitizePath(path.join(resource, 'server')));
    const hasClient = fs.existsSync(sanitizePath(path.join(resource, 'client')));
    const hasModules = fs.existsSync(sanitizePath(path.join(resource, 'modules')));

    const promises = [
        await copyResourceFiles(resource),
        ...(hasModules ? [await buildModules(resource, dev)] : []),
        ...(hasServer ? [await compileServer(resource, dev)] : []),
        ...(hasClient ? [await compileClient(resource, dev)] : []),
    ];

    return await Promise.all(promises);
}

function getResources() {
    return globSync(path.join(RESOURCES_FOLDER, '*'), { onlyDirectories: true });
}

/**
 * Builds the resources asynchronously.
 *
 * @param {boolean} dev - Flag indicating if in development mode.
 * @return {Promise<void>} - A promise that resolves when the resources are built.
 */
async function buildResources(dev) {
    const promises = [];

    const resources = getResources();

    for (const resource of resources) {
        promises.push(buildResource(resource, dev));
    }

    await Promise.all(promises);
}

export { buildResources };
