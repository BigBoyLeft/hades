import { createExecTime } from '../lib/index.js';
import { compileResources } from '../compiler/resources.js';
import { compileUI, createViteServer } from '../compiler/ui.js';
import { configure } from './config.js';

async function BundleServer() {
    const timer = createExecTime('>>> Built Server');

    const operations = [
        compileResources(),
        configure(),
        ...(process.env.ENVIRONMENT === 'dev' ? [createViteServer()] : [compileUI()]),
    ];

    await Promise.all(operations);
    timer.stop();
}

async function Doctor() {}

export { BundleServer, Doctor };
