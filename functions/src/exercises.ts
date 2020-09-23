import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Exercise } from './models/exercise';

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
          await getExercises(request, response);
          break;
        default:
          response.status(405).send('Method not allowed.');
      }
    }
  );

// get function

async function getExercises(
  request: functions.https.Request,
  response: functions.Response
): Promise<void> {
  try {
    const docs: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData> = await admin
      .firestore()
      .collection('exercises')
      .get();
    const exs: Exercise[] = [];
    docs.forEach((doc) => {
      let include: boolean = true;
      if (request.body.muscles) {
        const docmuscles: String[] = doc.get('muskelgruppen');
        const muscles: String[] = request.body.muscles;
        include = muscles.every((v) => docmuscles.includes(v));
      }
      if (include) {
        exs.push(
          new Exercise(
            doc.id,
            doc.get('name'),
            doc.get('muskelgruppen'),
            doc.get('sets')
          )
        );
      }
    });
    response.status(200).send({ data: exs });
  } catch (e) {
    response.status(400).send('Error: ' + e);
  }
}
