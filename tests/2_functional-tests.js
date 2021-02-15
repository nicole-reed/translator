const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server.js');

chai.use(chaiHttp);

suite('Functional Tests', async () => {

  suite('POST /api/translate', async () => {

    test('Translation with valid text and locale fields', async () => {
      const reqBody = {
        text: 'Mangoes are my favorite fruit.',
        locale: 'american-to-british'
      }
      const translation = 'Mangoes are my <span class="highlight">favourite</span> fruit.'

      const response = await chai.request(server)
        .post('/api/translate')
        .send(reqBody)
      console.log('response.body', response.body)

      assert.isObject(response.body)
      assert.equal(response.body.text, reqBody.text)
      assert.equal(response.body.translation, translation)
    })

    test('Translation with valid text but invalid locale field', async () => {
      const reqBody = {
        text: 'Mangoes are my favorite fruit.',
        locale: 'french-to-british'
      }
      const expected = 'Invalid value for locale field'

      const response = await chai.request(server)
        .post('/api/translate')
        .send(reqBody)

      assert.equal(response.body.error, expected)

    })

    test('Translation with missing text field', async () => {
      const reqBody = {
        locale: 'french-to-british'
      }
      const expected = 'Required field(s) missing'

      const response = await chai.request(server)
        .post('/api/translate')
        .send(reqBody)

      assert.equal(response.body.error, expected)
    })

    test('Translation with missing locale field', async () => {
      const reqBody = {
        text: 'Do you want to watch footie?'
      }
      const expected = 'Required field(s) missing'

      const response = await chai.request(server)
        .post('/api/translate')
        .send(reqBody)

      assert.equal(response.body.error, expected)
    })

    test('Translation with empty text field', async () => {
      const reqBody = {
        text: '',
        locale: 'american-to-british'
      }
      const expected = 'No text to translate'

      const response = await chai.request(server)
        .post('/api/translate')
        .send(reqBody)

      assert.equal(response.body.error, expected)
    })

    test('Translation with text that needs no translation', async () => {
      const reqBody = {
        text: 'SaintPeter and nhcarrigan give their regards!',
        locale: 'british-to-american'
      }
      const translation = 'Everything looks good to me!'

      const response = await chai.request(server)
        .post('/api/translate')
        .send(reqBody)
      console.log('response.body', response.body)

      assert.isObject(response.body)
      assert.equal(response.body.text, reqBody.text)
      assert.equal(response.body.translation, translation)
    })


  });
});
