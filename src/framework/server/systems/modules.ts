import { logger } from 'utils/shared';

const modulesRegistration: Array<{ name: string; callback: Function }> = [];

let hasFinishedLoading = false;
let hasInitialized = false;

async function loadModules() {
    const promises = [];

    for (let i = 0; i < modulesRegistration.length; i++) {
        const module = modulesRegistration[i];

        if (!module || typeof module.callback !== 'function') {
            logger.error(`Module ${module.name} does not have a callback function`);
            continue;
        }

        logger.debug(`Loading ${module.name} module`);
        promises.push(module.callback());
    }

    await Promise.all(promises);

    hasFinishedLoading = true;
}

export function init(): void {
    if (hasInitialized) return;
    hasInitialized = true;
    loadModules();
}

export function registerModule(name: string, callback: Function) {
    modulesRegistration.push({ name, callback });
}

export async function isDoneLoading(): Promise<void> {
    return new Promise((resolve: Function) => {
        const interval = setInterval(() => {
            if (!hasFinishedLoading) return;

            clearInterval(interval);
            resolve();
        }, 100);
    });
}
