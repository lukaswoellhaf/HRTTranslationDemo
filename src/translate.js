const LanguageTranslatorV3 = require('ibm-watson/language-translator/v3');
const { IamAuthenticator } = require('ibm-watson/auth');


/**
 * Helper 
 * @param {*} errorMessage 
 * @param {*} defaultLanguage 
 */
function getTheErrorResponse(errorMessage, defaultLanguage) {
  return {
    statusCode: 200,
    body: {
      language: defaultLanguage || 'en',
      errorMessage: errorMessage
    }
  };
}

// const translateParameter = {
//   text: 'Hello World.',
//   modelId: 'en-es',
// };

/**
  *
  * main() will be run when teh action is invoked
  *
  * @param Cloud Functions actions accept a single parameter, which must be a JSON object.
  *
  * @return The output of this action, which must be a JSON object.
  *
  */
function main(params) {

  /*
   * The default language to choose in case of an error
   */
  const defaultLanguage = 'en';

  return new Promise(function (resolve, reject) {

    try {

      console.log("PARAMS:");
      console.log(params);

      // *******TODO**********
      // - Call the language translation API of the translation service
      // see: https://cloud.ibm.com/apidocs/language-translator?code=node#translate
      // - if successful, resolve exatly like shown below with the
      // translated text in the "translation" property,
      // the number of translated words in "words"
      // and the number of characters in "characters".

      // in case of errors during the call resolve with an error message according to the pattern
      // found in the catch clause below

      // pick the language with the highest confidence, and send it back


      // Start
      // resolve({
      //   statusCode: 200,
      //   body: {
      //     translations: "<translated text>",
      //     words: 1,
      //     characters: 11,
      //   },
      //   headers: { 'Content-Type': 'application/json' }
      // End


      const languageTranslator = new LanguageTranslatorV3({
        version: params.version,
        authenticator: new IamAuthenticator({
          apikey: params.apikey,
        }),
        serviceUrl: params.url,
      });

      console.log("1");
      console.log(params.body.language);
      console.log("2");
      console.log(params.body.language === "en" ? "de" : "en");

      const translateParameter = {
        // TODO: Set a target language
        // text: "Hello, this is a test. This sentence is hard coded in the file translate.js",
        text: params.body.text,
        // modelId: params.modelId,
        source: params.body.language,
        target: params.body.language === "en" ? "de" : "en"
      }

      languageTranslator.translate(translateParameter)
        .then(translationResult => {
          // console.log(JSON.stringify(translationResult, null, 2));

          resolve({
            statusCode: 200,
            body: {
              translations: translationResult.result.translations[0].translation,
              words: translationResult.result.word_count,
              characters: translationResult.result.character_count,
            },
            headers: { 'Content-Type': 'application/json' }
          });
        })
        .catch(err => {
          console.error('Error while communicating with the AI service', err);
      resolve(getTheErrorResponse('Error while communicating with the translation service', defaultLanguage));
        });

    } catch (err) {
      console.error('Error while initializing the AI service', err);
      resolve(getTheErrorResponse('Error while initializing the translation service', defaultLanguage));
    }
  });
}
