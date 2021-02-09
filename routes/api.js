'use strict';

const TranslationController = require('../components/translation.controller.js');
const TranslationService = require('../components/translation.service.js');
const dictionaries = require('../components/master.dictionaries.js');

module.exports = function (app) {

  const translationService = new TranslationService(dictionaries);
  const translationController = new TranslationController(translationService);


  app.route('/api/translate')
    .post(async (req, res) => {
      try {
        const response = await translationController.translate(req)

        res.json(response)
      } catch (error) {
        console.log('error in POST /api/translate', error)

        res.json({ error: error.message })
      }
    });
};
