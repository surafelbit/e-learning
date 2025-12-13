const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.resolve(process.cwd(), '.env');
console.log(`Checking .env at: ${envPath}`);

if (!fs.existsSync(envPath)) {
    console.error('ERROR: .env file DOES NOT EXIST at this path.');
    console.log('Directory listing:');
    console.log(fs.readdirSync(process.cwd()));
    process.exit(1);
}

const buffer = fs.readFileSync(envPath);
console.log(`File size: ${buffer.length} bytes`);

// Hex dump of first 16 bytes
const hex = buffer.slice(0, 16).toString('hex').match(/../g).join(' ');
console.log(`First 16 bytes (Hex): ${hex}`);

// Encoding check
if (buffer.length >= 2 && buffer[0] === 0xFF && buffer[1] === 0xFE) {
    console.log('DETECTED: UTF-16 LE BOM');
} else if (buffer.length >= 3 && buffer[0] === 0xEF && buffer[1] === 0xBB && buffer[2] === 0xBF) {
    console.log('DETECTED: UTF-8 BOM');
} else {
    console.log('No common BOM detected. Assuming UTF-8/ASCII.');
}

// Content preview
const content = buffer.toString('utf8');
console.log('--- Content Preview as UTF-8 (first 100 chars) ---');
console.log(content.substring(0, 100).replace(/\n/g, '\\n'));
console.log('--------------------------------------------------');

// Dotenv load check
const config = dotenv.config({ path: envPath });
if (config.error) {
    console.error('Dotenv load error:', config.error);
} else {
    console.log('Dotenv parsed keys:', Object.keys(config.parsed));
    console.log('SUPABASE_URL in parsed:', config.parsed.SUPABASE_URL ? 'FOUND' : 'MISSING');
}
