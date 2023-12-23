import path from 'node:path';
import fs from 'node:fs';
import { RESOURCES_FOLDER, sanitizePath, writeFile, globSync } from './utils.js';
import { isPathDisabled } from './resources.js';

async function writeClientImports(resource, modules) {
    if (!modules.length) return '';

    let content = `// THIS FILE IS AUTO GENERATED. DO NOT EDIT\n\n`;

    content += modules.map((module) => `import '${module}/client/index'`).join('\n');

    const importPath = sanitizePath(path.join(resource, 'client', 'imports.ts'));
    writeFile(importPath, content);
}

async function writeServerImports(resource, modules) {
    if (!modules.length) return '';

    let content = `// THIS FILE IS AUTO GENERATED. DO NOT EDIT\n\n`;
    content += "import { init } from 'framework/server/systems/modules'\n\n";

    content += modules.map((module) => `import '${module}/server/index'`).join('\n');

    content += `\ninit();\n`;

    const importPath = sanitizePath(path.join(resource, 'server', 'imports.ts'));
    writeFile(importPath, content);
}

function getModules(resource) {
    return globSync(sanitizePath(path.join(resource, 'modules', '*'))).filter((module) => {
        return !isPathDisabled(module);
    });
}

async function buildModules(resource, dev) {
    const modules = getModules(resource);

    await writeServerImports(resource, modules);
    await writeClientImports(resource, modules);

    return;
}

export { buildModules, getModules };
