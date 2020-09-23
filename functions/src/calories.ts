import * as functions from 'firebase-functions';
export const calories: functions.HttpsFunction = functions
  .region('europe-west2')
  .https.onRequest(
    (request: functions.https.Request, response: functions.Response) => {
      response.send('Hello from calories!');
      
    }
  );
