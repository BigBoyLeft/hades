import ora from 'ora';
import fkill from 'fkill';

const spinner = ora();
const ports = ['FXServer.exe', 3000, 3001, 3002, 3003];

async function stopExistingProcess() {
    for (const port of ports) {
        await fkill(port, { force: true, ignoreCase: true, silent: true });
    }
}

async function checkEnvVars() {
    spinner.start('Checking environment variables...');
    const envVars = ['ENVIRONMENT', 'CFX_LICENSE_KEY', 'STEAM_WEBAPI_KEY'];

    for (const envVar of envVars) {
        if (!process.env[envVar]) {
            throw new Error(`Missing environment variable: ${envVar}`);
        }
    }

    spinner.succeed('Environment Variables');
}

async function RunPreCompileCheck() {
    await checkEnvVars();
}

export { RunPreCompileCheck };
