const fs = require('fs');

function validateScreenshot(dest) {
    try {
        const stat = fs.statSync(dest);
        if (stat.size === 0) throw new Error('empty');
    } catch {
        console.error(
            'Screenshot file is missing or empty. Screen Recording permission is likely denied.\n' +
            'Grant permission to your terminal in:\n' +
            '  System Settings → Privacy & Security → Screen Recording\n' +
            'Then restart the terminal.'
        );
        process.exit(1);
    }
}

module.exports = { validateScreenshot };
