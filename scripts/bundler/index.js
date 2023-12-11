import { createExecTime } from '../lib/index.js';
import { compileModules } from '../compiler/modules.js';
import { compileUI, createViteServer } from '../compiler/ui.js';
import { configure } from './config.js';

async function BundleServer(dev) {
    const timer = createExecTime('>>> Built Server');

    const operations = [compileModules(), configure(dev), ...(dev ? [createViteServer(), WatchServer()] : [compileUI()])];

    await Promise.all(operations);
    timer.stop();
}

async function WatchServer() {
    console.log('>>> Watching Resources');
}

async function Doctor() {}

export { BundleServer, Doctor };
