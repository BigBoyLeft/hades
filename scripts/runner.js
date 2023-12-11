import { updateArtifacts } from './update/index.js';
import { startServer } from './server/index.js';

const args = process.argv.slice(2).map((arg) => arg.replace('--', ''));
const mode = args.includes('dev') ? 'dev' : 'production'

if (args.includes('update')) await updateArtifacts(mode);

if (args.includes('start')) {
    startServer(mode);
}
