const { createWorker } = require('tesseract.js');
const fs = require('fs')
const path = require('path')

const extractTextFromImage = async (inputFileName) => {
    console.log(`Starting conversion..${inputFileName}`)
    const outputFileName = `${inputFileName}.txt`;
    const worker = await createWorker('eng');
    const ret = await worker.recognize(fs.readFileSync(path.resolve('.', inputFileName)));
    console.log(ret.data.text)
    // fs.writeFileSync(path.resolve('.', outputFileName), ret.data.text)
    await worker.terminate();
}

module.exports = { extractTextFromImage }