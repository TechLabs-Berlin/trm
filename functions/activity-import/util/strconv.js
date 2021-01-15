const Diacritics = require('diacritic')
const stringSimilarity = require('string-similarity')

module.exports = {
  // removes diacritics (äöü -> aou) and lowers the case
  cleanse: str => Diacritics.clean(str).toLowerCase(),

  // searches the "best match" from the needle string in the haystack array of strings
  // returns { target: most_similar_needle_in_haystack, rating: 0.81 }
  findBestMatch: (needle, haystack) => stringSimilarity.findBestMatch(needle, haystack).bestMatch
}
