const fs = require('fs').promises;

module.exports = async function (filepath) {
  return (await fs.readFile(filepath))
    .toString()
    .split('\r\n');
}
