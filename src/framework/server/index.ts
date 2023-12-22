import prisma from 'framework/server/systems/database';
import { logger } from 'utils/shared';
import { getEnvironmentConfig } from 'utils/server';

class Server {
    static async start() {
        const environment = getEnvironmentConfig();
        logger.info(`Starting Project ${environment.server.name} with build ${environment.server.game_build}`);
    }
    static async database() {}
    static async;
}

Server.start();
