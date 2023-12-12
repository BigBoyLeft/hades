import path from 'node:path';
import fs from 'node:fs';
import { sanitizePath, globSync, writeFile, copySync } from '../lib/file.js';
import { compileModules } from './modules.js';
import esbuild from 'esbuild';

let failedResources = [];
let disablers = ['disabled'];

const RESOURCES_FOLDER = 'resources/[compiled]';
const MODULE_FOLDER = 'src/framework/modules';

/**
 * @return string[]
 */
function getResources() {
    const pattern = path.join(process.cwd(), 'src', '*');
    return globSync(pattern);
}

/**
 * @return string[]
 */
function getFilesToCopy() {
    const pattern = sanitizePath(path.join(process.cwd(), 'src', '**/*.!(ts|vue)'));
    return globSync(pattern, {
        nodir: true,
        ignore: ['**/node_modules/**', '**/framework/modules/**'],
    });
}

async function compileClient(resource) {
    const indexPath = sanitizePath(path.join(resource, 'client/index.ts'));
    const targetPath = sanitizePath(path.join(resource.replace('src', RESOURCES_FOLDER), 'client/index.js'));

    const ctx = await esbuild.context({
        platform: 'browser',
        entryPoints: [indexPath],
        outfile: targetPath,
        target: ['es2020'],
        format: 'iife',
        bundle: true,
        minify: true,
        sourcemap: false,
        metafile: true,
        logLevel: 'info',
    });
    // const analize = await esbuild.analyzeMetafile(ctx.metafile, {
    //     color: true,
    // });

    // console.log(analize);
    if (process.env.ENVIRONMENT === 'dev') ctx.watch();
}

async function compileServer(resource) {
    const indexPath = sanitizePath(path.join(resource, 'server/index.ts'));
    const targetPath = sanitizePath(path.join(resource.replace('src', RESOURCES_FOLDER), 'server/index.js'));

    const ctx = await esbuild.context({
        platform: 'node',
        entryPoints: [indexPath],
        outfile: targetPath,
        target: ['es2020'],
        format: 'cjs',
        bundle: true,
        minify: true,
        sourcemap: false,
        metafile: true,
        logLevel: 'info',
    });
    // const analize = await esbuild.analyzeMetafile(ctx.metafile, {
    //     color: true,
    // });

    // console.log(analize);
    if (process.env.ENVIRONMENT === 'dev') ctx.watch();
}

async function compileResource(resource) {
    const hasServer = fs.existsSync(sanitizePath(path.join(resource, 'server')));
    const hasClient = fs.existsSync(sanitizePath(path.join(resource, 'client')));
    const hasModules = fs.existsSync(sanitizePath(path.join(resource, 'modules')));

    const promises = [
        ...(hasModules ? [await compileModules(resource)] : []),
        ...(hasClient ? [await compileServer(resource)] : []),
        ...(hasServer ? [await compileClient(resource)] : []),
    ];

    await Promise.all(promises);
}

async function compileResources() {
    failedResources = [];
    const resources = getResources();
    const filesToCopy = getFilesToCopy();
    const resourceFolder = sanitizePath(path.join(process.cwd(), RESOURCES_FOLDER));

    if (!fs.existsSync(resourceFolder)) {
        fs.mkdirSync(resourceFolder, { recursive: true });
    }

    const filesAndDirectories = fs.readdirSync(resourceFolder);
    for (const fileOrDirectory of filesAndDirectories) {
        const fullPath = sanitizePath(path.join(resourceFolder, fileOrDirectory));

        if (fs.statSync(fullPath).isDirectory()) {
            fs.rmSync(fullPath, { recursive: true, force: true });
        }
    }

    for (const file of filesToCopy) {
        const target = file.replace('src', RESOURCES_FOLDER);
        if (file === target) continue;

        copySync(file, target);
    }

    const promises = resources.map((resource) => compileResource(resource));
    await Promise.all(promises);

    if (failedResources.length >= 1) {
        for (let failedResource of failedResources) {
            console.error(`Failed to compile resource: ${failedResource}`);
        }

        console.error(`Failed to compile ${failedResources.length} resources.`);
        process.exit(1);
    }
}

export { compileResources };
