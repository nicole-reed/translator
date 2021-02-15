
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
        const textArr = text.split(' ')
        const changedTimes = textArr.map((element) => {
          if (element.match(/^[0-9]{1,2}\.[0-9]{2}(?=[\\s!,.?]|$)/g)) {
            if (element.match(/^[0-9]{1,2}\.[0-9]{2}/g)) {
              if (element.charAt(element.length - 1) === '.') {
                const newTime = element.split('.')
                return `<span class="highlight">${newTime[0]}:${newTime[1]}</span>.`
              }
              const newTime = element.split('.')
              if (newTime[1].length === 3) {
                const hasPunctuation = newTime[1].split('')
                return `<span class="highlight">${newTime[0]}:${hasPunctuation[0]}${hasPunctuation[1]}</span>${hasPunctuation[2]}`
              }
              return `<span class="highlight">${newTime[0]}:${newTime[1]}</span>`
            }
          }
          return element
        })

        translation = changedTimes.join(' ')


      } else {
        dictionary = this.americanToBritishDictionary
        const textArr = text.split(' ')
        const changedTimes = textArr.map((element) => {
          if (element.match(/^[0-9]{1,2}\:[0-9]{2}(?=[\\s!,.?]|$)/g)) {
            const newTime = element.split(':')
            if (newTime[1].length === 3) {
              const hasPunctuation = newTime[1].split('')
              return `<span class="highlight">${newTime[0]}:${hasPunctuation[0]}${hasPunctuation[1]}</span>${hasPunctuation[2]}`
            }
            return `<span class="highlight">${newTime[0]}.${newTime[1]}</span>`
          }
          return element
        })

        translation = changedTimes.join(' ')
      }

      Object.entries(dictionary).forEach((entry) => {
        const regex = new RegExp(`${entry[0]}(?=[\\s!,.?]|$)`, "gi")
        translation = translation.replace(regex, `<span class="highlight">${entry[1]}</span>`)
      })

      console.log('text', text)
      console.log('translation', translation)
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