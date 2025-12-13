const fs = require('fs');
const path = require('path');

const envPath = path.resolve('.env');
console.log(`Checking .env at: ${envPath}`);

if (!fs.existsSync(envPath)) {
    console.error('ERROR: .env file DOES NOT EXIST at this path.');
    process.exit(1);
}

const buffer = fs.readFileSync(envPath);
console.log(`File size: ${buffer.length} bytes`);

// Hex dump of first 16 bytes
const hex = buffer.slice(0, 16).toString('hex').match(/../g).join(' ');
console.log(`First 16 bytes (Hex): ${hex}`);

if (buffer.length >= 2 && buffer[0] === 0xFF && buffer[1] === 0xFE) {
    console.log('DETECTED: UTF-16 LE BOM');
} else {
    console.log('No common BOM detected. Assuming UTF-8/ASCII.');
}

const content = buffer.toString('utf8');
console.log('Preview as UTF-8:', content.substring(0, 50));
