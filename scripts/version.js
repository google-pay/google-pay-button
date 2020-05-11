const path = require('path');
let packageFile = '../package.json';

if (process.argv[2]) {
  packageFile = path.join(process.cwd(), process.argv[2]);
}

const package = require(packageFile);

console.log(package.version);
