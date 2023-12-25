import { prisma, getEnvironmentConfig } from '@Utils/server';
import { Events, logger } from '@Utils/shared';

const startTime = Date.now();
const environment = getEnvironmentConfig();

class Server {
    static async start() {
        await Server.database();
        await Server.boot();
    }
    static async database() {
        try {
            await prisma.$connect();
        } catch (error) {
            logger.error(error);
        }
    }
    static async boot() {
        await import('./boot');
        logger.info(
            `Started Project ${environment.server.name} (${environment.server.game_build}) in ${
                Date.now() - startTime
            }ms`,
        );
    }
}

Events;

Server.start();
