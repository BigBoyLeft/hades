import { updateArtifacts } from './update/index.js';
import { startServer } from './server/index.js';

const args = process.argv.slice(2).map((arg) => arg.replace('--', ''));

if (args.includes('update')) await updateArtifacts();

if (args.includes('start')) {
    startServer();
}
