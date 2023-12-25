import * as ModuleSystem from '@Framework/server/systems/modules';
import { logger } from '@Utils/shared';

ModuleSystem.registerModule('test', async () => {
    logger.debug('This is a debug message');
    logger.error('This is a error message');
    logger.info('This is an info message');
    logger.warn('This is a warn message');
});
