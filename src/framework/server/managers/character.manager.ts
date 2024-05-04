import { Events, FivemEvents, logger, CharacterEvents } from '@Utils/shared';
import { getSource, prisma } from '@Utils/server';
import { Character } from '../classes/character.class';

export class CharacterManager {
    static characters = new Map<number, Character>();
    
    static async getCharacters() {
        let src = getSource();

        logger.debug(`Loading user ${src}`);
    }


}

Events.on(CharacterEvents.CHARACTERS_GET, CharacterManager.getCharacters);