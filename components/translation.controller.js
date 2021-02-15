class TranslationController {
  constructor(translationService) {
    this.translationService = translationService
  }
  translate(request) {
    try {
      const { text, locale } = request.body;

      if (text == null || locale == null) {
        throw new Error('Required field(s) missing')
      }

      if (typeof text !== 'string') {
        throw new Error('text must be a string')
      }

      if (!text) {
        throw new Error('No text to translate')
      }

      if (locale !== 'american-to-british' && locale !== 'british-to-american') {
        throw new Error('Invalid value for locale field')
      }

      const translation = this.translationService.translate(text, locale)

      return {
        text,
        translation
      }
    } catch (error) {
      console.log('error in translationController.translate()', error)

      throw error
    }
  };

};

module.exports = TranslationController;