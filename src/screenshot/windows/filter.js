function filterByTitle(windows, substr) {
    const lower = substr.toLowerCase();
    return windows.filter(w => w.title.toLowerCase().includes(lower));
}

function pickLargest(windows) {
    return windows.reduce((best, w) =>
        (w.width * w.height > best.width * best.height) ? w : best
    );
}

module.exports = { filterByTitle, pickLargest };
