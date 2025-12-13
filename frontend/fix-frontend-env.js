const fs = require('fs');
const path = require('path');

const envPath = path.resolve('.env');
const tempPath = path.resolve('.env.tmp');

console.log(`Targeting .env at: ${envPath}`);

if (!fs.existsSync(envPath)) {
    console.error('File not found!');
    process.exit(1);
}

const buffer = fs.readFileSync(envPath);
let content;

// Check for UTF-16 LE BOM
if (buffer.length >= 2 && buffer[0] === 0xFF && buffer[1] === 0xFE) {
    console.log('Detected UTF-16 LE BOM. Converting...');
    content = buffer.toString('utf16le');
} else {
    console.log('No UTF-16 BOM. Treating as UTF-8...');
    content = buffer.toString('utf8');
}

// Clean up
content = content.replace(/^\uFEFF/, '').trim(); // Remove BOM

console.log('preview:', content.substring(0, 50));

fs.writeFileSync(tempPath, content, { encoding: 'utf8' });
console.log('wrote temp file');

// Swap
try {
    fs.unlinkSync(envPath);
    fs.renameSync(tempPath, envPath);
    console.log('Success! .env fixed.');
} catch (e) {
    console.error('Swap failed:', e);
}
