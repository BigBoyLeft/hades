import fs from 'node:fs';
import path from 'node:path';
import { glob } from 'glob';

const RESOURCES_FOLDER = sanitizePath(path.join(process.cwd(), 'src'));
const COMPILED_FOLDER = sanitizePath(path.join(process.cwd(), 'resources', '[compiled]'));

/**
 * @param {string} path
 * @return {string}
 */
function sanitizePath(path) {
    return path.replace(/\\/g, '/');
}

/**
 * @param {string} path
 * @param {GlobOptionsWithFileTypesFalse} options
 * @return {string[]}
 */
function globSync(path, options = {}) {
    path = sanitizePath(path);

    return glob.sync(path, { ...options }).map((filePath) => {
        return sanitizePath(filePath);
    });
}

/**
 * @param {string} path
 * @param {GlobOptionsWithFileTypesFalse} options
 * @return {Promise<string[]>}
 */
async function globAsync(path, options = {}) {
    path = sanitizePath(path);

    const results = await glob.glob(path, { ...options });
    return results.map((filePath) => {
        return sanitizePath(filePath);
    });
}

/**
 * @param {string} filePath
 * @param {string} data
 */
function writeFile(filePath, data) {
    filePath = sanitizePath(filePath);
    const splitPath = filePath.split('/');
    splitPath.pop();

    const directory = splitPath.join('/');
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }

    if (fs.existsSync(filePath)) {
        fs.rmSync(filePath, { force: true, maxRetries: 999 });
    }

    fs.writeFileSync(filePath, data);
}

/**
 * @param {string} path
 * @param {string} destination
 */
function copySync(path, destination) {
    path = sanitizePath(path);
    destination = sanitizePath(destination);

    if (path.includes('.')) {
        const splitPath = path.split('/');
        splitPath.pop();

        const directory = splitPath.join('/');
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
        }
    }

    fs.cpSync(path, destination, { force: true, recursive: true });
}

/**
 * @param {string} path
 * @param {string} destination
 * @returns {Promise<void>}
 */
async function copyAsync(path, destination) {
    path = sanitizePath(path);
    destination = sanitizePath(destination);

    if (path.includes('.')) {
        const splitPath = path.split('/');
        splitPath.pop();

        const directory = splitPath.join('/');
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
        }
    }

    await fs.promises.cp(path, destination, { force: true, recursive: true });
}

/**
 * Retrieves the environment configuration based on the specified environment.
 *
 * @return {object} The parsed JSON object representing the environment configuration.
 */
function getEnvironmentConfig() {
    try {
        const configPath = path.join(process.cwd(), 'configs', `${process.env.ENVIRONMENT}.json`);
        return JSON.parse(fs.readFileSync(configPath));
    } catch (e) {
        throw new Error(`Failed to load environment config for ${process.env.ENVIRONMENT}.`);
    }
}

export {
    RESOURCES_FOLDER,
    COMPILED_FOLDER,
    globSync,
    globAsync,
    copySync,
    copyAsync,
    writeFile,
    sanitizePath,
    getEnvironmentConfig,
};
