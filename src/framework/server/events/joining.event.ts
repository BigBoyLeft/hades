import { getSource } from '@Utils/server';
import { Events, FivemEvents, logger } from '@Utils/shared';

class PlayerJoining {
    static handle() {
        const src = getSource();

        logger.info(`Player ${GetPlayerName(src)} (${src}) is joining the server.`);
    }
}

Events.on(FivemEvents.PLAYER_JOINING, PlayerJoining.handle);
