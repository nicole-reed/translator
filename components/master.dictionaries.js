const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js");
const britishOnly = require('./british-only.js');

function invertObject(obj) {
  return Object.entries(obj).reduce((acc, [key, val]) => {
    return {
      ...acc,
      [val]: key
    }
  }, {})
}


const americanToBritishDictionary = {
  ...americanOnly,
  ...americanToBritishSpelling,
  ...americanToBritishTitles,
  ...invertObject(britishOnly)
}

const britishToAmericanDictionary = invertObject(americanToBritishDictionary)

module.exports = { americanToBritishDictionary, britishToAmericanDictionary }