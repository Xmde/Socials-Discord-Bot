const fs = require('fs').promises;
const os = require('os');

module.exports = async function (filepath) {
  if (os.type() === 'Windows_NT') {
    return (await fs.readFile(filepath))
      .toString('utf-8')
      .split('\r\n')
      .filter(Boolean);
  }
  return (await fs.readFile(filepath))
    .toString('utf-8')
    .split('\n')
    .filter(Boolean);
};
