import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();

export const exercises: functions.HttpsFunction = functions
  .region('europe-west2')
  .https.onRequest(
    async (
      request: functions.https.Request,
      response: functions.Response
    ): Promise<void> => {
      switch (request.method) {
        case 'OPTIONS':
          response.set('Access-Control-Allow-Methods', ['GET', 'POST']);
          response.set('Access-Control-Allow-Headers', '*');
          response.status(204).send('');
          break;
        case 'GET':
          response.status(200).send('OK');
          break;
        default:
          response.status(405).send('Method not allowed.');
      }
    }
  );
