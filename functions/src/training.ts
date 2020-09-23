import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Training } from './models/training';

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
        case 'GET':
          await getWorkouts(request, response);
          break;
        case 'POST':
          await postWorkout(request, response);
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
        .orderBy('date', 'desc')
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
              document.data().name,
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
  if (decoded) {
    if (!request.body.id) {
      await addWorkout(response, decoded);
    } else if (request.body.training) {
      await updateWorkout(request, response, decoded);
    } else {
      response.status(400).send('Body is missing.');
    }
  } else {
    response.status(408).send('Unauthorized.');
  }
}

async function addWorkout(
  response: functions.Response,
  decoded: admin.auth.DecodedIdToken
) {
  try {
    const doc: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData> = await admin
      .firestore()
      .collection('user/' + decoded.uid + '/workouts/')
      .add({ date: new Date(Date.now()) });
    const res = await doc.get();
    response.status(200).send({ data: res.data(), id: res.id });
  } catch (err) {
    response.status(400).send('Error: ' + err);
  }
}

async function updateWorkout(
  request: functions.https.Request,
  response: functions.Response,
  decoded: admin.auth.DecodedIdToken
) {
  try {
    const data: any = {};
    if (request.body.training.name) data.name = request.body.training.name;
    if (request.body.training.date) data.date = request.body.training.date;
    if (request.body.training.exercises)
      data.exercises = request.body.training.exercises;
    const res: FirebaseFirestore.WriteResult = await admin
      .firestore()
      .doc('user/' + decoded.uid + '/workouts/' + request.body.id)
      .set(data);
    response.status(200).send({ data: res });
  } catch (err) {
    response.status(400).send('Error: ' + err);
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
