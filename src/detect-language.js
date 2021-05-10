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

/**
  *
  * main() will be run when the action is invoked
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
      // - Call the language identification API of the translation service
      // see: https://cloud.ibm.com/apidocs/language-translator?code=node#identify-language
      // - if successful, resolve exactly like shown below with the
      // language that is most probable the best one in the "language" property
      // and the confidence it got detected in the "confidence" property

      // in case of errors during the call resolve with an error message according to the pattern 
      // found in the catch clause below

      // Start
      // resolve({
      //   statusCode: 200,
      //   body: {
      //     text: params.text,
      //     language: "<Best Language>",
      //     confidence: 0.5,
      //   },
      //   headers: { 'Content-Type': 'application/json' }
      //   End


      const languageTranslator = new LanguageTranslatorV3({
        version: '2018-05-01', // TODO: Replace this with params.version
        authenticator: new IamAuthenticator({
          apikey: 'RfDmJlM1xpNWR7NDzZbTD1nU-AoLnooDmk17YyAx3iOf',
        }),
        serviceUrl: 'https://api.eu-de.language-translator.watson.cloud.ibm.com/instances/32cc503b-9be6-4c1c-9779-41c2f273a735',
      });

      const identifyParameter = {
        // text: params.text,
        // text: "Hello, this is a test. This sentence is hard coded in the file detect-language.js"
        text: params.text || params.defaultText
      };

      languageTranslator.identify(identifyParameter)
        .then(identifiedLanguages => {
          // console.log(JSON.stringify(identifiedLanguages, null, 2));
          resolve({
            statusCode: 200,
            body: {
              text: identifyParameter.text,
              language: identifiedLanguages.result.languages[0].language,
              confidence: identifiedLanguages.result.languages[0].confidence,
            },
            headers: { 'Content-Type': 'application/json' }
          });
        })
        .catch(err => {
          console.error('Error while communicating with the AI service', err);
      resolve(getTheErrorResponse('Error while communicating with the language-detecting service', defaultLanguage));
        });

    } catch (err) {
      console.error('Error while initializing the AI service', err);
      resolve(getTheErrorResponse('Error while initializing the language-detecting service', defaultLanguage));
    }
  });
}
