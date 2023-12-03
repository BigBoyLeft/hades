import { createExecTime } from '../lib/index.js';
import { compileResources } from '../compiler/resources.js';
import { compileModules } from '../compiler/modules.js';
import { compileUI, createViteServer } from '../compiler/ui.js';

async function BundleResources(dev) {
    const timer = createExecTime('>>> Built Server');

    const operations = [
        compileResources(),
        compileModules(),
        ...(dev ? [createViteServer(), watchResources()] : [compileUI()]),
    ];

    await Promise.all(operations);
    timer.stop();
}

async function watchResources() {}

async function Doctor() {}

export { BundleResources, Doctor };
