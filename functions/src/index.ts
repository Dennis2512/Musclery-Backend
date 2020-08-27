'use strict';
import * as functions from 'firebase-functions';
import * as trainingModule from './training';
import * as caloriesModule from './calories';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript

export const calories: functions.HttpsFunction = functions
  .region('europe-west2')
  .https.onRequest(
    (request: functions.https.Request, response: functions.Response) => {
      caloriesModule.handler(request, response);
    }
  );

export const training: functions.HttpsFunction = functions
  .region('europe-west2')
  .https.onRequest(
    (request: functions.https.Request, response: functions.Response) => {
      trainingModule.handler(request, response);
    }
  );
