import { prisma, getEnvironmentConfig } from '@Utils/server';
import { Events, logger, FivemEvents } from '@Utils/shared';
import { PlayerConnecting } from './events/connecting.event';

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
        Events.off(FivemEvents.PLAYER_CONNECTING, Server.handlePlayerEarlyConnect);
        Events.on(FivemEvents.PLAYER_CONNECTING, PlayerConnecting.handle);
        logger.info(
            `Started Project ${environment.server.name} (${environment.server.game_build}) in ${
                Date.now() - startTime
            }ms`,
        );
    }

    static handlePlayerEarlyConnect(name: string, setKickReason: (reason: string) => void, deferrals: any) {
        CancelEvent();
        setKickReason('Server is still starting up. Please try again in a few seconds. :]');
    }
}

Events.on(FivemEvents.PLAYER_CONNECTING, Server.handlePlayerEarlyConnect, true);

Server.start();
