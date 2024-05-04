import { ChildProcess, spawn } from 'node:child_process';
import path from 'node:path';
import ora from 'ora';

const spinner = ora();

/**
 * @type {ChildProcess} */
export let serverProcess;

async function handleServerProcess(dev) {
    try {
        spinner.start('Starting server process...');
        if (serverProcess && !serverProcess.killed) serverProcess.kill();

        // Execute FXServer.exe with arguments
        serverProcess = spawn(path.join(process.cwd(), 'artifacts/FXServer.exe'), { stdio: 'inherit' });

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
