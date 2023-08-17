// cli/tokenGenerator.js
const crc = require('crc');

function generateToken() {
  const uniqueValue = Date.now().toString(); // You can replace this with your own value
  const crcToken = crc.crc32(uniqueValue).toString(16);
  return crcToken;
}

module.exports = {
  generateToken
};
