const { expect } = require('chai');
const chai = require('chai');
const spies = require('chai-spies');
const TranslationController = require('../components/translation.controller.js');
const TranslationService = require('../components/translation.service.js');
const dictionaries = require('../components/master.dictionaries.js');
const mocha = require('mocha');
const assert = chai.assert;

chai.use(spies)

suite('Unit Tests', () => {
  suite('TranslationController.translate()', () => {
    const mockTranslation = 'mock translation'
    let mockTranslationService;
    let translationController;

    mocha.beforeEach(() => {
      mockTranslationService = {
        translate: chai.spy(() => mockTranslation)
      }

      translationController = new TranslationController(mockTranslationService)
    })

    suite('when one or more of the required fields is missing', () => {
      const request = {
        body: {
          text: "mock text",
        }
      };

      test('it throws an error with the message "Required field(s) missing"', () => {
        expect(() => translationController.translate(request)).to.throw('Required field(s) missing')
      })
    });

    suite('when text is empty', () => {
      const request = {
        body: {
          text: "",
          locale: "british-to-american"
        }
      };

      test('it throws an error with the message "No text to translate"', () => {
        expect(() => translationController.translate(request)).to.throw('No text to translate')
      })
    });

    suite('when locale does not match one of the two specified locales', () => {
      const request = {
        body: {
          text: "mock text",
          locale: "wrong locale"
        }
      };

      test('it throws an error with the message "Invalid value for locale field"', () => {
        expect(() => translationController.translate(request)).to.throw('Invalid value for locale field')
      })
    });

    suite('when called with valid parameters', () => {
      const request = {
        body: {
          text: "mock text",
          locale: "british-to-american"
        }
      };

      test('calls TranslationService.translate() with the correct parameters', () => {
        translationController.translate(request)

        expect(mockTranslationService.translate).to.have.been.called.once;
        expect(mockTranslationService.translate).to.have.been.called.with(request.body.text, request.body.locale);
      })

      test('returns an object with the correct key-value pairs', () => {
        const returnObj = translationController.translate(request)

        expect(returnObj.text).to.equal(request.body.text)
        expect(returnObj.translation).to.equal(mockTranslation)
      })
    });
  });

  suite('TranslationService.translate()', () => {
    const translationService = new TranslationService(dictionaries)

    suite('when locale is "british-to-american"', () => {
      const locale = 'british-to-american'

      suite('when text requires no translation', () => {
        const text = 'We watched the soccer match for a while.'
        test('translation value should be "Everything looks good to me!"', () => {
          const translation = translationService.translate(text, locale)

          expect(translation).to.equal('Everything looks good to me!')
        })
      })
      suite('when text is "We watched the footie match for a while."', () => {
        const text = 'We watched the footie match for a while.'
        test('translation should be "We watched the <span class=\"highlight\">soccer</span> match for a while."', () => {

          const translation = translationService.translate(text, locale)

          expect(translation).to.equal('We watched the <span class=\"highlight\">soccer</span> match for a while.')
        })
      })
      suite('when text is "Paracetamol takes up to an hour to work."', () => {
        const text = 'Paracetamol takes up to an hour to work.'
        test('translation should be "<span class=\"highlight\">Tylenol</span> takes up to an hour to work." ', () => {

          const translation = translationService.translate(text, locale)

          expect(translation).to.equal('<span class=\"highlight\">Tylenol</span> takes up to an hour to work.')
        })
      })
      suite('when text is "First, caramelise the onions." ', () => {
        const text = 'First, caramelise the onions.'
        test('translation should be "First, <span class=\"highlight\">caramelize</span> the onions."', () => {

          const translation = translationService.translate(text, locale)

          expect(translation).to.equal('First, <span class=\"highlight\">caramelize</span> the onions.')
        })
      })
      suite('when text is "I spent the bank holiday at the funfair."', () => {
        const text = 'I spent the bank holiday at the funfair.'
        test('translation should be "I spent the <span class=\"highlight\">public holiday</span> at the <span class=\"highlight\">carnival</span>."', () => {

          const translation = translationService.translate(text, locale)

          expect(translation).to.equal('I spent the <span class=\"highlight\">public holiday</span> at the <span class=\"highlight\">carnival</span>.')
        })
      })
      suite('when text is "I had a bikky then went to the chippy."', () => {
        const text = 'I had a bikky then went to the chippy.'
        test('translation should be "I had a <span class=\"highlight\">cookie</span> then went to the <span class=\"highlight\">fish-and-chip shop</span>."', () => {

          const translation = translationService.translate(text, locale)

          expect(translation).to.equal('I had a <span class=\"highlight\">cookie</span> then went to the <span class=\"highlight\">fish-and-chip shop</span>.')
        })
      })
      suite('when text is "I\'ve just got bits and bobs in my bum bag."', () => {
        const text = 'I\'ve just got bits and bobs in my bum bag.'
        test('translation should be "I\'ve just got <span class=\"highlight\">odds and ends</span> in my <span class=\"highlight\">fanny pack</span>."', () => {

          const translation = translationService.translate(text, locale)

          expect(translation).to.equal('I\'ve just got <span class=\"highlight\">odds and ends</span> in my <span class=\"highlight\">fanny pack</span>.')
        })
      })
      suite('when text is "The car boot sale at Boxted Airfield was called off."', () => {
        const text = 'The car boot sale at Boxted Airfield was called off.'
        test('translation should be "The <span class=\"highlight\">swap meet</span> at Boxted Airfield was called off."', () => {

          const translation = translationService.translate(text, locale)

          expect(translation).to.equal('The <span class=\"highlight\">swap meet</span> at Boxted Airfield was called off.')
        })
      })
      suite('when text is "Have you met Mrs Kalyani?"', () => {
        const text = 'Have you met Mrs Kalyani?'
        test('translation should be "Have you met <span class=\"highlight\">Mrs.</span> Kalyani?"', () => {

          const translation = translationService.translate(text, locale)

          expect(translation).to.equal('Have you met <span class=\"highlight\">Mrs.</span> Kalyani?')
        })
      })
      suite('when text is "Prof Joyner of King\'s College, London."', () => {
        const text = 'Prof Joyner of King\'s College, London.'
        test('translation should be "<span class=\"highlight\">Prof.</span> Joyner of King\'s College, London."', () => {

          const translation = translationService.translate(text, locale)

          expect(translation).to.equal('<span class=\"highlight\">Prof.</span> Joyner of King\'s College, London.')
        })
      })
      suite('when text is "Tea time is usually around 4 or 4.30."', () => {
        const text = 'Tea time is usually around 4 or 4.30.'
        test('translation should be "Tea time is usually around 4 or <span class=\"highlight\">4:30</span>."', () => {

          const translation = translationService.translate(text, locale)

          expect(translation).to.equal('Tea time is usually around 4 or <span class=\"highlight\">4:30</span>.')
        })
      })
    });

    suite('when locale is american-to-britsh', () => {
      const locale = 'american-to-british'

      suite('when text requires no translation', () => {
        const text = 'We watched the footie match for a while.'
        test('translation value should be "Everything looks good to me!"', () => {
          const translation = translationService.translate(text, locale)

          expect(translation).to.equal('Everything looks good to me!')
        })
      })

      suite('when text is "Mangoes are my favorite fruit."', () => {
        const text = 'Mangoes are my favorite fruit.'
        test('translation should be "Mangoes are my <span class=\"highlight\">favourite</span> fruit."', () => {

          const translation = translationService.translate(text, locale)

          expect(translation).to.equal('Mangoes are my <span class=\"highlight\">favourite</span> fruit.')
        })
      })
      suite('when text is "I ate yogurt for breakfast."', () => {
        const text = 'I ate yogurt for breakfast.'
        test('translation should be "I ate <span class=\"highlight\">yoghurt</span> for <span class=\"highlight\">brekky</span>."', () => {

          const translation = translationService.translate(text, locale)

          expect(translation).to.equal('I ate <span class=\"highlight\">yoghurt</span> for <span class=\"highlight\">brekky</span>.')
        })
      })
      suite('when text is "We had a party at my friend\'s condo."', () => {
        const text = 'We had a party at my friend\'s condo.'
        test('translation should be "We had a party at my friend\'s <span class=\"highlight\">flat</span>."', () => {

          const translation = translationService.translate(text, locale)

          expect(translation).to.equal('We had a party at my friend\'s <span class=\"highlight\">flat</span>.')
        })
      })
      suite('when text is "Can you toss this in the trashcan for me?"', () => {
        const text = 'Can you toss this in the trashcan for me?'
        test('translation should be "Can you toss this in the <span class=\"highlight\">bin</span> for me?"', () => {

          const translation = translationService.translate(text, locale)

          expect(translation).to.equal('Can you toss this in the <span class=\"highlight\">bin</span> for me?')
        })
      })
      suite('when text is "The parking lot was full."', () => {
        const text = 'The parking lot was full.'
        test('translation should be "The <span class=\"highlight\">car park</span> was full."', () => {

          const translation = translationService.translate(text, locale)

          expect(translation).to.equal('The <span class=\"highlight\">car park</span> was full.')
        })
      })
      suite('when text is "Like a high tech Rube Goldberg machine."', () => {
        const text = 'Like a high tech Rube Goldberg machine.'
        test('translation should be "Like a high tech <span class=\"highlight\">Heath Robinson device</span>."', () => {

          const translation = translationService.translate(text, locale)

          expect(translation).to.equal('Like a high tech <span class=\"highlight\">Heath Robinson device</span>.')
        })
      })
      suite('when text is "To play hooky means to skip class or work."', () => {
        const text = 'To play hooky means to skip class or work.'
        test('translation should be "To <span class=\"highlight\">bunk off</span> means to skip class or work."', () => {

          const translation = translationService.translate(text, locale)

          expect(translation).to.equal('To <span class=\"highlight\">bunk off</span> means to skip class or work.')
        })
      })
      suite('when text is "No Mr. Bond, I expect you to die."', () => {
        const text = 'No Mr. Bond, I expect you to die.'
        test('translation should be "No <span class=\"highlight\">Mr</span> Bond, I expect you to die."', () => {

          const translation = translationService.translate(text, locale)

          expect(translation).to.equal('No <span class=\"highlight\">Mr</span> Bond, I expect you to die.')
        })
      })
      suite('when text is "Dr. Grosh will see you now."', () => {
        const text = 'Dr. Grosh will see you now.'
        test('translation should be "<span class=\"highlight\">Dr</span> Grosh will see you now."', () => {

          const translation = translationService.translate(text, locale)

          expect(translation).to.equal('<span class=\"highlight\">Dr</span> Grosh will see you now.')
        })
      })
      suite('when text is "Lunch is at 12:15 today."', () => {
        const text = 'Lunch is at 12:15 today.'
        test('translation should be "Lunch is at <span class=\"highlight\">12.15</span> today."', () => {

          const translation = translationService.translate(text, locale)

          expect(translation).to.equal('Lunch is at <span class=\"highlight\">12.15</span> today.')
        })
      })
    });

    suite('making sure the correct words are highlighted', () => {
      suite('when text is "Mangoes are my favorite fruit." and locale is "american-to-british"', () => {
        const text = 'Mangoes are my favorite fruit.'
        const locale = 'american-to-british'
        test('translation should include ""', () => {
          const translation = translationService.translate(text, locale)

          expect(translation).to.include('<span class=\"highlight\">favourite</span>')
        })
      })
      suite('when text is "I ate yogurt for breakfast." and locale is "american-to-british"', () => {
        const text = 'I ate yogurt for breakfast.'
        const locale = 'american-to-british'
        test('translation should include ""', () => {
          const translation = translationService.translate(text, locale)

          expect(translation).to.include('<span class=\"highlight\">yoghurt</span>')
        })
      })
      suite('when text is "Paracetamol takes up to an hour to work." and locale is "british-to-american"', () => {
        const text = 'Paracetamol takes up to an hour to work.'
        const locale = 'british-to-american'
        test('translation should include ""', () => {
          const translation = translationService.translate(text, locale)

          expect(translation).to.include('<span class=\"highlight\">Tylenol</span>')
        })
      })
      suite('when text is "We watched the footie match for a while." and locale is "british-to-american"', () => {
        const text = 'We watched the footie match for a while.'
        const locale = 'british-to-american'
        test('translation should include ""', () => {
          const translation = translationService.translate(text, locale)

          expect(translation).to.include('<span class=\"highlight\">soccer</span>')
        })
      })
    })
  });
});
