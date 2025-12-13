const fs = require('fs');
const buffer = fs.readFileSync('.env');
console.log('Hex:', buffer.slice(0, 50).toString('hex'));
console.log('Str:', buffer.toString('utf8').slice(0, 50));
