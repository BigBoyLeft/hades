import { updateArtifacts } from './artifacts.js';
import { configure } from './config.js';
import { buildResources } from './resources.js';
import { buildUI } from './ui.js';
import { handleServerProcess } from './server.js';

const isDev = process.env.ENVIRONMENT !== 'prod';

async function main() {
    try {
        await updateArtifacts();
        await buildResources(isDev);
        await buildUI(isDev);
        await configure();
        await handleServerProcess(isDev);
    } catch (error) {
        console.error('Failed to compile server', error);
        process.exit(1);
    }
}

main();
