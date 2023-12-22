import path from 'node:path';
import fs from 'node:fs';

const ENVIRONMENT_PATH = path.join(process.cwd(), 'configs', process.env.ENVIRONMENT + '.json');

type Config = {
    server: {
        artifacts_branch: string,
        name: string,
        project_name: string,
        project_desc: string,
        locale: string,
        tags: Array<string>,
        max_clients: number,
        game_build: string,
        license: string,
        steam_key: string,
    },
    database: {
        host: string,
        user: string,
        password: string,
        database: string,
    },
    security: {},
    additional_options: Array<string>,
}

export const getEnvironmentConfig = (): Config => {
    if (!fs.existsSync(ENVIRONMENT_PATH)) {
        throw new Error('Environment config not found');
    }

    const config = JSON.parse(fs.readFileSync(ENVIRONMENT_PATH, 'utf-8'));
    
    return config;
};
