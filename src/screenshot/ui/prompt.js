const { createInterface } = require('readline');

function promptChoice(label, items, formatItem) {
    return new Promise((resolve) => {
        console.log(`${label}:`);
        items.forEach((item, i) => {
            console.log(`  [${i + 1}] ${formatItem(item)}`);
        });
        const rl = createInterface({ input: process.stdin, output: process.stdout });
        rl.question(`Choose (1-${items.length}): `, (answer) => {
            rl.close();
            const idx = parseInt(answer, 10) - 1;
            if (isNaN(idx) || idx < 0 || idx >= items.length) {
                console.error('Invalid selection.');
                process.exit(1);
            }
            resolve(items[idx]);
        });
    });
}

function printApps(apps) {
    console.log('Running applications:');
    apps.forEach((name, i) => {
        console.log(`  [${i + 1}] ${name}`);
    });
}

module.exports = { promptChoice, printApps };
