import path from 'node:path';
import fs from 'node:fs';
import esbuild from 'esbuild';
import plugin from 'esbuild-plugin-fileloc';
import ora from 'ora';
import { RESOURCES_FOLDER, COMPILED_FOLDER, sanitizePath, globSync, copySync } from './utils.js';
import { buildModules } from './modules.js';

const spinner = ora();

const RESOURCE_DISABLERS = ['disabled', 'exclude'];

async function compileServer(resource, dev) {
    const indexPath = sanitizePath(path.join(resource, 'server/index.ts'));
    const targetPath = sanitizePath(path.join(resource.replace(RESOURCES_FOLDER, COMPILED_FOLDER), 'server/index.js'));

    const esbuildOptions = {
        platform: 'node',
        entryPoints: [indexPath],
        outfile: targetPath,
        target: ['esnext'],
        format: 'cjs',
        bundle: true,
        sourcemap: true,
        logLevel: 'warning',
        plugins: [plugin.filelocPlugin()],
    };

    if (dev) {
        const ctx = await esbuild.context(esbuildOptions);
        await ctx.watch();
    } else {
        await esbuild.build(esbuildOptions);
    }
}

async function compileClient(resource, dev) {
    const indexPath = sanitizePath(path.join(resource, 'client/index.ts'));
    const targetPath = sanitizePath(path.join(resource.replace(RESOURCES_FOLDER, COMPILED_FOLDER), 'client/index.js'));

    const esbuildOptions = {
        platform: 'browser',
        entryPoints: [indexPath],
        outfile: targetPath,
        target: ['esnext'],
        format: 'iife',
        bundle: true,
        sourcemap: false,
        logLevel: 'warning',
    };

    if (dev) {
        const ctx = await esbuild.context(esbuildOptions);
        await ctx.watch();
    } else {
        await esbuild.build(esbuildOptions);
    }
}

function isPathDisabled(folderPath) {
    const files = globSync(path.join(folderPath, '*'), { nodir: true });
    const fileNames = files.map((file) => path.basename(file));

    for (const disabler of RESOURCE_DISABLERS) {
        if (fileNames.includes(disabler)) {
            return true;
        }
    }

    return false;
}

async function copyResourceFiles(resource) {
    const files = globSync(path.join(resource, '**/*'), {
        nodir: true,
        ignore: ['**/node_modules/**', '**/framework/modules/**', '**/tsconfig.json', '**/*.ts', '**/*.vue'],
    });

    for (const file of files) {
        const target = file.replace(RESOURCES_FOLDER, COMPILED_FOLDER);
        if (file === target) continue;

        copySync(file, target);
    }
}

async function buildResource(resource, dev) {
    spinner.text = `Building resource ${path.basename(resource)}`;
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
    return globSync(path.join(RESOURCES_FOLDER, '*'), { onlyDirectories: true }).filter((resource) => {
        return !isPathDisabled(resource);
    });
}

async function buildResources(dev) {
    spinner.start('Compiling resources');
    const promises = [];

    if (fs.existsSync(COMPILED_FOLDER)) {
        fs.rmSync(COMPILED_FOLDER, { recursive: true });
    }

    const resources = getResources();

    for (const resource of resources) {
        promises.push(buildResource(resource, dev));
    }

    await Promise.all(promises);

    spinner.succeed('Built resources');
}

export { buildResources, isPathDisabled, getResources };
