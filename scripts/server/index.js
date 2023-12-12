import path from 'node:path';
import { ChildProcess, spawn } from 'child_process';
import fkill from 'fkill';
import { BundleServer, Doctor } from '../bundler/index.js';
import { createExecTime } from '../lib/index.js';

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

function startServer() {
    const serverTimer = createExecTime('>>> Server Startup');

    BundleServer();
    handleServerProcess(process.env.ENVIRONMENT !== "dev");
}

export { startServer };
