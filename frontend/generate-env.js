const fs = require('fs');
const path = require('path');

const apiUrl = (process.env.API_BASE_URL || '').replace(/\/+$/, '');
const content = `(function(window) {
  window.__env = window.__env || {};
  window.__env.API_BASE_URL = "${apiUrl}";
})(this);
`;

const targetDir = path.join(__dirname, 'public', 'assets');
fs.mkdirSync(targetDir, { recursive: true });
fs.writeFileSync(path.join(targetDir, 'env.js'), content, 'utf8');
console.log(`[env] Generated assets/env.js with API_BASE_URL="${apiUrl}"`);
