
class TranslationService {
  constructor(dictionaries) {
    this.americanToBritishDictionary = dictionaries.americanToBritishDictionary
    this.britishToAmericanDictionary = dictionaries.britishToAmericanDictionary
  }

  translate(text, locale) {
    try {
      let dictionary;
      let translation = text.slice();

      if (locale === 'british-to-american') {
        dictionary = this.britishToAmericanDictionary
        translation = translation.replace(/.(?=[0-9]{2})/g, ':')
      } else {
        dictionary = this.americanToBritishDictionary
        translation = translation.replace(/:(?=[0-9]{2})/g, '.')
      }

      Object.entries(dictionary).forEach((entry) => {
        const regex = new RegExp(`${entry[0]}(?=\\s)`, "gi")
        translation = translation.replace(regex, `<span class="highlight">${entry[1]}</span>`)
      })

      if (translation === text) {
        return "Everything looks good to me!"
      }

      return translation
    } catch (error) {
      console.log('error in translationService.translate()', error)

      throw error
    }
  };

};

module.exports = TranslationService;