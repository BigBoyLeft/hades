import path from 'node:path';
import fs from 'node:fs';
import { RESOURCES_FOLDER, getEnabledModules } from './resources.js';
import { sanitizePath, globAsync, writeFile, MODULE_FOLDER } from '../lib/file.js';

/**
 *
 * @param {*} module
 * @return {{ client: Array<string>, server: Array<string>, shared: Array<string> }}
 */
async function getModuleComponents(module) {
    const moduleFolder = sanitizePath(path.join(process.cwd(), MODULE_FOLDER, module));
    const files = await globAsync(path.join(moduleFolder, '@(client|server)/index.ts'));

    return {
        client: !!files.find((file) => file.includes('client/index.ts')),
        server: !!files.find((file) => file.includes('server/index.ts')),
        shared: fs.existsSync(sanitizePath(path.join(moduleFolder, 'shared'))),
    };
}

/**
 * @param {string[]} module
 */
function writeClientImports(modules) {
    if (!modules.length) return;

    const content = '// THIS FILE WAS AUTOMATICALLY GENERATED. DO NOT MODIFY \n\n';
    content += modules.map((module) => `import '../../${module}/client/index.js`).join('\n');

    const importPath = sanitizePath(
        path.join(process.cwd(), RESOURCES_FOLDER, 'framework/modules/imports/client/imports.js'),
    );
    writeFile(importPath, content + '\n');
}

/**
 * @param {string[]} module
 */
function writeServerImports(modules) {
    if (!modules.length) return;

    const content = '// THIS FILE WAS AUTOMATICALLY GENERATED. DO NOT MODIFY \n\n';
    content += `import * as plugins from '../../../server/systems/plugins.js';\n\n`;
    content += modules.map((module) => `import '../../${module}/server/index.js`).join('\n');

    content += `\nplugins.init();\n`

    const importPath = sanitizePath(
        path.join(process.cwd(), RESOURCES_FOLDER, 'framework/modules/imports/server/imports.js'),
    );
    writeFile(importPath, content + '\n');
}

async function compileModules() {
    const modules = getEnabledModules();

    const clientImports = [];
    const serverImports = [];

    for (const module of modules) {
        const components = getModuleComponents(module);

        if (components.client) {
            clientImports.push(module);
        }

        if (components.server) {
            serverImports.push(module);
        }
    }
}

export { compileModules };
