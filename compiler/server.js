import { ChildProcess, spawn } from 'child_process';
import ora from 'ora';

const spinner = ora();

/**
 * @type {ChildProcess} */
let serverProcess;
async function handleServerProcess(dev) {
    try {
        spinner.start('Starting server process...');
        if (serverProcess && !serverProcess.killed) serverProcess.kill();

        serverProcess = spawn('start.bat', { stdio: 'inherit' });

        serverProcess.once('close', async (code) => {
            if (code === 0) {
                console.log('Server Closed.');
                return;
            }

            if (dev) {
                console.log('Server Crash Detected, Restarting...');
                await handleServerProcess(dev);
            }
        });
        spinner.succeed('Started server process');
    } catch (error) {
        spinner.fail('Failed to start server process');
        throw error;
    }
}

export { handleServerProcess };
