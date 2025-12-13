const fs = require('fs');
const path = require('path');

const envPath = path.resolve('.env');
const tempPath = path.resolve('.env.tmp');

console.log('Reading .env...');
const buffer = fs.readFileSync(envPath);

let content;
if (buffer.length >= 2 && buffer[0] === 0xFF && buffer[1] === 0xFE) {
    console.log('Detected UTF-16 LE. Converting...');
    content = buffer.toString('utf16le');
} else {
    console.log('Treating as UTF-8...');
    content = buffer.toString('utf8');
}

// Clean up
content = content.replace(/^\uFEFF/, ''); // Remove BOM if present in string
content = content.trim();

console.log(`Writing normalized content to ${tempPath}...`);
fs.writeFileSync(tempPath, content, { encoding: 'utf8' });

console.log('Swapping files...');
try {
    if (fs.existsSync(envPath)) {
        fs.unlinkSync(envPath);
    }
    fs.renameSync(tempPath, envPath);
    console.log('Success! .env is now UTF-8.');
} catch (e) {
    console.error('Failed to swap files:', e.message);
}
