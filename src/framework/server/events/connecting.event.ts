import { getPlayerIdentifier, getSource } from '@Utils/server';
import { Events, FivemEvents, logger } from '@Utils/shared';

export class PlayerConnecting {
    static handle(name: string, setKickReason: (reason: string) => void, deferrals: any) {
        const src = getSource();
        deferrals.defer();
        const identifier = getPlayerIdentifier(src, 'license');
        console.log(`Player ${name} (${src}) is connecting to the server. (${identifier})`)
        deferrals.update(`Hello ${name}. Your identity is being verified. (${identifier})`);

        // setTimeout(() => deferrals.done(), 2000);
    }
}
