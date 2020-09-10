import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Training } from './models/training';
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
          response.set('Access-Control-Allow-Headers', '*');
          response.status(204).send('');
          break;
        case 'POST':
          response.status(200).send('Post request');
          break;
        case 'GET':
          if (
            !request.headers.authorization ||
            !request.headers.authorization.startsWith('Bearer ')
          ) {
            response.status(401).send('Incorrect Authorization-Header.');
          } else {
            console.log('Header: ' + request.headers.authorization);
            const token = request.headers.authorization.substring(7);
            console.log(token);
            try {
              const decoded: admin.auth.DecodedIdToken = await admin
                .auth()
                .verifyIdToken(token);
              console.log(decoded.uid);
              const query: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData> = await admin
                .firestore()
                .collection('user/' + decoded.uid + '/workouts')
                .get();
              const workouts: Training[] = [];
              query.forEach(
                (
                  document: FirebaseFirestore.QueryDocumentSnapshot<
                    FirebaseFirestore.DocumentData
                  >
                ) => {
                  workouts.push(
                    new Training(
                      document.id,
                      document.data().date,
                      document.data().exercises
                    )
                  );
                }
              );
              response.status(200).send({ data: workouts });
            } catch (e) {
              console.log(e);
              response.status(408).send('Error: ' + e);
            }
          }
          break;
        default:
          response.send('Error');
      }
    }
  );
