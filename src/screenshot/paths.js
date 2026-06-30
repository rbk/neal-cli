const fs = require('fs');
const path = require('path');

function cacheDir() {
    const dateDir = new Date().toISOString().slice(0, 10);
    const skillDir = path.resolve(__dirname, '..', '..', 'skills', 'neal-cli');
    const dir = path.join(skillDir, '.cache', dateDir);
    fs.mkdirSync(dir, { recursive: true });
    return dir;
}

function defaultOutputPath(app, win) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const normalized = `${app}-${win.title}-${timestamp}`
        .toLowerCase()
        .replace(/[/\\:*?"<>|]/g, '_')  // strip filesystem-unsafe chars
        .replace(/\s+/g, '-')           // spaces → hyphens
        .replace(/-{2,}/g, '-')         // collapse multiple hyphens
        .replace(/^-|-$/g, '');         // trim leading/trailing hyphens
    return path.join(cacheDir(), `${normalized}.png`);
}

function fullScreenOutputPath() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    return path.join(cacheDir(), `fullscreen-${timestamp}.png`);
}

module.exports = { defaultOutputPath, fullScreenOutputPath };
