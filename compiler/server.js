import { ChildProcess, spawn } from 'child_process';

/**
 * @type {ChildProcess} */
let serverProcess;
async function handleServerProcess(dev) {
    if (serverProcess && !serverProcess.killed) serverProcess.kill();

    serverProcess = spawn('start.bat', { stdio: 'inherit' });

    serverProcess.once('close', async(code) => {
        if (code === 0) {
            console.log('Server Closed.')
            return;
        }

        if (dev) {
            console.log('Server Crash Detected, Restarting...');
            await handleServerProcess(dev)
        }
    })
}

export { handleServerProcess }