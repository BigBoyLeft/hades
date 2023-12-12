import path from "node:path";
import fs from "node:fs";
import { sanitizePath } from "../lib/file.js";

async function compileModules(resource) {
    const resourcePath = sanitizePath(path.join(resource, 'modules', '**/*.ts'));
    
}

export { compileModules };
