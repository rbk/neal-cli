const path = require('path');

/**
 * Structured output helpers.
 * JSON envelope is consistent across all commands.
 */

function jsonOk(data, warnings = []) {
    return JSON.stringify({ status: 'ok', data, warnings }, null, 2);
}

function jsonError(code, message, fix, transient = false) {
    return JSON.stringify({
        status: 'error',
        error: { code, message, fix, transient }
    }, null, 2);
}

/** Print to stderr — all status/progress/diagnostics go here. */
function info(msg) {
    process.stderr.write(msg + '\n');
}

/** Format a file path as a clickable OSC 8 link (iTerm2/modern terminals) when TTY, raw path otherwise. */
function fileLink(filePath) {
    if (!process.stdout.isTTY) return filePath;
    const name = path.basename(filePath);
    const url = `file://${path.resolve(filePath)}`;
    return `\x1b]8;;${url}\x07${name}\x1b]8;;\x07`;
}

module.exports = { jsonOk, jsonError, info, fileLink };
