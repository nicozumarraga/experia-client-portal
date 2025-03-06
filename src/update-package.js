
const fs = require('fs');
const path = require('path');

// Read package.json
const packagePath = path.join(__dirname, '..', 'package.json');
const package = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

// Add test scripts if they don't exist
if (!package.scripts.test) {
  package.scripts.test = 'vitest run';
}
if (!package.scripts['test:watch']) {
  package.scripts['test:watch'] = 'vitest';
}
if (!package.scripts['test:coverage']) {
  package.scripts['test:coverage'] = 'vitest run --coverage';
}

// Write updated package.json
fs.writeFileSync(packagePath, JSON.stringify(package, null, 2));
console.log('Updated package.json with test scripts');
