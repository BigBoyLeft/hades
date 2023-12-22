async function bundleUI() {
    console.log('bundled ui');
}

async function createDevServer() {
    console.log('created dev server');
}

/**
 * Builds the UI asynchronously.
 *
 * @param {boolean} dev - Flag indicating if in development mode.
 * @return {Promise<void>} A promise that resolves when the UI is built.
 */
async function buildUI(dev) {
    if (dev) {
        await createDevServer();
    } else {
        await bundleUI();
    }
}

export { buildUI };
