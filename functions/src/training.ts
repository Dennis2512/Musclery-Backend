import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();

export const training: functions.HttpsFunction = functions
  .region('europe-west2')
  .https.onRequest(
    async (
      request: functions.https.Request,
      response: functions.Response
    ): Promise<void> => {
      switch (request.method) {
        case 'OPTIONS':
          response.set('Access-Control-Allow-Methods', ['GET', 'POST']);
          response.status(204).send('');
          break;
        case 'POST':
          response.send('Post request');
          break;
        case 'GET':
          response.send('Get request');
          break;
        default:
          response.send('Error');
      }
    }
  );
