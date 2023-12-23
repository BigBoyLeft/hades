import fs from 'node:fs';
import path from 'node:path';
import { getEnvironmentConfig, writeFile } from './utils.js';
import ora from 'ora';

const ENVIRONMENT_CONFIG = path.join(process.cwd(), `environment.config.cfg`);
const ENVIRONMENT = process.env.ENVIRONMENT;

const spinner = ora();

async function configure() {
    try {
        spinner.start('Generating environment config...');

        if (fs.existsSync(ENVIRONMENT_CONFIG)) {
            fs.rmSync(ENVIRONMENT_CONFIG);
        }

        const config = await getEnvironmentConfig();
        const { server, additional_options, security } = config;
        let server_cfg = `# THIS IS A GENERATED ${ENVIRONMENT.toUpperCase()} ENVIRONMENT CONFIG. DO NOT EDIT \n`;
        server_cfg += `endpoint_add_tcp "0.0.0.0:30120"\n`;
        server_cfg += `endpoint_add_udp "0.0.0.0:30120"\n`;
        server_cfg += `ensure [fivem]\n`;
        server_cfg += `ensure [compiled]\n`;
        for (const option of additional_options) {
            server_cfg += `${option}\n`;
        }
        server_cfg += `sv_scriptHookAllowed 0\n`;
        server_cfg += `sv_hostname "${server.name}"\n`;
        server_cfg += `sets sv_projectName "${server.project_name}"\n`;
        server_cfg += `sets sv_projectDesc "${server.project_desc}"\n`;
        server_cfg += `sets locale "${server.locale}"\n`;
        server_cfg += `sets tags "${server.tags.join(', ')}"\n`;
        server_cfg += `sv_maxclients ${server.max_clients}\n`;
        server_cfg += `sv_enforceGameBuild ${server.game_build}\n`;
        server_cfg += `set steam_webApiKey "${server.steam_key}"\n`;
        server_cfg += `sv_licenseKey "${server.license}"\n`;

        writeFile(ENVIRONMENT_CONFIG, server_cfg);

        spinner.succeed('Built environment config');
    } catch (error) {
        spinner.fail('Failed to generate environment config!');
        throw error;
    }
}

export { configure, getEnvironmentConfig };
