import fs from 'node:fs';
import path from 'node:path';
import axios from 'axios';
import StreamZip from 'node-stream-zip';
import { getEnvironmentConfig } from '../bundler/config.js';

const artifactsUrl = 'https://changelogs-live.fivem.net/api/changelog/versions/win32/server';
export const artifactsPath = path.join(process.cwd(), 'artifacts');

async function updateArtifacts(mode) {
    try {
        if (!fs.existsSync(artifactsPath)) {
            console.log(`Artifacts directory does not exist. Creating directory...`);
            fs.mkdirSync(artifactsPath);
        }

        const environment = await getEnvironmentConfig(mode)
        const branch = environment.server.artifacts_branch;
        const { data } = await axios.get(artifactsUrl);
        const downloadUrl = data[branch + '_download'];
        const buildVersion = data[branch];
        const currentVersion = fs
            .readdirSync(artifactsPath)
            .find((file) => file.endsWith('.zip'))
            ?.split('.')[0];

        if (!downloadUrl || !buildVersion) {
            console.log(`Download information for build type 'win32' not found.`);
            return;
        }

        if (currentVersion === buildVersion) {
            console.log(`Artifacts are up to date.`);
            return;
        }

        await deleteLocation(artifactsPath);
        const zipFileName = await downloadFile(downloadUrl, artifactsPath, buildVersion);
        await extractZippedFiles(path.join(artifactsPath, zipFileName), artifactsPath);

        console.log(`Done updating Artifacts for build ${buildVersion}.`);
    } catch (error) {
        console.error('Failed to update artifacts:', error);
    }
}

async function deleteLocation(dir) {
    if (!fs.existsSync(dir)) return;

    fs.rmSync(dir, { recursive: true }, (err) => {
        if (err && err.errno != -4058) {
            console.log(`Failed to delete ${dir}.`);
            process.exit();
        }
        console.log(`${dir} is deleted!`);
    });
}

async function downloadFile(url, dest, ver) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest);
    // const fileName = url.split('/').at(-1);
    const fileName = `${ver}.zip`;
    const writer = fs.createWriteStream(`${dest}/${fileName}`);
    const { data } = await axios.get(url, { responseType: 'stream' });
    data.pipe(writer);
    return new Promise((resolve) => writer.on('finish', () => resolve(fileName)));
}

async function extractZippedFiles(file, dest) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest);
    const zip = new StreamZip.async({ file: file });
    const count = await zip.extract(null, dest);
    await zip.close();
    console.log(`Extracting finished moving ${count} files`);
}

export { updateArtifacts };
