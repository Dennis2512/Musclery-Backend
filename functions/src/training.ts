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
          postWorkout(request, response);
          break;
        case 'GET':
          getWorkouts(request, response);
          break;
        default:
          response.status(405).send('Method not allowed.');
      }
    }
  );

// get function

async function getWorkouts(
  request: functions.https.Request,
  response: functions.Response
) {
  const decoded = await authorize(request);
  if (decoded) {
    try {
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
    } catch (err) {
      response.status(400).send('Error: ' + err);
    }
  } else {
    response.status(408).send('Unauthorized.');
  }
}

// post function

async function postWorkout(
  request: functions.https.Request,
  response: functions.Response
) {
  const decoded = await authorize(request);
  if (decoded && request.body.workout) {
    try {
      const doc: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData> = await admin
        .firestore()
        .collection('user/' + decoded.uid + '/workouts/')
        .add(request.body.workout);
      response.status(200).send({ id: doc.id });
    } catch (err) {
      response.status(400).send('Error: ' + err);
    }
  } else if (!decoded) {
    response.status(408).send('Unauthorized.');
  } else if (!request.body.workout) {
    response.status(400).send('Body is missing.');
  }
}

// authorize

async function authorize(
  request: functions.https.Request
): Promise<admin.auth.DecodedIdToken | null> {
  if (
    !request.headers.authorization ||
    !request.headers.authorization.startsWith('Bearer ')
  ) {
    return null;
  } else {
    const token = request.headers.authorization.substring(7);
    try {
      const decoded: admin.auth.DecodedIdToken = await admin
        .auth()
        .verifyIdToken(token);
      return decoded;
    } catch (err) {
      return null;
    }
  }
}
