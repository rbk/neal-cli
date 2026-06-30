const { listWindows, getRunningApps } = require('../screenshot/windows/discovery');
const { filterByTitle } = require('../screenshot/windows/filter');
const { captureWindow } = require('../screenshot/capture/window');
const { captureFullScreen } = require('../screenshot/capture/fullscreen');
const { extractText } = require('../tesseract');
const { jsonOk, jsonError, fileLink } = require('../output');

function verifyOcr(text, expects) {
    return expects.map(term => ({
        term,
        found: text.toLowerCase().includes(term.toLowerCase()),
    }));
}

function formatJsonResults(windowResults) {
    const entries = [];
    for (const wr of windowResults) {
        for (const r of wr.results) {
            entries.push({
                app: wr.app,
                expectedText: r.term,
                success: r.found,
                imagePath: wr.screenshot,
            });
        }
    }
    return JSON.stringify(entries, null, 2);
}

function printResult({ app, window: winTitle, screenshot, passed }) {
    console.log(app);
    console.log(fileLink(screenshot, `${winTitle} (View)`));
    console.log(passed ? 'PASS' : 'FAIL');
    console.log('');
}

async function verify(app, options) {
    const expects = Array.isArray(options.expect) ? options.expect : [options.expect];

    if (!app && options.title) {
        // No app but --title given: search all running apps for matching windows
        const apps = await getRunningApps();
        let matched = [];
        for (const a of apps) {
            try {
                const wins = await listWindows(a);
                const filtered = filterByTitle(wins, options.title);
                for (const w of filtered) matched.push({ app: a, win: w });
            } catch (_) { /* skip apps with no capturable windows */ }
        }

        if (matched.length === 0) {
            const msg = `No windows found with title containing "${options.title}".`;
            if (options.json) {
                console.log(jsonError('NOT_FOUND', msg, `neal screenshot --apps`));
                process.exit(3);
            }
            console.error(msg);
            process.exit(3);
        }

        // Verify each matching window
        const windowResults = [];
        for (const m of matched) {
            const dest = await captureWindow(m.app, m.win, matched.length === 1 ? options.output : null);
            const text = await extractText(dest);
            const results = verifyOcr(text, expects);
            const passed = results.every(r => r.found);
            const entry = { screenshot: dest, results, passed, app: m.app, window: m.win.title };
            windowResults.push(entry);
            if (!options.json) printResult(entry);
        }

        const allPassed = windowResults.every(r => r.passed);
        if (options.json) {
            console.log(formatJsonResults(windowResults));
        }
        if (!allPassed) process.exit(1);
        return;
    }

    // Single-target path: app provided, or no app and no title (full screen)
    let dest;
    let winTitle = 'fullscreen';
    let appName = app || 'fullscreen';

    if (!app) {
        dest = await captureFullScreen(options.output);
    } else {
        let windows = await listWindows(app);

        if (options.title) {
            windows = filterByTitle(windows, options.title);
        }

        if (windows.length === 0) {
            const extra = options.title ? ` with title containing "${options.title}"` : '';
            const msg = `No windows found for "${app}"${extra}.`;
            if (options.json) {
                console.log(jsonError('NOT_FOUND', msg, `neal screenshot --apps`));
                process.exit(3);
            }
            console.error(msg);
            process.exit(3);
        }

        const win = windows.reduce((best, w) =>
            (w.width * w.height > best.width * best.height) ? w : best
        );
        winTitle = win.title;

        dest = await captureWindow(app, win, options.output);
    }

    const text = await extractText(dest);
    const results = verifyOcr(text, expects);
    const passed = results.every(r => r.found);

    if (options.json) {
        console.log(formatJsonResults([{ app: appName, window: winTitle, screenshot: dest, results, passed }]));
    } else {
        printResult({ app: appName, window: winTitle, screenshot: dest, passed });
    }
    if (!passed) process.exit(1);
}

module.exports = { verify };
