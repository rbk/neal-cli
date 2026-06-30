#!/usr/bin/env node
const { program } = require('commander');
const {extractTextFromImage} = require("./src/tesseract");
const {screenshot} = require("./src/screenshot/index");

program
    .name('neal')
    .description('`neal` is CLI tool for doing various things.')
    .version('0.0.1');

program
    .command('tess <filePath>', {})
    .description('Command to extract text from image given the image path')
    .action((filePath) => {
        extractTextFromImage(filePath)
    })

program
    .command('screenshot [app]')
    .alias('sc')
    .description('Capture a screenshot of a macOS window.\n\nExamples:\n  neal screenshot --apps\n  neal screenshot "Google Chrome"\n  neal screenshot Safari --title "GitHub" -o gh.png\n  neal screenshot Slack --list')
    .option('-a, --apps', 'list running application names and exit')
    .option('-n, --no-interactive', 'disable interactive prompts (auto-pick largest window)')
    .option('-t, --title <substr>', 'only match windows whose title contains this substring (case-insensitive)')
    .option('-o, --output <path>', 'output PNG path (default: ./<app>-<timestamp>.png)')
    .option('-l, --list', 'list matching windows and exit without capturing')
    .action((app, options) => {
        screenshot(app, options).catch(err => {
            console.error(err.message);
            process.exit(1);
        });
    })

program.parse(process.argv);

