import path from 'node:path';
import { ChildProcess, spawn } from 'child_process';
import fkill from 'fkill';
import { BundleResources, Doctor } from '../bundler/index.js';
import { configure } from './config.js';
import { createExecTime } from '../lib/index.js';

const PORTS = [30120, 40120];
/**
 * @type {ChildProcess} */
let serverProcess;
async function handleServerProcess(autoRestart = false) {
    if (serverProcess && !serverProcess.killed) {
        serverProcess.kill();
    }

    await Doctor();
    serverProcess = spawn('start.bat', { stdio: 'inherit' });

    serverProcess.once('close', async (code) => {
        if (code === 0) {
            console.log('Server closed.');
            return;
        }

        if (autoRestart) {
            console.log('Server crashed. Restarting...');
            await handleServerProcess(true);
        }
    });
}

function startServer(mode) {
    const isDev = mode === 'dev';
    const serverTimer = createExecTime('>>> Server Startup');

    BundleResources(mode);
    configure(mode);
    // handleServerProcess(!isDev);
}

export { startServer };
