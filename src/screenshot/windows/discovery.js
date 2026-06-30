const { execFile } = require('child_process');
const { promisify } = require('util');

const execFileAsync = promisify(execFile);

/**
 * Parse GetWindowID --list output into structured window objects.
 * Each line looks like: "Inbox - Gmail" size=1728x1080 id=73841
 */
function parseWindowList(stdout) {
    const lines = stdout.trim().split('\n').filter(Boolean);
    const windows = [];
    const re = /^"(.+?)"\s+size=(\d+)x(\d+)\s+id=(\d+)$/;
    for (const line of lines) {
        const m = line.match(re);
        if (!m) continue;
        const width = parseInt(m[2], 10);
        const height = parseInt(m[3], 10);
        if (width === 0 || height === 0) continue;
        windows.push({ title: m[1], width, height, id: m[4] });
    }
    return windows;
}

async function listWindows(app) {
    try {
        const { stdout } = await execFileAsync('GetWindowID', [app, '--list']);
        return parseWindowList(stdout);
    } catch (err) {
        if (err.code === 'ENOENT') {
            throw new Error(
                'GetWindowID not found. Install it with:\n  brew install smokris/getwindowid/getwindowid'
            );
        }
        throw new Error(`GetWindowID failed: ${err.stderr || err.message}`);
    }
}

async function getRunningApps() {
    try {
        const { stdout } = await execFileAsync('osascript', [
            '-e',
            'tell application "System Events" to get name of every process whose background only is false'
        ]);
        return stdout.trim().split(', ').sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
    } catch (err) {
        throw new Error(`Failed to list applications: ${err.stderr || err.message}`);
    }
}

module.exports = { parseWindowList, listWindows, getRunningApps };
