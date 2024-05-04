import 'dotenv/config';
import { updateArtifacts } from './artifacts.js';
import { configure } from './config.js';
import { buildResources } from './resources.js';
import { viteProcess, buildUI } from './ui.js';
import { serverProcess, handleServerProcess } from './server.js';
import { RunPreCompileCheck } from './pre-compile.js';

const isDev = process.env.ENVIRONMENT !== 'prod';

async function main() {
    try {
        [`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`].forEach((eventType) => {
            process.on(eventType, () => {
                if (viteProcess) viteProcess.kill();
                if (serverProcess) serverProcess.kill();
            });
        });

        await RunPreCompileCheck();
        await updateArtifacts();
        await buildUI(isDev);
        await buildResources(isDev);
        await configure();
        await handleServerProcess(isDev);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

main();
