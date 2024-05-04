import path from 'node:path';
import { ChildProcess, spawn } from 'node:child_process';
import { sanitizePath, globSync, writeFile, RESOURCES_FOLDER, copyAsync } from './utils.js';
import { getResources } from './resources.js';
import { getModules } from './modules.js';
import ora from 'ora';

const spinner = ora();

const UI_IMPORTS_FOLDER = sanitizePath(path.join(process.cwd(), 'src-ui', 'src', 'imports'));

/**
 * @type {ChildProcess} */
export let viteProcess;

function getUIFiles(search_path) {
    const files = {};
    const resources = getResources();

    for (const resource of resources) {
        const modules = getModules(resource);

        for (const module of modules) {
            const uiFiles = globSync(path.join(module, search_path));

            for (const file of uiFiles) {
                const name = path.basename(file, '.vue');

                files[name] = sanitizePath(file);
            }
        }
    }

    return files;
}

async function bundleUIPlugins() {
    spinner.text = 'Bundling UI plugins...';
    const files = getUIFiles('ui/plugins/*.ts');

    let content = `// @ts-nocheck\n`;
    content += `// THIS FILE IS AUTO GENERATED. DO NOT EDIT\n\n`;

    content += Object.keys(files)
        .map((name) => `import ${name} from '${files[name]}'`)
        .join('\n');
    content +=
        `\n\nexport const VUE_PLUGIN_IMPORTS = [\n` +
        Object.keys(files)
            .map((name) => `${name}`)
            .join(',\n') +
        `\n]\n`;

    const filePath = path.join(UI_IMPORTS_FOLDER, 'plugins.ts');
    writeFile(filePath, content);
}

async function bundleUIModules() {
    spinner.text = 'Bundling UI modules...';
    const files = getUIFiles('ui/*.vue');

    let content = `// @ts-nocheck\n`;
    content += `// THIS FILE IS AUTO GENERATED. DO NOT EDIT\n\n`;
    content += `import { shallowRef } from 'vue'\n\n`;

    content += Object.keys(files)
        .map((name) => `import ${name} from '${files[name]}'`)
        .join('\n');
    content +=
        `\n\nexport const VUE_IMPORTS = {\n` +
        Object.keys(files)
            .map((name) => `${name}: shallowRef(${name})`)
            .join(',\n') +
        `\n}\n`;

    const filePath = path.join(UI_IMPORTS_FOLDER, 'imports.ts');
    writeFile(filePath, content);
}

async function bundleUI() {
    return new Promise(async (resolve, reject) => {
        await bundleUIModules();
        await bundleUIPlugins();

        spinner.text = 'Building UI';

        const vite = spawn('npx.cmd', ['vite', 'build', './src-ui'], {
            stdio: 'pipe',
        });

        vite.once('close', (code) => {
            resolve();
        });

        vite.on('error', (error) => {
            reject(error);
        });
    });
}

async function createDevServer() {
    return new Promise(async (resolve, reject) => {
        await bundleUIModules();
        await bundleUIPlugins();

        spinner.text = 'Starting vite server';

        viteProcess = spawn('npx.cmd', ['vite', './src-ui', '--clearScreen=false', '--host=localhost', '--port=3000'], {
            stdio: 'pipe',
        });

        viteProcess.stdout.on('data', (data) => {
            if (data.toString().includes('ready')) {
                spinner.succeed('Started vite server');
                console.log(data.toString());
                setTimeout(resolve, 1000);
            } else console.log(data.toString());
        });

        viteProcess.once('close', (code) => {
            console.log(`vite exited with code ${code}`);
        });

        viteProcess.on('error', (error) => {
            reject(error);
        });
    });
}

async function buildDevServerConnector() {
    spinner.text = 'Building dev server connector';
    const src = sanitizePath(path.join(process.cwd(), 'src-ui', 'dev', 'index.html'));
    const dest = sanitizePath(path.join(RESOURCES_FOLDER, 'framework', 'ui', 'index.html'));
    await copyAsync(src, dest);
}

async function buildUI(dev) {
    spinner.start('Bundling UI components');
    try {
        await bundleUIModules();
        await bundleUIPlugins();

        if (dev) {
            await createDevServer();
            await buildDevServerConnector();
        } else {
            await bundleUI();
        }
    } catch (error) {
        spinner.fail('Failed to build UI');
        throw error;
    }

    spinner.succeed('Built UI');
}

export { buildUI, bundleUIModules, bundleUIPlugins };
