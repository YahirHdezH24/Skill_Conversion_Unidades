const Alexa = require('ask-sdk-core');
const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');

// Configuración de las traducciones
const languageStrings = {
    'en': {
        translation: {
            WELCOME_MSG: 'Welcome Yahir, you can ask me to convert units. How can I help you?',
            HELP_MSG: 'You can ask me to convert units. How can I help you?',
            GOODBYE_MSG: 'Goodbye!',
            ERROR_MSG: 'Sorry, I had trouble doing what you asked. Please try again.',
            CONVERT_MSG: '{{amount}} {{unitFrom}} equals {{convertedAmount}} {{unitTo}}.',
            CONVERT_ERROR_MSG: 'Sorry, I cannot convert {{amount}} {{unitFrom}} to {{unitTo}}.'
        }
    },
    'es': {
        translation: {
            WELCOME_MSG: 'Bienvenido Yahir, puedes pedirme convertir unidades. ¿En qué puedo ayudarte?',
            HELP_MSG: 'Puedes pedirme convertir unidades. ¿En qué puedo ayudarte?',
            GOODBYE_MSG: '¡Adiós!',
            ERROR_MSG: 'Lo siento, tuve problemas para hacer lo que pediste. Por favor intenta de nuevo.',
            CONVERT_MSG: '{{amount}} {{unitFrom}} equivalen a {{convertedAmount}} {{unitTo}}.',
            CONVERT_ERROR_MSG: 'Lo siento, no puedo convertir {{amount}} {{unitFrom}} a {{unitTo}}.'
        }
    }
};

// Configuración de i18next
const LocalizationInterceptor = {
    process(handlerInput) {
        const localizationClient = i18n.use(sprintf).init({
            lng: handlerInput.requestEnvelope.request.locale,
            fallbackLng: 'en',
            resources: languageStrings,
            returnObjects: true
        });
        const attributes = handlerInput.attributesManager.getRequestAttributes();
        attributes.t = function (...args) {
            return localizationClient.t(...args);
        }
    }
};

const conversionRates = {
    "pie a yardas": 0.333333,
    "pie a kilometros": 0.0003048,
    "pie a metros": 0.3048,
    "pie a centimetros": 30.48,
    "pulgadas a pie": 0.0833333,
    "pulgadas a yardas": 0.0277778,
    "pulgadas a kilometros": 0.0000254,
    "pulgadas a metros": 0.0254,
    "pulgadas a centimetros": 2.54,
    "yardas a pulgadas": 36,
    "yardas a kilometros": 0.0009144,
    "yardas a pie": 3,
    "yardas a metros": 0.9144,
    "yardas a centimetros": 91.44,
    "kilometros a pie": 3280.84,
    "kilometros a pulgadas": 39370.1,
    "kilometros a yardas": 1093.61,
    "kilometros a metros": 1000,
    "kilometros a centimetros": 100000,
    "metros a pie": 3.28084,
    "metros a pulgadas": 39.3701,
    "metros a yardas": 1.09361,
    "metros a kilometros": 0.001,
    "metros a centimetros": 100,
    "centimetros a pie": 0.0328084,
    "centimetros a pulgadas": 0.393701,
    "centimetros a yardas": 0.0109361,
    "centimetros a kilometros": 0.00001,
    "centimetros a metros": 0.01,
    
    "feet to yards": 0.333333,
    "feet to kilometers": 0.0003048,
    "feet to meters": 0.3048,
    "feet to centimeters": 30.48,
    "inches to feet": 0.0833333,
    "inches to yards": 0.0277778,
    "inches to kilometers": 0.0000254,
    "inches to meters": 0.0254,
    "inches to centimeters": 2.54,
    "yards to inches": 36,
    "yards to kilometers": 0.0009144,
    "yards to feet": 3,
    "yards to meters": 0.9144,
    "yards to centimeters": 91.44,
    "kilometers to feet": 3280.84,
    "kilometers to inches": 39370.1,
    "kilometers to yards": 1093.61,
    "kilometers to meters": 1000,
    "kilometers to centimeters": 100000,
    "meters to feet": 3.28084,
    "meters to inches": 39.3701,
    "meters to yards": 1.09361,
    "meters to kilometers": 0.001,
    "meters to centimeters": 100,
    "centimeters to feet": 0.0328084,
    "centimeters to inches": 0.393701,
    "centimeters to yards": 0.0109361,
    "centimeters to kilometers": 0.00001,
    "centimeters to meters": 0.01
};

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('WELCOME_MSG');
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const ConvertUnitsIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ConversorIntent';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const unitType = handlerInput.requestEnvelope.request.intent.slots.unitType.value.toLowerCase();
        const amount = parseFloat(handlerInput.requestEnvelope.request.intent.slots.numUno.value);
        
        let convertedAmount;
        let responseMessage;
        
        if (conversionRates[unitType]) {
            convertedAmount = amount * conversionRates[unitType];
            const unitFrom = unitType.split(' a ')[0];
            const unitTo = unitType.split(' a ')[1];
            responseMessage = requestAttributes.t('CONVERT_MSG', {
                amount: amount,
                unitFrom: unitFrom,
                convertedAmount: convertedAmount.toFixed(2),
                unitTo: unitTo
            });
        } else {
            const unitFrom = unitType.split(' a ')[0];
            const unitTo = unitType.split(' a ')[1];
            responseMessage = requestAttributes.t('CONVERT_ERROR_MSG', {
                amount: amount,
                unitFrom: unitFrom,
                unitTo: unitTo
            });
        }

        return handlerInput.responseBuilder
            .speak(responseMessage)
            .getResponse();
    }
};


const HelloWorldIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'HelloWorldIntent';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('HELLO_MSG');
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('HELP_MSG');
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('GOODBYE_MSG');
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('ERROR_MSG');
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        return handlerInput.responseBuilder.getResponse();
    }
};

const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('REFLECTOR_MSG', intentName);
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('ERROR_MSG');
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

// Construcción del handler
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        ConvertUnitsIntentHandler,
        HelloWorldIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler
    )
    .addRequestInterceptors(LocalizationInterceptor)
    .addErrorHandlers(ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();